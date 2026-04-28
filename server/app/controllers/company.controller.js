import companyModel from "../models/componey.model.js";
import ipoModel from "../models/ipo.model.js";
import tradeModel from "../models/trade.model.js";
import ledgerModel from "../models/ledger.model.js";


const getCompanyProfile = async (req, res) => {
    try {
        const companyId = req.user.id;

        const companyData = await companyModel
            .findById(companyId)
            .select("-password");

        if (!companyData) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const companyLedger = await ledgerModel
            .find({ company: companyId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            company: companyData,
            ledger: companyLedger
        });

    } catch (error) {
        console.log("ISE > COMPANY PROFILE:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCompanyStockDetails = async (req, res) => {
    try {
        const companyId = req.user.id;
        const companyData = await companyModel
            .findById(companyId)
            .select("symbol");
        if (!companyData) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        
        const data = await stockModel.findOne({ symbol: companyData.symbol });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Stock details not found for the company"
            });
        }

        res.status(200).json({
            success: true,
            stockDetails: data
        });

        
    } catch (error) {
        console.log("ISE > COMPANY STOCK DETAILS:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }   
};


const getCompanyIPOs = async (req, res) => {
    try {
        const companyId = req.user.id;

        const companyIPOs = await ipoModel
            .find({ company: companyId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            ipos: companyIPOs
        });

    } catch (error) {
        console.log("ISE > COMPANY IPOS:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getCompanyTrades = async (req, res) => {
    try {
        const companyId = req.user.id;

        const ipos = await ipoModel.find({ company: companyId }).select("_id");
        const ipoIds = ipos.map(ipo => ipo._id);
Os
        const companyTrades = await tradeModel
            .find({ ipo: { $in: ipoIds } })
            .populate("user", "name email")
            .populate("ipo", "cutoffPrice status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            trades: companyTrades
        });

    } catch (error) {
        console.log("ISE > COMPANY TRADES:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export {
    getCompanyProfile,
    getCompanyIPOs,
    getCompanyTrades,
    getCompanyStockDetails

};