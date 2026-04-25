import express from "express";

import { registerUser, loginUser, logoutUser } from "../controllers/userAuth.controller.js";
import authMiddleware from "../middlewear/userAuth.middlewear.js";

const userAuthRouter = express.Router();

// routes 
userAuthRouter.post("/register", registerUser);
userAuthRouter.post("/login", loginUser);
userAuthRouter.post("/logout", authMiddleware ,logoutUser);


export default userAuthRouter;