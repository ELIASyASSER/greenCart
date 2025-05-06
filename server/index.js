import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import "dotenv/config.js"
import connectDb from "./configs/db.js";
import errorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/user.js";
import sellerRouter from "./routes/seller.js";
import productRouter from "./routes/product.js"
import cartRouter from "./routes/cart.js"
import addressRouter from "./routes/address.js"
import orderRouter from "./routes/order.js"

import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebHooks } from "./controllers/order.js";


const app = express();

// variables
const port = process.env.PORT ||4000;

const allowedOrigins = [process.env.DEV_ORIGIN]
// stripe webhook
app.post("/stripe",express.raw({type:"application/json"}),stripeWebHooks)
//middleware config

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedOrigins,credentials:true}))




app.get("/",(req,res)=>res.send("api is working"))

//user router 
app.use("/api/user",userRouter)
// seller router
app.use("/api/seller",sellerRouter)
//product router 
app.use("/api/product",productRouter)
//cart router 
app.use("/api/cart",cartRouter)
//address router 
app.use("/api/address",addressRouter)
//order router 
app.use("/api/order",orderRouter)



app.use(errorHandler)
const starter = async()=>{
    try {
        await connectDb(process.env.MONGO_URI)
        await connectCloudinary()

        console.log('database connedted')
        app.listen(port,()=>{
            console.log(`server is working on http://localhost:${port}`)
        })
    } catch (error) {
        console.error(error.message)
        process.exit(1)
        
    }
}
starter()