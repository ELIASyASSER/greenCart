import { useEffect, useState } from "react"
import { useAppContext } from "../../context/appcontext"
import toast from "react-hot-toast"


const SellerLogin = () => {
    const {isSeller,setIsSeller,navigate,axios} = useAppContext()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = async function (e) {
        try {
            e.preventDefault()
            const {data} = await axios.post(`/api/seller/login`,{email,password})
            if(data.success){
                setIsSeller(true)
                toast.success("logged in as a seller successfully")
                navigate("/seller")
            }else{
                
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message||error.message);

        }

    }

    useEffect(()=>{
        if(isSeller){
            navigate("/seller")
        }
    },[isSeller])


    return !isSeller &&(
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center text-sm text-gray-600 ">
            <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
                <p className="text-2xl font-medium m-auto"><span className="text-primary">Seller</span>Login</p>
                <div className="w-full">
                    <p>Email</p>
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email"  className="border border-gray-200 rounded w-full p-2 mt-1  outline-primary" required value={email}/>
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input type="password" placeholder="Password" className="border border-gray-200 rounded w-full p-2 mt-1  outline-primary" required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
            </div>
            
        </form>
    )
}

export default SellerLogin