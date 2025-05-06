import jwt from "jsonwebtoken"
import UnAuthorized from "../errors/unAuthorized.js";
// login seller : api/seller/login
export const sellerLogin =async(req,res,next)=>{
    
    try {
        const{email,password} = req.body;
    if(password == process.env.SELLER_PASSWORD && email== process.env.SELLER_EMAIL){
        const sellerToken  = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).cookie("sellerToken",sellerToken,{
            httpOnly:true,//prevent js to access cookie
            secure:process.env.NODE_ENV =="production"?true:false,//https secure protocol on production
            sameSite:process.env.NODE_ENV =="production"?"none":"strict",//csrf protection
            maxAge:parseInt(process.env.TOKEN_AGE)//cookie expiration

        }).json({success:true,message:"Logged in as a seller"})

    }else{
        return next(new UnAuthorized("Invalid email or password "))
    }
    } catch (error) {
        console.log(error.message)
        next(error)   
    }
}

// Seller Auth : /api/seller/is-auth
export const isSellerAuth = async (req,res,next)=>{
    
    try {
        
        return res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


// logout: /api/seller/logout
export const sellerLogout = async(req,res,next)=>{
    try {
        res.status(200).clearCookie("sellerToken",{
            httpOnly:true,
            secure:process.env.NODE_ENV =="production",
            sameSite:process.env.NODE_ENV =="production"?"none":"strict"
        }).json({success:true,message:"Logged Out"})

        
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
