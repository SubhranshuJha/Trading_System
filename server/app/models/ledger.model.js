import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  symbol: {
      type: String,
  },

  quantity: Number,

  price: Number,

  amount: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["DEPOSIT", "WITHDRAW", "BUY", "SELL", "LOCK", "UNLOCK"],
    required: true
  },

  balanceAfter: {
    type: Number,
    required: true
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },

  referenceModel: {
    type: String,
    enum: ["Order", "Trade"]
  }

}, { timestamps: true });

const ledger = mongoose.model('Ledger', ledgerSchema);
export default ledger;
