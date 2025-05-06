import jwt from "jsonwebtoken"
import UnAuthorized from "../errors/unAuthorized.js";
const authSeller = async(req,res,next)=>{
    try {
        const{sellerToken} = req.cookies;
    if(!sellerToken){
        return next(new UnAuthorized("Not Authorized please subscribe first to become a seller"))
    }

    const decodedToken = jwt.verify(sellerToken,process.env.JWT_SECRET)
        if(decodedToken.email == process.env.SELLER_EMAIL){
            next();
        }else{

            return next(new UnAuthorized("Not Authorized please subscribe first to become a seller"))
        }
        } catch (error) {
            next(error)
        }
           
}

export default  authSeller