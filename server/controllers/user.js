import User from "../models/User.js";
import jwt from "jsonwebtoken"
import NotFound from "../errors/not-found.js";
import BadRequest from "../errors/bad-request.js";
import UnAuthorized from "../errors/unAuthorized.js";

// Register User : /api/user/register
const tokenAge = process.env.TOKEN_AGE;
export const register = async(req,res,next)=>{

    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return next(new NotFound("Missing Details"));
        }
        const existUser = await User.findOne({email:email});
        if(existUser){
            return res.status(409).json({success:false,message:"User Already Exists"});
        }
        
        
        const user = await User.create({name,email,password});

        const token = jwt.sign({id:user._id,},process.env.JWT_SECRET,{expiresIn:'7d'});

        return res.status(201).cookie("token",token,{
            httpOnly:true,//prevent js to access cookie
            secure:process.env.NODE_ENV =="production"?true:false,//https secure protocol on production
            sameSite:process.env.NODE_ENV =="production"?"none":"strict",//csrf protection
            maxAge:parseInt(tokenAge)//cookie expiration

        }).json({success:true,user:{email:user.email,name:user.name},message:"registered"})



    } catch (error) {
        console.log(error.message);
        next(error)

    }
}
// Login User : /api/user/login
export const login =async(req,res,next)=>{
    const{email,password} = req.body;
    if(!email || !password){
        return next(new BadRequest("email and password are required please fill them"))

    }
    try {
        const user = await User.findOne({email})
        if(!user){
        return next(new BadRequest("Invalid Email or Password"))

        }
        const isPassword = await user.comparePassword(password)
        if(!isPassword){
            return next(new UnAuthorized("Invalid Email or Password"))
        }

        const token = jwt.sign({id:user._id,},process.env.JWT_SECRET,{expiresIn:'7d'});

        return res.status(200).cookie("token",token,{
            httpOnly:true,//prevent js to access cookie
            secure:process.env.NODE_ENV =="production"?true:false,//https secure protocol on production
            sameSite:process.env.NODE_ENV =="production"?"none":"strict",//csrf protection
            maxAge:parseInt(tokenAge)//cookie expiration

        }).json({success:true,user:{email:user.email,name:user.name},message:"logged in  successfully"})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
// check Auth : /api/user/is-auth
export const isAuth = async (req,res,next)=>{
    
    try {
        const id= req.userId?.id;

        const user = await User.findById(id).select("-password");
        return res.status(200).json({success:true,user})    
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

// logout: /api/user/logout
export const logout = async(req,res,next)=>{
    try {
        res.status(200).clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV =="production",
            sameSite:process.env.NODE_ENV =="production"?"none":"strict"
        }).json({success:true,message:"Logged Out successfully"})
        
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

