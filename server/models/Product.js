import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name:{
          type:String,
          required:[true,"please enter product name"]
      },
      description:{
          type:Array,
          required:[true,"please enter product Description"],
      },
      price:{
          type:Number,
          required:[true,"please enter product price"],
      },
      offerPrice:{
        type:Number,
        required:[true,"please enter product offer price"],
    },    
    image:{
        type:Array,
        required:[true,"please enter product Image"],
    },
    category:{
        type:String,
        required:[true,"please enter product Category"],
    },  
    inStock:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

const Product = mongoose.models.product || mongoose.model("product",productSchema)

export default Product