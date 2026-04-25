import ipoModel from "../models/ipo.model.js";
import stockModel from "../models/stock.model.js";
import bidModel from "../models/bid.model.js";
import ledgerModel from "../models/ledger.model.js";
import { closeIPOInternal } from "../service/closeIPOInternal.js";
import mongoose from "mongoose";

const createIPO = async (req, res) => {
    try {
        const { stockId, totalShares, startDate, endDate, lotSize } = req.body;
        const priceRange = req.body.priceRange || req.body.priceBand;

        // validations
        if (!stockId || !totalShares || !priceRange || !startDate || !endDate) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (
            totalShares <= 0 ||
            priceRange.min <= 0 ||
            priceRange.max <= 0
        ) {
            return res.status(400).json({ message: "Total shares and price band values must be greater than zero" });
        }
        if (priceRange.min > priceRange.max) {
            return res.status(400).json({ message: "Min price cannot be greater than max price" });
        }
        if (lotSize && lotSize <= 0) {
            return res.status(400).json({ message: "Lot size must be greater than zero" });
        }
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: "Start date must be before end date" });
        }

        // get the stock 
        const stock = await stockModel.findById(stockId);
        if (!stock) return res.status(404).json({ message: "Stock not found" });

        if (stock.isListed) {
            return res.status(400).json({ message: "Stock already listed" });
        }

        const available = stock.totalShares - stock.issuedShares;

        if (totalShares > available) {
            return res.status(400).json({ message: "Not enough shares available" });
        }

        const ipo = await ipoModel.create({
            stockId,
            totalShares,
            priceRange,
            startDate,
            endDate,
            lotSize: lotSize || 1,
            createdBy: req.id
        });

        res.status(201).json({ success: true, ipo });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const placeBid = async (req, res) => {
    let session;

    try {
        const quantity = Number(req.body.quantity);
        const bidPrice = Number(req.body.bidPrice);
        const ipoId = req.params.id;
        const userId = req.id;
        const fail = (status, message) => {
            const error = new Error(message);
            error.status = status;
            throw error;
        };

        if (!quantity || !bidPrice) {
            return res.status(400).json({ message: "Quantity and bid price are required" });
        }
        if (!ipoId) {
            return res.status(400).json({ message: "IPO ID is required" });
        }
        if (quantity <= 0 || bidPrice <= 0) {
            return res.status(400).json({ message: "Quantity and bid price must be greater than zero" });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const ipo = await ipoModel.findById(ipoId).session(session);
        if (!ipo) {
            fail(404, "IPO not found");
        }
        const stock = await stockModel.findById(ipo.stockId).select("symbol").session(session);
        if (!stock) {
            fail(404, "Stock not found for this IPO");
        }

        if (ipo.status !== "OPEN") {
            fail(400, "IPO is not open for bidding");
        }
        if (quantity % ipo.lotSize !== 0) {
            fail(400, `Quantity must be a multiple of lot size (${ipo.lotSize})`);
        }
        if (bidPrice < ipo.priceRange.min || bidPrice > ipo.priceRange.max) {
            fail(400, "Bid price must be within IPO price range");
        }

        const existingBid = await bidModel.findOne({ userId, ipoId }).session(session);
        if (existingBid) {
            fail(400, "User has already placed a bid for this IPO");
        }

        const lockAmount = quantity * bidPrice;
        const lastLedger = await ledgerModel
            .findOne({ userId })
            .sort({ createdAt: -1, _id: -1 })
            .session(session);
        const availableBalance = lastLedger ? lastLedger.balanceAfter : 0;

        if (availableBalance < lockAmount) {
            fail(400, "Insufficient balance for bid amount lock");
        }

        const bidDocs = await bidModel.create([{
            userId,
            ipoId,
            quantity,
            bidPrice,
            status: "PENDING"
        }], { session });
        const bid = bidDocs[0];

        await ledgerModel.create([{
            userId,
            type: "LOCK",
            symbol: stock.symbol,
            quantity,
            price: bidPrice,
            amount: lockAmount,
            balanceAfter: availableBalance - lockAmount,
            referenceId: bid._id,
            referenceModel: "Bid"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, bid });

    } catch (err) {
        if (session) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            session.endSession();
        }

        if (err?.code === 11000) {
            return res.status(400).json({ message: "User has already placed a bid for this IPO" });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
};

// manula close the ipo if any prblm  occurs in automatic closing by scheduler
const closeIPO = async (req, res) => {
    try {
        const result = await closeIPOInternal(req.params.id);

        res.json({
            success: true,
            message: "IPO closed",
            result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getALLIPOs = async (req, res) => {
    try {
        const ipos = await ipoModel.find().populate("stockId").sort({ createdAt: -1 });

        res.json({ success: true, ipos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getIPOBySymbol = async (req, res) => {
    try {
        const stock = await stockModel.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const ipo = await ipoModel
            .findOne({ stockId: stock._id })
            .sort({ createdAt: -1 })
            .populate("stockId");

        if (!ipo) {
            return res.status(404).json({ message: "IPO not found" });
        }
        res.json({ success: true, ipo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { createIPO, placeBid, closeIPO, getALLIPOs, getIPOBySymbol };
