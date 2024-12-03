import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import mongodb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
mongodb()
connectCloudinary()
// middleware
app.use(express.json());
app.use(cors());


// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get("/test", async (req,res) => {
    res.json({ message: "hello!" });
});
const port = 7000
app.listen(port, () => {
    console.log("Server started on port 7000");
});
