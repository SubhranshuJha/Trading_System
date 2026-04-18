import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true },

    symbol: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true 
    },

    description: { type: String },

    totalShares: { 
        type: Number, 
        required: true 
    },

    issuedShares: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return value <= this.totalShares;
            },
            message: "Issued shares cannot exceed total shares"
        }
    },

    currentPrice: { 
        type: Number, 
        default: 0 
    },

    isListed: { 
        type: Boolean, 
        default: false 
    },

    isActive: { 
        type: Boolean, 
        default: true 
    },

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company", 
        required: true 
    }

}, { timestamps: true });

stockSchema.index({ symbol: 1 });

const stockModel = mongoose.model("Stock", stockSchema);
export default stockModel;