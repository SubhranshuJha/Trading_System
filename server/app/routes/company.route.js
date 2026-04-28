import express from "express";
const companyRouter = express.Router();

import companyAuthMiddleware from "../middlewear/companyAuth.middlewear.js";
import { getCompanyProfile, getCompanyIPOs, getCompanyTrades , getCompanyStockDetails } from "../controllers/company.controller.js";

// Company routes
companyRouter.get('/profile', companyAuthMiddleware, getCompanyProfile);
companyRouter.get('/ipos', companyAuthMiddleware, getCompanyIPOs);
companyRouter.get('/trades', companyAuthMiddleware, getCompanyTrades);
companyRouter.get('/stock-details', companyAuthMiddleware, getCompanyStockDetails);

export default companyRouter;