import mongoose from "mongoose";

const ipoSchema = new mongoose.Schema({

    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
        index: true
    },

    totalShares: {
        type: Number,
        required: true
    },

    priceRange: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },

    cutoffPrice: {
        type: Number,
        default: null
    },

    lotSize: {
        type: Number,
        default: 10
    },

    soldShares: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["UPCOMING", "OPEN", "CLOSED"],
        default: "UPCOMING",
        index: true
    },

    startDate: {
        type: Date ,
    },

    endDate: {
        type: Date,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }

}, { timestamps: true });


ipoSchema.pre("save", async function () {
    if (this.priceRange.min > this.priceRange.max) {
        throw new Error("Min price cannot be greater than max price");
    }
});


ipoSchema.pre("save", async function () {
    if (this.startDate >= this.endDate) {
        throw new Error("Start date must be before end date");
    }
});

const ipoModel = mongoose.model('IPO', ipoSchema);
export default ipoModel;