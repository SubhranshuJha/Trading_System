import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    symbol: {
        type: String,
        required: true,
        unique: true,   
        uppercase: true 
    },

    email: {  
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    }

}, { timestamps: true });

const companyModel = mongoose.model('Company', companySchema);
export default companyModel;