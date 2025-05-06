import {v2 as cloudinary} from "cloudinary"
const connectCloudinary=async()=>{
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
        api_secret: process.env.CLOUDINARY_API_SECRET, 
        api_key:process.env.CLOUDINARY_API_KEY  // Click 'View API Keys' above to copy your API secret
    })
}
export default connectCloudinary