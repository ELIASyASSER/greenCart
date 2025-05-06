import User from "../models/User.js";

// update user cartData : /api/cart/update
export const updateCart = async(req,res,next)=>{
    try {
        const{id} = req.userId;
        const{cartItems} = req.body;
        await User.findByIdAndUpdate(id,{cartItems})
        res.status(200).json({success:true,message:"cart updated successfully"})

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}