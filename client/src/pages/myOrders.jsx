import { useEffect, useState } from "react"
import { useAppContext } from "../context/appcontext"
import { assets, dummyOrders } from "../assets/assets"
import toast from "react-hot-toast"

const MyOrders = () => {
  const [orders,setOrders] = useState([])
  const{currency,axios,user} = useAppContext()
  
  const fetchOrders = async()=>{
    try {
        const {data} =await axios.get("/api/order/user")
        console.log(data)
        if(data.success){
            setOrders(data.orders)
        }else{
            console.log(data.message)
        toast.error(data?.response?.data?.message||data.message)
        }
    } catch (error) {
        console.log(error.message)
        toast.error(error?.response?.data?.message||error.message)
    
    }
  }
  
  useEffect(()=>{
    if(user){
        
        fetchOrders()
    }

  },[user])  

  return (
    
    <main className="mt-16 pb-16">

        <div className="flex flex-col items-end w-max mb-8">
            <p className="text-2xl font-medium uppercase">My Orders</p>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>
        {
            orders.map((ord,idx)=>{
                return <section key={idx} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
                    <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
                        <span className="">Order Id: {ord._id}</span>
                        <span>Payment: {ord.paymentType}</span>
                        <span>Total Amount: {currency}{ord.amount}</span>
                    </p>
                    {
                        ord.items.map((it,idx)=>{
                            return <div key={idx} className={`relative bg-white text-gray-500/70  border-gray-300  flex flex-col md:flex-row justify-between md:items-center p-4 py-5 w-full md:gap-16 max-w-4xl ${ord.items.length !== idx+1 &&"border-b"}`}>
                                <div className="flex items-center  mb-4 md:mb-0">
                                    <div className="bg-primary/10 p-4 rounded-l-lg">
                                        <img src={it.product.image[0]} alt="products" className="w-26 h-26" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-xl font-medium text-gray-800">{it.product.name}</h2>
                                        <p>{it.product.category}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center mb-4 md:mb-0 md:ml-8">
                                    <p>Quantity: {it.product.quantity||"1"}</p>
                                    <p>Status: {ord.status||"1"}</p>
                                    <p>Date: {new Date(ord.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className="text-primary font-medium text-lg">Amount: {currency}{it.product.offerPrice*it.quantity}</p>
                            </div>
                        })
                    }
                </section>
            })
        }
    </main>
  )
}

export default MyOrders