import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import tradeModel from "../models/trade.model.js";
import ledgerModel from "../models/ledger.model.js";
import portfolioModel from "../models/portFolio.model.js";
import { sendToJavaEngine } from "../utils/matchingEngine.js";

export const createOrder = async (data) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        // create the oreder with OPEN status
        const orderArr = await orderModel.create([{
            ...data,
            status: "OPEN"
        }], { session });

        const order = orderArr[0];

        // get the balance of the user form the last ledger entry
        const lastLedger = await ledgerModel
            .findOne({ userId: data.userId })
            .sort({ createdAt: -1 })
            .session(session);

        const currentBalance = lastLedger ? lastLedger.balanceAfter : 0;

        // check whether its buy or sell order and lock the amount or stock accordingly 
        if (data.type === "BUY") {

            const lockAmount = order.price * order.quantity;

            if (currentBalance < lockAmount) {
                throw new Error("Insufficient balance");
            }

            await ledgerModel.create([{
                userId: data.userId,
                type: "LOCK",
                symbol: order.symbol,
                amount: lockAmount,
                balanceAfter: currentBalance - lockAmount,
                referenceId: order._id,
                referenceModel: "Order"
            }], { session });

        } else {

            //  get the user portfolio and check whether the user has sufficient stock to sell and lock the stock
            let portfolio = await portfolioModel.findOne({ userId: data.userId }).session(session);

            if (!portfolio) throw new Error("Portfolio not found");

            const stock = portfolio.stocks.find(
                s => s.stockId.toString() === data.stockId.toString()
            );

            if (!stock || stock.quantity < order.quantity) {
                throw new Error("Insufficient stock");
            }

            stock.quantity -= order.quantity;
            stock.locked = (stock.locked || 0) + order.quantity;

            await portfolio.save({ session });

            // ledger entry (optional tracking)
            await ledgerModel.create([{
                userId: data.userId,
                type: "LOCK",
                symbol: order.symbol,
                quantity: order.quantity,
                amount: 0,
                balanceAfter: currentBalance,
                referenceId: order._id,
                referenceModel: "Order"
            }], { session });
        }

        // get the res form the java engine
        const trades = await sendToJavaEngine(order);

        if (!trades || trades.length === 0) {
            await session.commitTransaction();
            session.endSession();
            return order;
        }

        let totalFilled = 0;

        // iterate over the trades and update the respective ledgers and portfolios of buyers and sellers
        for (const trade of trades) {

            const tradeAmount = trade.price * trade.quantity;
            totalFilled += trade.quantity;

            const buyOrder = await orderModel.findById(trade.buyOrderId).session(session);
            const sellOrder = await orderModel.findById(trade.sellOrderId).session(session);

            const buyerId = buyOrder.userId;
            const sellerId = sellOrder.userId;

            // create trade entry
            const tradeDoc = await tradeModel.create([{
                buyerId,
                sellerId,
                buyOrderId: trade.buyOrderId,
                sellOrderId: trade.sellOrderId,
                price: trade.price,
                quantity: trade.quantity,
                symbol: trade.symbol,
                totalAmount: tradeAmount
            }], { session });

            const tradeId = tradeDoc[0]._id;

            // update buyer portfolio (add stock)
            let buyerPortfolio = await portfolioModel.findOne({ userId: buyerId }).session(session);

            if (!buyerPortfolio) {
                buyerPortfolio = new portfolioModel({ userId: buyerId, stocks: [] });
            }

            let buyerStock = buyerPortfolio.stocks.find(
                s => s.stockId.toString() === data.stockId.toString()
            );

            if (!buyerStock) {
                buyerStock = { stockId: data.stockId, quantity: 0, locked: 0 };
                buyerPortfolio.stocks.push(buyerStock);
            }

            buyerStock.quantity += trade.quantity;

            await buyerPortfolio.save({ session });

            // update seller portfolio (deduct locked stock)
            let sellerPortfolio = await portfolioModel.findOne({ userId: sellerId }).session(session);

            const sellerStock = sellerPortfolio.stocks.find(
                s => s.stockId.toString() === data.stockId.toString()
            );

            sellerStock.locked -= trade.quantity;

            await sellerPortfolio.save({ session });

            // update the ledgers of buyer and seller
            const buyerLast = await ledgerModel
                .findOne({ userId: buyerId })
                .sort({ createdAt: -1 })
                .session(session);

            await ledgerModel.create([{
                userId: buyerId,
                type: "BUY",
                symbol: trade.symbol,
                quantity: trade.quantity,
                price: trade.price,
                amount: tradeAmount,
                balanceAfter: buyerLast.balanceAfter,
                referenceId: tradeId,
                referenceModel: "Trade"
            }], { session });

            // update the seller ledger (add amount)
            const sellerLast = await ledgerModel
                .findOne({ userId: sellerId })
                .sort({ createdAt: -1 })
                .session(session);

            const sellerBalance = sellerLast.balanceAfter + tradeAmount;

            await ledgerModel.create([{
                userId: sellerId,
                type: "SELL",
                symbol: trade.symbol,
                quantity: trade.quantity,
                price: trade.price,
                amount: tradeAmount,
                balanceAfter: sellerBalance,
                referenceId: tradeId,
                referenceModel: "Trade"
            }], { session });
        }

        // unloack the remaining amount or stock for the order if not completely filled and update the order status accordingly
        const remainingQty = order.quantity - totalFilled;

        if (remainingQty > 0 && data.type === "SELL") {

            const portfolio = await portfolioModel.findOne({ userId: order.userId }).session(session);

            const stock = portfolio.stocks.find(
                s => s.stockId.toString() === data.stockId.toString()
            );

            stock.locked -= remainingQty;
            stock.quantity += remainingQty;

            await portfolio.save({ session });
        }

        if (remainingQty > 0 && data.type === "BUY") {

            const lastLedgerAfter = await ledgerModel
                .findOne({ userId: order.userId })
                .sort({ createdAt: -1 })
                .session(session);

            const unlockAmount = remainingQty * order.price;

            await ledgerModel.create([{
                userId: order.userId,
                type: "UNLOCK",
                symbol: order.symbol,
                amount: unlockAmount,
                balanceAfter: lastLedgerAfter.balanceAfter + unlockAmount,
                referenceId: order._id,
                referenceModel: "Order"
            }], { session });
        }

        // update order status and remaining quantity
        order.remainingQty = remainingQty;
        order.status = remainingQty === 0 ? "COMPLETED" : "PARTIAL";

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        return order;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};