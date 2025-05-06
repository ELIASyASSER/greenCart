import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator"

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:[true,"invalid email please try other email"],
        validate:{
            validator:validator.isEmail,
            message:"please enter correct email"
        }
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
    },
    cartItems:{
        type:Object,
        default:{}
    },

},{minimize:false,timestamps:true})


UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}
UserSchema.pre("save",async function(){
    const salt = await bcrypt.genSalt(10);
        this.password =  await bcrypt.hash(this.password,salt);
        
})
const User = mongoose.models.user||mongoose.model("user",UserSchema)




export default User