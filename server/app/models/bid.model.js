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

bidSchema.pre("save", async function () {
    if (this.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }
});

const bidModel = mongoose.model("Bid", bidSchema);

export default bidModel;