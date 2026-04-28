import mongoose from 'mongoose';
import ipoModel from '../models/ipo.model.js';
import bidModel from '../models/bid.model.js';
import stockModel from '../models/stock.model.js';
import ledgerModel from '../models/ledger.model.js';
import portfolioModel from '../models/portFolio.model.js';
import companyModel from '../models/componey.model.js';

const closeIPOInternal = async (ipoId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        // feth the ipo from the i d
        const ipo = await ipoModel.findById(ipoId).session(session);
        if (!ipo) throw new Error('IPO not found');

        //  by chanche jo ipo pela jj chlsoe hhoi to return karu clodes realted deatils 
        if (ipo.status === 'CLOSED') {
            await session.commitTransaction();
            session.endSession();
            return {
                ipoId: ipo._id,
                cutoffPrice: ipo.cutoffPrice,
                soldShares: ipo.soldShares
            };
        }

        // comooany and stock deatils 
        const stock = await stockModel.findById(ipo.stockId).session(session);
        if (!stock) throw new Error('Stock not found');

        const company = await companyModel.findById(ipo.createdBy).session(session);
        if (!company) throw new Error('Company not found');

        // company balance ni deatils
        let companyBalance = company.balance || 0;

        // ipo related bid details
        const bids = await bidModel
            .find({ ipoId })
            .sort({ bidPrice: -1, createdAt: 1 })
            .session(session);

        // ido koi yee lidhu j nai hoi to aiya thi  j  return thai jao 
        if (bids.length === 0) {
            ipo.cutoffPrice = null;
            ipo.soldShares = 0;
            ipo.status = 'CLOSED';
            await ipo.save({ session });

            await session.commitTransaction();
            session.endSession();

            return {
                ipoId: ipo._id,
                cutoffPrice: null,
                soldShares: 0
            };
        }

        // cutoff price ni calculation wiith the helo of prefix suum tech 
        let runningDemand = 0;
        let cutoffPrice = bids[bids.length - 1].bidPrice;

        for (const bid of bids) {
            runningDemand += bid.quantity;
            if (runningDemand >= ipo.totalShares) {
                cutoffPrice = bid.bidPrice;
                break;
            }
        }

        // allocation logic
        let sharesLeft = ipo.totalShares;

        // Initialize
        for (const bid of bids) {
            bid.allocatedQuantity = 0;
            bid.status = 'REJECTED';
        }

        // Higher bids → full allocation    
        for (const bid of bids) {
            if (bid.bidPrice > cutoffPrice && sharesLeft > 0) {
                const alloc = Math.min(bid.quantity, sharesLeft);
                bid.allocatedQuantity = alloc;
                bid.status = 'ALLOCATED';
                sharesLeft -= alloc;
            }
        }
    
        const cutoffBids = bids.filter(b => b.bidPrice === cutoffPrice);

        for (const bid of cutoffBids) {
            if (sharesLeft <= 0) break;

            const alloc = Math.min(bid.quantity, sharesLeft);

            bid.allocatedQuantity = alloc;
            bid.status = alloc > 0 ? 'ALLOCATED' : 'REJECTED';

            sharesLeft -= alloc;
        }


        let soldShares = 0;

        for (const bid of bids) {
            soldShares += bid.allocatedQuantity;
        }

        let settlementPrice = null;
        if (soldShares > 0) {
            settlementPrice = cutoffPrice;
        }

        // settlement and ledger entries
        for (const bid of bids) {

            const lockedAmount = bid.quantity * bid.bidPrice;
            const finalAmount = settlementPrice
                ? bid.allocatedQuantity * settlementPrice
                : 0;

            const refundAmount = Math.max(lockedAmount - finalAmount, 0);

            let currentBalance = 0;

            const lastLedger = await ledgerModel
                .findOne({ userId: bid.userId })
                .sort({ createdAt: -1, _id: -1 })
                .session(session);

            if (lastLedger) currentBalance = lastLedger.balanceAfter;

            // user ledger entry for buy and unlock
            if (finalAmount > 0) {
                await ledgerModel.create([{
                    userId: bid.userId,     
                    type: 'BUY',
                    symbol: stock.symbol,
                    quantity: bid.allocatedQuantity,
                    price: settlementPrice,
                    amount: finalAmount,
                    balanceAfter: currentBalance,
                    referenceId: bid._id,
                    referenceModel: 'Bid'
                }], { session });

                // company ledger entry for sell
                companyBalance += finalAmount;

                await ledgerModel.create([{
                    companyId: company._id,
                    type: 'IPO_SELL',
                    symbol: stock.symbol,
                    quantity: bid.allocatedQuantity,
                    price: settlementPrice,
                    amount: finalAmount,
                    balanceAfter: companyBalance,
                    referenceId: bid._id,
                    referenceModel: 'Bid'
                }], { session });
            }

            // unlock the remaining locked amount
            const refundQuantity = bid.quantity - bid.allocatedQuantity;

            if (refundAmount > 0) {
                currentBalance += refundAmount;

                await ledgerModel.create([{
                    userId: bid.userId,
                    type: 'UNLOCK',
                    symbol: stock.symbol,
                    quantity: refundQuantity,   // ✅ FIXED
                    price: bid.bidPrice,
                    amount: refundAmount,
                    balanceAfter: currentBalance,
                    referenceId: bid._id,
                    referenceModel: 'Bid'
                }], { session });
            }

            // update user portfolio if allocated shares > 0
            if (bid.allocatedQuantity > 0) {

                let portfolio = await portfolioModel
                    .findOne({ userId: bid.userId })
                    .session(session);

                if (!portfolio) {
                    portfolio = new portfolioModel({
                        userId: bid.userId,
                        stocks: []
                    });
                }

                let stockEntry = portfolio.stocks.find(
                    s => s.stockId?.toString() === stock._id.toString()
                );

                if (!stockEntry) {
                    portfolio.stocks.push({
                        stockId: stock._id,
                        symbol: stock.symbol,
                        quantity: 0
                    });
                    stockEntry = portfolio.stocks[portfolio.stocks.length - 1];
                }

                stockEntry.quantity += bid.allocatedQuantity;

                await portfolio.save({ session });
            }

            await bid.save({ session });
        }

        // Update IPO + Stock + Company
        ipo.cutoffPrice = settlementPrice;
        ipo.soldShares = soldShares;
        ipo.status = 'CLOSED';

        if (soldShares > 0) {
            stock.issuedShares += soldShares;
            stock.isListed = true;
            stock.currentPrice = settlementPrice;
            await stock.save({ session });
        }

        company.balance = companyBalance;
        await company.save({ session });

        await ipo.save({ session });

        await session.commitTransaction();
        session.endSession();

        return {
            ipoId: ipo._id,
            cutoffPrice: ipo.cutoffPrice,
            soldShares: ipo.soldShares
        };

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

export { closeIPOInternal };
