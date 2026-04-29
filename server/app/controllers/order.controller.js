import { createOrder } from "../service/createOrder.js";

const placeBuyOrder = async (req, res) => {

    try {

        const userId = req.id ;
        const stockSymbol = req.body.stockSymbol?.toUpperCase();
        const quantity = Number(req.body.quantity);
        const price = Number(req.body.price);
        let { category } = req.body;

        if ( !stockSymbol || !category || !Number.isFinite(quantity) || !Number.isFinite(price) ) {
            return res.status(400).json ( {
                success: false,
                message: "Unable to place buy order ! All fields are required."    
            })
        }

        category = category.toUpperCase();
        if ( category !== "MARKET" && category !== "LIMIT" ) {
            return res.status(400).json ( {
                success: false,
                message: "Unable to place buy order ! Invalid category."    
            })
        }


        if ( quantity <= 0 || price <= 0 ) {
            return res.status(400).json ( {
                success: false,
                message: "Unable to place buy order ! Quantity and price must be greater than zero."    
            })
        }

        const newOrderData = {
            userId,
            symbol: stockSymbol,
            type: "BUY",
            category,
            price,
            quantity,
            remainingQty: quantity
        }

        const responseOrder = await createOrder(newOrderData);
        if ( !responseOrder ) {
            return res.status(500).json ( {
                success: false,
                message: "Unable to place buy order ! Something went wrong."    
            })
        }

        return res.status(200).json ( {
            success: true,
            message: "Buy order placed successfully !",
            order: responseOrder
        })
    
        
    } catch (error) {
        console.log("ISE > ", error);
        const status = error.message === "Insufficient balance" || error.message === "Stock not found" ? 400 : 500;
        return res.status(status).json ( {
            success: false,
            message: status === 400 ? error.message : "Unable to place buy order ! Something went wrong."    
            })
    }  
}

const placeSellOrder = async (req, res) => {

        try {

        const userId = req.id ;
        const stockSymbol = req.body.stockSymbol?.toUpperCase();
        const quantity = Number(req.body.quantity);
        const price = Number(req.body.price);
        let { category } = req.body;

        if ( !stockSymbol || !category || !Number.isFinite(quantity) || !Number.isFinite(price) ) {
            return res.status(400).json ( {
                success: false,
                message: "Unable to place sell order ! All fields are required."    
            })
        }

        category = category.toUpperCase();
        if ( category !== "MARKET" && category !== "LIMIT" ) {
            return res.status(400).json ( {
                success: false,
                message: "Unable to place sell order ! Invalid category."    
            })
        }

        if ( quantity <= 0 || price <= 0 ) {
            return res.status(400).json ( {
                success: false,
                message: "Unable to place sell order ! Quantity and price must be greater than zero."    
            })
        }

        const newOrderData = {
            userId,
            symbol: stockSymbol,
            type: "SELL",
            category,
            price,
            quantity,
            remainingQty: quantity
        }

        const responseOrder = await createOrder(newOrderData);
        if ( !responseOrder ) {
            return res.status(500).json ( {
                success: false,
                message: "Unable to place sell order ! Something went wrong."    
            })
        }

        return res.status(200).json ( {
            success: true,
            message: "Sell order placed successfully !",
            order: responseOrder
        })

    } catch (error) {
        console.log("ISE > ", error);
        const status = error.message === "Insufficient stock" || error.message === "Portfolio not found" || error.message === "Stock not found" ? 400 : 500;
        return res.status(status).json ( {
            success: false,
            message: status === 400 ? error.message : "Unable to place sell order ! Something went wrong."    
            })
    }  
}

export { placeBuyOrder, placeSellOrder }
