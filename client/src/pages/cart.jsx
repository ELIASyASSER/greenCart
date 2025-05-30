import { useEffect, useState } from "react"
import { useAppContext } from "../context/appcontext"
import { assets, dummyAddress } from "../assets/assets"
import toast from "react-hot-toast"

const Cart = () => {
    const{currency,cartItems,setCartItems,
        getCartAmount,getCartCount,
        removeProduct,navigate,
        products,updateCartItems,
        axios,user
    } = useAppContext()

    const [cartArray,setCartArray] = useState([])
    const[addresses,setAddresses] =useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress,setSelectedAddress] = useState(null)
    const [paymentOption,setPaymentOption] = useState("COD")

    const getCart = ()=>{
        let tempArr = []
        for(const key in cartItems){
            const product = products.find((item)=>item._id == key)
            product.quantity = cartItems[key]
            tempArr.push(product)
        }
        setCartArray(tempArr)
    }
    useEffect(() => {
        if(products.length>0 && cartItems){
            getCart()
        }

    }, [products,cartItems])
    
    // console.log('items',cartArray)
    const placeOrder  =async function () {
        try {
            if(!selectedAddress){
                toast.error("please select address first",{duration:5000})
            }
            if(paymentOption =='COD'){

                const {data} = await axios.post("/api/order/cod",{
                    items:cartArray.map((item)=>({product:item._id,quantity:item.quantity})),
                    
                    address:selectedAddress._id
                })
                if(data.success){
                    toast.success(data.message,{duration:6000})
                    setCartItems({})
                    navigate("/my-orders")
                    
                }else{
                    console.log(data.message)
                    toast.error(data?.response?.data?.message||data.message)                    
                }

            }else{
                // place order with stripe
                
                const {data} = await axios.post("/api/order/stripe",{
                    items:cartArray.map((item)=>({product:item._id,quantity:item.quantity})),
                    
                    address:selectedAddress._id
                })
                if(data.success){
                    window.location.replace(data.url)

                    
                }else{
                    console.log(data.message)
                    toast.error(data?.response?.data?.message||data.message)                    
                }
            }
            
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message||error.message)
        
        }
        
    }


    const getAddress =async()=>{
        try {
            const{data} = await axios.get("/api/address/get")
            if(data.success){
                setAddresses(data.addresses)
                if(data.addresses.length>0){
                    setSelectedAddress(data.addresses[0])
                }

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
            getAddress()
        }

    },[user])
    return products.length>0 && cartItems?(
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)}} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select className='outline-none' value={cartItems[product._id]} onChange={(e)=>updateCartItems(product._id,parseInt(e.target.value))}>
                                            {Array(cartItems[product._id]>9?cartItems[product._id]:9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button className="cursor-pointer mx-auto" onClick={()=>{removeProduct(product._id)}}>
                            <img src={assets.remove_icon} alt="remove icon" className="inline-block size-6" />
                        </button>
                    </div>)
                )}

                <button className="border-2  px-6 py-4 rounded-2xl hover:bg-primary-dull/20 transition-[2s]  group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium" onClick={()=>{navigate(`/products`);scrollTo(0,0)}}>
                    <img src={assets.arrow_right_icon_colored} alt="right arrow" className="inline-block group-hover:-translate-x-1 transition" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress?`${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`:"No Address Found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((add,idx)=>(
                                    <p key={idx} onClick={() => {setSelectedAddress(add);setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100 transition">
                                    {add.street},{add.city},{add.state},{add.country}
                                </p>
                                )) 
                                }
                                <p onClick={() => {navigate('/add-address')}} className="text-primary text-center cursor-pointer p-2 hover:bg-primary hover:text-white">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={(e)=>setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="ONLINE">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartAmount()*2/100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{currency}{(getCartAmount()*2/100)+getCartAmount()}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption =="COD"?"Place Order":"Use Online Payment"}
                </button>
            </div>
        </div>
    ):null
}
export default Cart