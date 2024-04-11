import express from 'express';
import cors from 'cors';
import colors from 'colors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js';

dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/post', postRoutes)
app.get('/', (req, res)=>{
 res.status(200).send({
  "success":true,
  "msg":"Node Server Running"
 })
}
// PORT
const PORT = process.env.PORT || 8080;
// console.log(process.env.PORT);

//listen
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`.bgGreen.white)
})
