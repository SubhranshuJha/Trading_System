import express from "express";
import { getUserProfile, getUserOrders, getUserTrades, getUserBalance , getUserPortfolio } from "../controllers/user.controller.js";
import authMiddleware from "../middlewear/auth.middlewear.js";

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.get('/orders', authMiddleware, getUserOrders);
userRouter.get('/trades', authMiddleware, getUserTrades);
userRouter.get('/balance', authMiddleware, getUserBalance);
userRouter.get('/portfolio', authMiddleware, getUserPortfolio);


export default userRouter ;