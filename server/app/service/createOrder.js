import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import tradeModel from "../models/trade.model.js";
import ledgerModel from "../models/ledger.model.js";
import portfolioModel from "../models/portFolio.model.js";
import stockModel from "../models/stock.model.js";
import { sendToJavaEngine } from "./sendToJavaEngine.js";
import { publishRealtimeEvent } from "../realtime/socket.js";

const publishOrderEvents = async (orderSnapshot, trades, latestStock) => {
    const tradeList = trades || [];

    if (tradeList.length > 0) {
        await publishRealtimeEvent("market:trade-executed", {
            order: orderSnapshot,
            trades: tradeList,
            stock: latestStock,
        });
    }

    await publishRealtimeEvent("market:order-updated", {
        order: orderSnapshot,
        stock: latestStock,
        trades: tradeList,
    });

    if (latestStock) {
        await publishRealtimeEvent("market:stock-updated", latestStock);
    }
};

const updateMatchedOrder = async (matchedOrder, filledQty, session) => {
    if (!matchedOrder) {
        return;
    }

    matchedOrder.remainingQty = Math.max(
        0,
        (matchedOrder.remainingQty ?? matchedOrder.quantity) - filledQty
    );
    matchedOrder.status =
        matchedOrder.remainingQty === 0 ? "COMPLETED" : "PARTIAL";
    await matchedOrder.save({ session });
};

export const createOrder = async (data) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const stockBySymbol = await stockModel.findOne({ symbol: data.symbol }).session(session);
        if (!stockBySymbol) {
            throw new Error("Stock not found");
        }

        const targetStockId = stockBySymbol._id.toString();
        const isTargetStock = (s) => {
            const bySymbol = s.symbol && s.symbol.toString() === data.symbol.toString();
            const byStockId = s.stockId && s.stockId.toString() === targetStockId;
            return bySymbol || byStockId;
        };

        const orderArr = await orderModel.create([{
            ...data,
            status: "OPEN"
        }], { session });

        const order = orderArr[0];

        const lastLedger = await ledgerModel
            .findOne({ userId: data.userId })
            .sort({ createdAt: -1, _id: -1 })
            .session(session);

        const currentBalance = lastLedger ? lastLedger.balanceAfter : 0;

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

            let portfolio = await portfolioModel.findOne({ userId: data.userId }).session(session);

            if (!portfolio) {
                const createdPortfolio = await portfolioModel.create(
                    [{ userId: data.userId, stocks: [] }],
                    { session }
                );
                portfolio = createdPortfolio[0];
            }

            const stock = portfolio.stocks.find(isTargetStock);

            if (!stock || stock.quantity < order.quantity) {
                throw new Error("Insufficient stock");
            }

            stock.quantity -= order.quantity;
            stock.locked = (stock.locked || 0) + order.quantity;

            await portfolio.save({ session });

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

        const response = await sendToJavaEngine(order);
        const trades = response.trades || [];

        if (trades.length === 0) {
            await session.commitTransaction();
            session.endSession();

            const latestStock = await stockModel.findById(stockBySymbol._id).lean();
            const orderSnapshot = order.toObject ? order.toObject() : order;
            await publishOrderEvents(orderSnapshot, [], latestStock);

            return order;
        }

        let totalFilled = 0;

        for (const trade of trades) {

            const tradeAmount = trade.price * trade.quantity;
            totalFilled += trade.quantity;

            const buyOrder = await orderModel.findById(trade.buyOrderId).session(session);
            const sellOrder = await orderModel.findById(trade.sellOrderId).session(session);

            if (!buyOrder || !sellOrder) {
                throw new Error("Matched order not found");
            }

            const buyerId = buyOrder.userId;
            const sellerId = sellOrder.userId;

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

            if (buyOrder._id.toString() !== order._id.toString()) {
                await updateMatchedOrder(buyOrder, trade.quantity, session);
            }

            if (sellOrder._id.toString() !== order._id.toString()) {
                await updateMatchedOrder(sellOrder, trade.quantity, session);
            }

            let buyerPortfolio = await portfolioModel.findOne({ userId: buyerId }).session(session);

            if (!buyerPortfolio) {
                buyerPortfolio = new portfolioModel({ userId: buyerId, stocks: [] });
            }

            let buyerStock = buyerPortfolio.stocks.find(isTargetStock);

            if (!buyerStock) {
                buyerStock = {
                    symbol: data.symbol,
                    stockId: stockBySymbol._id,
                    quantity: 0,
                    locked: 0,
                    averagePrice: 0
                };
                buyerPortfolio.stocks.push(buyerStock);
            }

            const previousQty = buyerStock.quantity;
            buyerStock.quantity += trade.quantity;
            buyerStock.averagePrice =
                buyerStock.quantity > 0
                    ? ((buyerStock.averagePrice || 0) * previousQty +
                        trade.price * trade.quantity) /
                      buyerStock.quantity
                    : trade.price;

            await buyerPortfolio.save({ session });

            let sellerPortfolio = await portfolioModel.findOne({ userId: sellerId }).session(session);
            if (!sellerPortfolio) {
                throw new Error("Seller portfolio not found");
            }

            const sellerStock = sellerPortfolio.stocks.find(isTargetStock);
            if (!sellerStock) {
                throw new Error("Seller stock not found in portfolio");
            }

            sellerStock.locked -= trade.quantity;

            await sellerPortfolio.save({ session });

            const buyerLast = await ledgerModel
                .findOne({ userId: buyerId })
                .sort({ createdAt: -1, _id: -1 })
                .session(session);
            const buyerBalance = buyerLast ? buyerLast.balanceAfter : 0;

            await ledgerModel.create([{
                userId: buyerId,
                type: "BUY",
                symbol: trade.symbol,
                quantity: trade.quantity,
                price: trade.price,
                amount: tradeAmount,
                balanceAfter: buyerBalance,
                referenceId: tradeId,
                referenceModel: "Trade"
            }], { session });

            if (buyOrder.price > trade.price) {
                const refund = (buyOrder.price - trade.price) * trade.quantity;

                const buyerLastAfter = await ledgerModel
                    .findOne({ userId: buyerId })
                    .sort({ createdAt: -1, _id: -1 })
                    .session(session);

                const updatedBalance = (buyerLastAfter ? buyerLastAfter.balanceAfter : 0) + refund;

                await ledgerModel.create([{
                    userId: buyerId,
                    type: "UNLOCK",
                    symbol: trade.symbol,
                    amount: refund,
                    balanceAfter: updatedBalance,
                    referenceId: tradeId,
                    referenceModel: "Trade"
                }], { session });
            }

            const sellerLast = await ledgerModel
                .findOne({ userId: sellerId })
                .sort({ createdAt: -1, _id: -1 })
                .session(session);

            const sellerBalance = (sellerLast ? sellerLast.balanceAfter : 0) + tradeAmount;

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

        const lastTrade = trades[trades.length - 1];

        await stockModel.findByIdAndUpdate(
            stockBySymbol._id,
            { currentPrice: lastTrade.price },
            { session }
        );

        const remainingQty = order.quantity - totalFilled;

        if (remainingQty > 0 && data.type === "SELL") {

            const portfolio = await portfolioModel.findOne({ userId: order.userId }).session(session);
            if (!portfolio) {
                throw new Error("Portfolio not found");
            }

            const stock = portfolio.stocks.find(isTargetStock);
            if (!stock) {
                throw new Error("Stock not found in portfolio");
            }

            stock.locked -= remainingQty;
            stock.quantity += remainingQty;

            const sellerLedgerAfter = await ledgerModel
                .findOne({ userId: order.userId })
                .sort({ createdAt: -1, _id: -1 })
                .session(session);

            await ledgerModel.create([{
                userId: order.userId,
                type: "UNLOCK",
                symbol: order.symbol,
                quantity: remainingQty,
                amount: 0,
                balanceAfter: sellerLedgerAfter ? sellerLedgerAfter.balanceAfter : 0,
                referenceId: order._id,
                referenceModel: "Order"
            }], { session });

            await portfolio.save({ session });
        }

        if (remainingQty > 0 && data.type === "BUY") {

            const lastLedgerAfter = await ledgerModel
                .findOne({ userId: order.userId })
                .sort({ createdAt: -1, _id: -1 })
                .session(session);

            const unlockAmount = remainingQty * order.price;

            await ledgerModel.create([{
                userId: order.userId,
                type: "UNLOCK",
                symbol: order.symbol,
                amount: unlockAmount,
                balanceAfter: (lastLedgerAfter ? lastLedgerAfter.balanceAfter : 0) + unlockAmount,
                referenceId: order._id,
                referenceModel: "Order"
            }], { session });
        }

        order.remainingQty = remainingQty;
        order.status = remainingQty === 0 ? "COMPLETED" : "PARTIAL";

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        const latestStock = await stockModel.findById(stockBySymbol._id).lean();
        const orderSnapshot = order.toObject ? order.toObject() : order;
        await publishOrderEvents(orderSnapshot, trades, latestStock);

        return order;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
