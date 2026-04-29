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
    required: false
  },

  buyOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false
  },

  sellOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false
  },

  bidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
    required: false
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
  },

  type: {
    type: String,
    enum: ['SECONDARY', 'IPO'],
    default: 'SECONDARY'
  }

}, { timestamps: true });

const tradeModel = mongoose.model('Trade', tradeSchema);
export default tradeModel;