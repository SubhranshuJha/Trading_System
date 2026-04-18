import express from "express";
import { addFund } from "../controllers/funds.controller.js";
import authMiddleware from "../middlewear/auth.middlewear.js";

const fundsRouter = express.Router();

fundsRouter.post("/add", authMiddleware, addFund);

export default fundsRouter;