import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    ipoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IPO",
        required: true,
        index: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    bidPrice: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["PENDING", "ALLOCATED", "REJECTED"],
        default: "PENDING",
        index: true
    },

    allocatedQuantity: {
        type: Number,
        default: 0
    }

}, { timestamps: true });


bidSchema.index({ userId: 1, ipoId: 1 }, { unique: true });

bidSchema.pre("save", function (next) {
    if (this.quantity <= 0) {
        return next(new Error("Quantity must be greater than 0"));
    }
    next();
});

const bidModel = mongoose.model("Bid", bidSchema);

export default bidModel;