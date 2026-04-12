import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  buyOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  sellOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  symbol: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  }

}, { timestamps: true });

const tradeModel = mongoose.model('Trade', tradeSchema);
export default tradeModel;