import express from 'express';
import { createStock , getAllStocks , getStockBySymbol } from '../controllers/stock.controller.js';
import companyAuthMiddleware from '../middlewear/companyAuth.middlewear.js';

const stockRouter = express.Router();

stockRouter.post('/create', companyAuthMiddleware,createStock);
stockRouter.get('/all', getAllStocks);
stockRouter.get('/:symbol', companyAuthMiddleware, getStockBySymbol);


export default stockRouter ;