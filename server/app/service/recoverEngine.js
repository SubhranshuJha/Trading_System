import axios from "axios";
import orderModel from "../models/order.model.js";

const ENGINE_URL = process.env.JAVA_ENGINE_URL || "http://localhost:8080";

export const checkEngineHealth = async () => {
  try {
    const { data } = await axios.get(`${ENGINE_URL}/health`, { timeout: 3000 });
    return data?.status === "ok";
  } catch {
    return false;
  }
};

export const recoverEngineFromDatabase = async () => {
  const isHealthy = await checkEngineHealth();
  if (!isHealthy) {
    console.warn("Java engine is unavailable. Skipping engine recovery.");
    return { replayed: 0, skipped: true };
  }

  const openOrders = await orderModel
    .find({
      status: { $in: ["OPEN", "PARTIAL"] },
      remainingQty: { $gt: 0 },
      category: "LIMIT",
    })
    .sort({ createdAt: 1 })
    .lean();

  if (openOrders.length === 0) {
    console.info("No open limit orders found for engine recovery.");
    return { replayed: 0, skipped: false };
  }

  const payload = {
    orders: openOrders.map((order) => ({
      id: order._id.toString(),
      symbol: order.symbol,
      userId: order.userId.toString(),
      type: order.type,
      category: order.category,
      price: order.price,
      quantity: order.remainingQty,
    })),
  };

  try {
    const { data } = await axios.post(`${ENGINE_URL}/recover`, payload, {
      timeout: 10000,
    });
    console.info(
      `Engine recovery replayed ${data.replayed ?? 0} open orders from database.`
    );
    return data;
  } catch (error) {
    console.warn(
      "Engine recovery from database failed:",
      error.response?.data?.error || error.message
    );
    return { replayed: 0, error: error.message };
  }
};
