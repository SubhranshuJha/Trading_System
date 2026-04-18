import express from 'express';
import {
    createIPO,
    getAllIPOs,
    getIPOById,
    updateIPO,
    deleteIPO,
    openIPO,
    closeIPO,
    placeBid
} from '../controllers/ipo.controller.js';

import authMiddleware from '../middlewear/auth.middlewear.js';
import adminMiddleware from '../middlewear/admin.middlewear.js';

const ipoRouter = express.Router();

// Admin routes
ipoRouter.post('/', authMiddleware, adminMiddleware, createIPO);
ipoRouter.put('/:id', authMiddleware, adminMiddleware, updateIPO);
ipoRouter.delete('/:id', authMiddleware, adminMiddleware, deleteIPO);
ipoRouter.patch('/:id/open', authMiddleware, adminMiddleware, openIPO);
ipoRouter.patch('/:id/close', authMiddleware, adminMiddleware, closeIPO);

// Public routes
ipoRouter.get('/', getAllIPOs);
ipoRouter.get('/:id', getIPOById);

// User action
ipoRouter.post('/:id/bid', authMiddleware, placeBid);

export default ipoRouter;