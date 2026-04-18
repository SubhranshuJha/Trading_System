import express from 'express';
import { createIPO, placeBid, closeIPO, getALLIPOs, getIPOBySymbol } from '../controllers/ipo.controller.js';

import authMiddleware from '../middlewear/auth.middlewear.js';
import adminMiddleware from '../middlewear/admin.middlewear.js';

const ipoRouter = express.Router();

// Admin routes
ipoRouter.post('/', authMiddleware, adminMiddleware, createIPO);
ipoRouter.patch('/:id/close', authMiddleware, adminMiddleware, closeIPO);
// update and delete ipo before the open is not implemented yet ...

// Public routes
ipoRouter.get('/', getALLIPOs);
ipoRouter.get('/:symbol', getIPOBySymbol);

// User action
ipoRouter.post('/:id/bid', authMiddleware, placeBid);

export default ipoRouter;