import { useState } from "react"
import { assets, categories } from "../../assets/assets"
import {useAppContext} from "../../context/appcontext"
import toast from "react-hot-toast"
const AddProduct = () => {
    console.log('type', typeof JSON.stringify)
    const[files,setFiles] = useState([])
    const [name,setName] = useState("") 
    const [description,setDescription] = useState("") 
    const [category,setCategory] = useState("") 
    const [price,setPrice] = useState("") 
    const [offerPrice,setOfferPrice] = useState("") 
    const{axios} = useAppContext()
    const submitHandler = async(e)=>{
        try {
            
            e.preventDefault()
            const productData = {
                name,
                description:description.split("\n"),
                category,
                price:parseInt(price),
                offerPrice:parseInt(offerPrice)
            }
            const formData = new FormData()
            formData.append("productData",JSON.stringify(productData))
            for(let i=0;i<files.length;i++){
                formData.append("images",files[i])
            }
            const {data} = await axios.post("/api/product/add",formData)
            if(data.success){
                toast.success(data.message)
                setName("")
                setDescription("")
                setCategory("")
                setPrice("")
                setOfferPrice("")
                setFiles([])
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message||error.message)
        }
    }
    return (
         <div className="no-scrollbar  h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={submitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">


                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e)=>{
                                    const updatedFiles = [...files]
                                    updatedFiles[index] = e.target.files[0]
                                    setFiles(updatedFiles)
                                }} 
                                accept="image/*" type="file"
                                 id={`image${index}`} hidden />
                                <img src={files[index]?URL.createObjectURL(files[index]):assets.upload_area} alt="image file" className="max-w-24 cursor-pointer " width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required onChange={(e)=>{setName(e.target.value)}} value={name}/>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here" onChange={(e)=>{setDescription(e.target.value)}} value={description}></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" onChange={(e)=>{setCategory(e.target.value)}} value={category}>
                        <option value="">Select Category</option>
                        {
                            categories.map((item)=>{
                                return <option value={item.path} key={item.path}>{item.path}</option>
                            })
                        }
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e)=>{setPrice(e.target.value)}} value={price} id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required onChange={(e)=>{setOfferPrice(e.target.value)}} value={offerPrice}/>
                    </div>
                </div>
                <button type="submit" className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer hover:bg-primary-dull">ADD</button>
            </form>
    </div>
  )
}

export default AddProduct