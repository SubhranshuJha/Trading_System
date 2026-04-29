import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  } ,

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
    enum: ["DEPOSIT", "WITHDRAW", "BUY", "SELL", "LOCK", "UNLOCK" , "FUND" , "IPO_SELL"],
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
    enum: ["Order", "Trade", "Bid", "IPO" , "IPO_SELL"],
  }

}, { timestamps: true });

ledgerSchema.pre("validate", function (next) {
  if (!this.userId && !this.companyId) {
    return next(new Error("Either userId or companyId is required"));
  }
  next();
});

const ledgerModel = mongoose.model('Ledger', ledgerSchema);
export default ledgerModel;
