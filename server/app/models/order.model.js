import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  symbol: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["BUY", "SELL"],
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

  remainingQty: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["OPEN", "PARTIAL", "FILLED", "CANCELLED"],
    default: "OPEN"
  }

}, { timestamps: true });

const order = mongoose.model('Order', orderSchema);
export default order;