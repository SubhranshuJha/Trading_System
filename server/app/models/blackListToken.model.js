import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({

  token: {
    type: String,
    required: true,
    unique: true
  }

}, { timestamps: true });


blackListTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 }); 

const blackListTokenModel = mongoose.model('BlackListToken', blackListTokenSchema);
export default blackListTokenModel;