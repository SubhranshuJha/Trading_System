import express from 'express';
import { createIPO, placeBid, closeIPO, getALLIPOs, getIPOBySymbol } from '../controllers/ipo.controller.js';

import userAuthMiddleware from '../middlewear/userAuth.middlewear.js';
import companyAuthMiddleware from '../middlewear/companyAuth.middlewear.js';

const ipoRouter = express.Router();

console.log("companyAuthMiddleware:", typeof companyAuthMiddleware); 
// Admin routes

ipoRouter.post('/create', companyAuthMiddleware, createIPO);
ipoRouter.patch('/:id/close', companyAuthMiddleware, closeIPO);
// update and delete ipo before the open is not implemented yet ...

// Public routes
ipoRouter.get('/', getALLIPOs);
ipoRouter.get('/:symbol', getIPOBySymbol);

// User action
ipoRouter.post('/:id/bid', userAuthMiddleware, placeBid);

export default ipoRouter;