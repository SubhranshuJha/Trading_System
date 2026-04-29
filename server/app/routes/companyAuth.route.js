import express from 'express';
import { registerCompany, loginCompany, logoutCompany } from '../controllers/companyAuth.controller.js';
import companyAuthMiddleware from '../middlewear/companyAuth.middlewear.js';

const companyAuthRouter = express.Router();

companyAuthRouter.post('/register', registerCompany);
companyAuthRouter.post('/login', loginCompany);
companyAuthRouter.post('/logout', companyAuthMiddleware ,logoutCompany);


export default companyAuthRouter;
