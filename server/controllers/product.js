import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
// Add Product : /api/product/add
export const addProduct = async(req,res,next)=>{
    try {
        let productData = JSON.parse(req.body.productData);
        console.log(productData)
        // here it should be JSON.parse(req.body.productData) but try the line above first to see the difference
        if (!req.body.productData) {
            return res.status(400).json({ success: false, message: "Missing product data" });
        }


        const images = req.files;
        
        let imgsUrl = await Promise.all(
            images.map(async(img)=>{
                let result = await cloudinary.uploader.upload(img.path,{resource_type:"image"});
                return result.secure_url
                
            }))
            console.log('debugger at addProduct req.body :',JSON.parse(req.body.productData))
        await Product.create({...productData,image:imgsUrl})

        return res.status(200).json({success:true,message:"product added"})
        
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

// GET Product List : /api/product/list
export const productList = async(req,res,next)=>{
    try {
        const products = await Product.find({})
        res.status(200).json({success:true,products})

    } catch (error) {
        console.log(error.message)
        next(error)
        
    }
}

// GET Product By Id : /api/product/id
export const singleProduct = async(req,res,next)=>{

    try {
        const {id} = req.body
        const product = await Product.findById(id)
        res.status(200).json({success:true,product})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


// patch Product inStock : /api/product/stock
export const changeStock = async(req,res,next)=>{

    try {
        const{id,inStock} = req.body
         await Product.findByIdAndUpdate(id,{inStock})
        res.status(200).json({success:true,message:"Stock Updated"})

        

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}