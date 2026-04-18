import express from "express";

import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewear/auth.middlewear.js";

const authRouter = express.Router();

// routes 
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware ,logoutUser);


export default authRouter;