import companyModel from "../models/componey.model.js";
import stockModel from "../models/stock.model.js";

const createStock = async (req , res ) => {
    
    try {

        const { name  , quantity  } = req.body ;
        const companyId = req.id;
        
        const company = await companyModel.findById(companyId);
 
        if ( !name || !symbol || !quantity  ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingStock = await stockModel.findOne({ $or: [ { name }, { symbol } ] });
        if ( existingStock ) {
            return res.status(400).json({ success: false, message: "Stock with same name or symbol already exists" });
        }

        const newStockData = {
            name,
            symbol: company.symbol,
            quantity
        }

        const newStock = await stockModel.create(newStockData);
        res.status(201).json({ success: true, message: "Stock created successfully", data: newStock });
        
    } catch (error) {
        console.log("ISE > Exception occured in creating stock " + error );
        res.status(500).json({ success: false, message: "Unable to create stock" });
    }
}

const getAllStocks = async ( req , res ) => {
    try {

        const stocks = await stockModel.find();
        res.status(200).json({ success: true, message: "Stocks fetched successfully", data: stocks });

    } catch (error) {
        console.log("ISE > Exception occured in fetching stocks " + error );
        res.status(500).json({ success: false, message: "Unable to fetch stocks" });
    }
}

const getStockBySymbol= async ( req , res ) => {

    try {

        const { symbol } = req.params;
        const stock = await stockModel.findOne({ symbol });
        if (!stock) {
            return res.status(404).json({ success: false, message: "Stock not found" });
        }
        res.status(200).json({ success: true, message: "Stock fetched successfully", data: stock });
        
    } catch (error) {
        console.log("ISE > Exception occured in fetching stock by symbol " + error );
        res.status(500).json({ success: false, message: "Unable to fetch stock" });
    }
}

export { createStock, getAllStocks, getStockBySymbol };