import express from 'express';
import { createStock , getAllStocks , getStockBySymbol } from '../controllers/stock.controller.js';

const stockRouter = express.Router();

stockRouter.post('/create', createStock);
stockRouter.get('/all', getAllStocks);
stockRouter.get('/:symbol', getStockBySymbol);


export default stockRouter ;