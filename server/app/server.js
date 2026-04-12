import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/connectDB.js';
import authRouter from './routes/auth.route.js';


const app = express();
const port = process.env.PORT ;

// middlewarre
app.use(cors());
app.use(bodyParser.json());

// testing route 
app.get( '/' , (req,res) => {
    console.log('Server is running');
    res.send('Server is running');
})

// connect to database
connectDB() ;


// Routes 
app.use("/api/auth", authRouter) ;

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) ;

export default app ;