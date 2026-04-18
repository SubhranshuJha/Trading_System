import axios from "axios";

export const sendToJavaEngine = async (order) => {
    try {

        const response = await axios.post("http://localhost:8080/orders", {
            id: order._id || Date.now().toString(),
            symbol: order.symbol,
            userId: order.userId,
            type: order.type,          // BUY / SELL
            category: order.category,  // marknet / limit
            price: order.price,
            quantity: order.quantity
        });

        // Java response
        const data = response.data;

        return {
            remainingQuantity: data.remainingQuantity,
            trades: data.trades
        };

    } catch (error) {
        console.error("Java Engine Error:", error.message);
        throw new Error("Failed to connect to matching engine");
    }
};