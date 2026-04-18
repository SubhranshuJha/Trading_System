import express from 'express';
import { placeBuyOrder, placeSellOrder } from '../controllers/order.controller.js';
import authMiddleware from '../middlewear/auth.middlewear.js';

const orderRouter = express.Router();

orderRouter.post('/buy', authMiddleware ,placeBuyOrder);
orderRouter.post('/sell', authMiddleware ,placeSellOrder);

export default orderRouter ;
