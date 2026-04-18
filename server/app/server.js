import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/connectDB.js';
import authRouter from './routes/auth.route.js';
import stockRouter from './routes/stock.route.js';
import orderRouter from './routes/order.route.js';
import fundsRouter from './routes/funds.route.js';
import userRouter from './routes/user.route.js';
import ipoRouter from './routes/ipo.route.js';

const app = express();
const port = process.env.PORT || 5000 ;

// middlewarre
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()) ;

// testing route 
app.get( '/' , (req,res) => {
    console.log('Server is running');
    res.send('Server is running');
})

// connect to database
await connectDB();
import("./scheduler/ipo.scheduler.js");


// Routes 
app.use("/api/auth", authRouter) ;
app.use("/api/stock", stockRouter) ;
app.use("/api/order", orderRouter) ;
app.use("/api/funds", fundsRouter) ;
app.use("/api/user", userRouter) ;
app.use("/api/ipo", ipoRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) ;

export default app ;