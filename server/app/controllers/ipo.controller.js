import ipoModel from "../models/ipo.model.js";
import stockModel from "../models/stock.model.js";
import bidModel from "../models/bid.model.js";
import { closeIPOInternal } from "../services/ipo.service.js";

export const createIPO = async (req, res) => {
    try {
        const { stockId, totalShares, priceBand, startDate, endDate, lotSize } = req.body;

        // validations
        if (!stockId || !totalShares || !priceBand || !startDate || !endDate) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if ( totalShares <= 0 || priceBand.min <= 0 || priceBand.max <= 0 ) {
            return res.status(400).json({ message: "Total shares and price band values must be greater than zero" });
        }
        if ( priceBand.min > priceBand.max ) {
            return res.status(400).json({ message: "Min price cannot be greater than max price" });
        }
        if ( new Date(startDate) >= new Date(endDate) ) {   
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
            priceBand,
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


export const placeBid = async (req, res) => {
    try {
        const { quantity, bidPrice } = req.body;
        const ipoId = req.params.id;
        const userId = req.id;

        if (!quantity || !bidPrice) {
            return res.status(400).json({ message: "Quantity and bid price are required" });
        }
        if ( !ipoId ) {
            return res.status(400).json({ message: "IPO ID is required" });
        }

        const ipo = await ipoModel.findById(ipoId);
        if (!ipo) {
            return res.status(404).json({ message: "IPO not found" });
        }

        if (ipo.status !== "OPEN") {
            return res.status(400).json({ message: "IPO is not open for bidding" });
        }

        const existingBid = await bidModel.findOne({ userId, ipoId });
        if (existingBid) {
            return res.status(400).json({ message: "User has already placed a bid for this IPO" });
        }

        const bid = await bidModel.create({
            userId,
            ipoId,
            quantity,
            bidPrice ,
            status: "PENDING"
        });

        res.json({ success: true, bid });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// manula close the ipo if any prblm  occurs in automatic closing by scheduler
export const closeIPO = async (req, res) => {
    try {
        const result = await closeIPOInternal(req.params.id);

        res.json({
            success: true,
            message: "IPO closed",
            ...result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};