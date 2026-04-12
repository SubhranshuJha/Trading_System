import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({

    name : { type: String, required: true, unique: true },
    symbol : { type: String, required: true, unique: true },
    quantity : { type: Number, required: true },
    currentPrice : { type: Number, required: true },
    isActive : { type: Boolean, default: true },
    createdAt : { type: Date, default: Date.now },

} , { timestamps: true });

const stockModel = mongoose.model('Stock', stockSchema);
export default stockModel;
