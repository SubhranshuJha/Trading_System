import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import tradeModel from "../models/trade.model.js";
import ledgerModel from "../models/ledger.model.js";
import portfolioModel from "../models/portFolio.model.js";

const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Unable to get user data ! User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully !",
      user: userData,
    });
  } catch (error) {
    console.log("ISE IN GETTING USER DATA" + error);
    return res.status(500).json({
      success: false,
      message: "Unable to get user data ! Something went wrong.",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.id;

    const userOrders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully !",
      orders: userOrders,
    });
  } catch (error) {
    console.log("ISE IN GETTING USER ORDERS" + error);
    return res.status(500).json({
      success: false,
      message: "Unable to get user orders ! Something went wrong.",
    });
  }
};

const getUserTrades = async (req, res) => {
  try {
    const userId = req.id;

    const userTrades = await tradeModel
      .find({
        $or: [{ buyerId: userId }, { sellerId: userId }],
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "User trades fetched successfully !",
      trades: userTrades,
    });
  } catch (error) {
    console.log("ISE IN GETTING USER TRADES" + error);
    return res.status(500).json({
      success: false,
      message: "Unable to get user trades ! Something went wrong.",
    });
  }
};

const getUserBalance = async (req, res) => {
  try {
    const userId = req.id;

    const lastLedger = await ledgerModel
      .findOne({ userId })
      .sort({ createdAt: -1, _id: -1 });
    const currentBalance = lastLedger ? lastLedger.balanceAfter : 0;

    return res.status(200).json({
      success: true,
      message: "User balance fetched successfully !",
      balance: currentBalance,
    });
  } catch (error) {
    console.log("ISE IN GETTING USER BALANCE" + error);
    return res.status(500).json({
      success: false,
      message: "Unable to get user balance ! Something went wrong.",
    });
  }
};

const getUserPortfolio = async (req, res) => {
  try {
    const userId = req.id;

    let portfolio = await portfolioModel
      .findOne({ userId })
      .populate("stocks.stockId", "symbol name");
    if (!portfolio) {
      return res.status(200).json({
        success: true,
        portfolio: { stocks: [] },
      });
    }

    return res.status(200).json({
      success: true,
      message: "User portfolio fetched successfully !",
      portfolio,
    });
  } catch (error) {
    console.log("ISE IN GETTING USER PORTFOLIO" + error);
    return res.status(500).json({
      success: false,
      message: "Unable to get user portfolio ! Something went wrong.",
    });
  }
};

export {
  getUserProfile,
  getUserOrders,
  getUserTrades,
  getUserBalance,
  getUserPortfolio,
};
