import { useEffect, useState } from "react"
import { assets } from "../assets/assets"
import toast from "react-hot-toast"
import { useAppContext } from "../context/appcontext"

// input fields 
const InputField = ({type,name,placeholder,handleChange,address})=>{
    return(
        <input 
        type={type}
        placeholder={placeholder}
        name={name}
        value={address[name]}
        onChange={handleChange}
        required
        className="w-full px-2 py-2.5 border border-gray-500/30 rounded  outline-none text-gray-500 focus:border-primary transition"
        />
        
        
    )
}


const AddAddress = () => {
    const {axios,navigate,setShowUserLogin,user} = useAppContext()
    const handleSubmit = async(_)=>{
        try {
            _.preventDefault()
            const {data} = await axios.post("/api/address/add",{address})
            if(data.success){

                toast.success(data.message)
                navigate("/cart")

            }else{
                toast.error(data?.response?.data?.message||data.message)
                                                                                                                                                                        
            }
            
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message||error.message)
        
        }
                                  
    }

    const [address,setAddress] = useState({
        firstName:'',
        lastName:'',
        email:'',
        street:'',
        city:'',
        state:'',
        zipcode:'',
        country:'',
        phone:'',
    })
    const handleChange = (e)=>{
        const {name,value} = e.target
        setAddress((prev)=>(
            {
                ...prev,
                [name]:value
            }
        ))
        // console.log(address)
    }


    useEffect(()=>{
        if(user === undefined )return
        if(!user){
            navigate("/cart")
            setShowUserLogin(true)
            toast.success("please log in first to add address",{duration:5000})
        }else{
            setShowUserLogin(false)

        }

    },[user])

    return (
    <main className="mt-16 pb-16 ">
        <p className="text-2xl md:text-3xl text-gray-500">Add Shipping <span className="font-semibold text-primary">Address</span></p>
        <section className="flex flex-col-reverse md:flex-row justify-between mt-10">
            <div className="flex-1 max-w-md">
                <form onSubmit={handleSubmit} className="space-y-3 mt-6 text-sm">
                    <section className="grid grid-cols-2 gap-4">
                        <InputField handleChange={handleChange} address={address} name='firstName' type="text" placeholder={"enter your first name"} />

                        <InputField handleChange={handleChange} address={address} name='lastName' type="text" placeholder={"enter your last name"} />
                    </section>
                    <InputField handleChange={handleChange} address={address} name='email' type="email" placeholder={"email address"} />

                    <InputField handleChange={handleChange} address={address} name='street' type="text" placeholder={"Street"} />
                    <section className="grid grid-cols-2 gap-4">
                        <InputField handleChange={handleChange} address={address} name='city' type="text" placeholder={"City"} />
                        <InputField handleChange={handleChange} address={address} name='country' type="text" placeholder={"Country"} />

                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <InputField handleChange={handleChange} address={address} name='zipcode' type="text" placeholder={"zip code"} />
                        <InputField handleChange={handleChange} address={address} name='state' type="text" placeholder={"State"} />
                    
                    </section>
                        <InputField handleChange={handleChange} address={address} name='phone' type="text" placeholder={"Pnone Number"} />
                        <button type="submit" className="w-full mt-6 bg-primary text-white py-3  uppercase cursor-pointer hover:bg-primary-dull transition">Save Address</button>


                </form>
            </div>
            <img className="md:mr-16 mb-16 md:mt-0" src={assets.add_address_iamge} alt="address image" />
        </section>
    </main>
  )
}

export default AddAddress