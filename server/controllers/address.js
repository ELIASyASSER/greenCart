// add address : /api/address/add

import Address from "../models/address.js";

export  const addAddress = async(req,res,next)=>{
    try {
        const{id} = req.userId;
        const{address} = req.body

        await Address.create({...address,userId:id})
        res.status(201).
        json({success:true,message:"address added successfully "})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
// get address : /api/address/get

export const getAddress =async(req,res,next)=>{
    
    try {
        const{id:userId} = req.userId;
        const addresses = await Address.find({userId})
        res.status(200).
        json({success:true,addresses})

    } catch (error) {
        console.log(error.message)
        next(error)
        
    }
}



