import mongoose from "mongoose";
import validator from "validator";
const addressSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:[true,"userId is required"]
    },
    firstName:{
        type:String,
        required:[true,"firstName is required"]
    },
    lastName:{
        type:String,
        required:[true,"lastName is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        validate:{
            validator:validator.isEmail,
            message:"please enter correct email"
    }
    },
    street:{
        type:String,
        required:[true,"user street is required"]
    },
    city:{
        type:String,
        required:[true,"city is required"]
    },
    state:{
        type:String,
        required:[true,"state is required"]
    },
    country:{
        type:String,

    },
    zipcode:{
        type:String,
    },
    phone:{
        type:String,
        required:[true,"phone number is required"]
    },
})


const addressModel = mongoose.models.address|| mongoose.model("address",addressSchema)

export default addressModel