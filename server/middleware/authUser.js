import jwt from "jsonwebtoken"
import UnAuthorized from "../errors/unAuthorized.js";

const authUser = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return next(new UnAuthorized("Not Authorized"))
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        if(decodedToken.id){
            req.userId ={id:decodedToken.id};
        }else{
            return next(new UnAuthorized("Not Authorized"))
        }
        next()
    } catch (error) {
        next(error)
    }

}



export default authUser