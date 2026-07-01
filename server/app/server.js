import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';

import connectDB from './config/connectDB.js';
import stockRouter from './routes/stock.route.js';
import orderRouter from './routes/order.route.js';
import fundsRouter from './routes/funds.route.js';
import userRouter from './routes/user.route.js';
import ipoRouter from './routes/ipo.route.js';
import companyRouter from './routes/company.route.js';
import userAuthRouter from './routes/userAuth.route.js';
import companyAuthRouter from './routes/companyAuth.route.js';
import { initRealtime } from './realtime/socket.js';
import { recoverEngineFromDatabase } from './service/recoverEngine.js';


const app = express();
const port = process.env.PORT || 5000 ;
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// testing route 
app.get( '/' , (req,res) => {
    console.log('Server is running');
    res.send('Server is running');
})

// connect to database
await connectDB();
await initRealtime(server);
await recoverEngineFromDatabase();
import("./scheduler/ipo.scheduler.js");


// Routes 
app.use("/api/auth-user", userAuthRouter) ;
app.use("/api/auth-company", companyAuthRouter) ;
app.use("/api/stock", stockRouter) ;
app.use("/api/order", orderRouter) ;
app.use("/api/funds", fundsRouter) ;
app.use("/api/user", userRouter) ;
app.use("/api/ipo", ipoRouter);
app.use("/api/company", companyRouter) ;

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) ;

export default app ;