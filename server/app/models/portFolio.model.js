import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  stocks: [
    {
      stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true
      },

      quantity: {
        type: Number,
        required: true,
        min: 0
      } 
    }
  ]

}, { timestamps: true });

const portfolio = mongoose.model('Portfolio', portfolioSchema);
export default portfolio;