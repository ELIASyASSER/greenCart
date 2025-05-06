import mongoose from "mongoose";

const connectDb = async (url)=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("database is already connected")

        })
        await mongoose.connect(`${url}/greenCart`)
    } catch (error) {
        console.error(error.message)
        // process.exit(1)

    }
}

export default connectDb