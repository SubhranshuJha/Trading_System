import express from "express";
import { getUserProfile, getUserOrders, getUserTrades, getUserBalance , getUserPortfolio } from "../controllers/user.controller.js";
import userAuthMiddleware from "../middlewear/userAuth.middlewear.js";

const userRouter = express.Router();

userRouter.get('/profile', userAuthMiddleware, getUserProfile);
userRouter.get('/orders', userAuthMiddleware, getUserOrders);
userRouter.get('/trades', userAuthMiddleware, getUserTrades);
userRouter.get('/balance', userAuthMiddleware, getUserBalance);
userRouter.get('/portfolio', userAuthMiddleware, getUserPortfolio);


export default userRouter ;