import express from 'express';
import { createIPO, placeBid, closeIPO, getALLIPOs, getIPOBySymbol } from '../controllers/ipo.controller.js';

import authMiddleware from '../middlewear/userAuth.middlewear.js';
import adminMiddleware from '../middlewear/companyAuth.middlewear.js';

const ipoRouter = express.Router();

// Admin routes
ipoRouter.post('/', adminMiddleware, createIPO);
ipoRouter.patch('/:id/close', adminMiddleware, closeIPO);
// update and delete ipo before the open is not implemented yet ...

// Public routes
ipoRouter.get('/', getALLIPOs);
ipoRouter.get('/:symbol', getIPOBySymbol);

// User action
ipoRouter.post('/:id/bid', authMiddleware, placeBid);

export default ipoRouter;