import { createContext ,useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import {toast}from "react-hot-toast"
import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true

const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const[user,setUser] = useState("")
    const[isSeller,setIsSeller] = useState(false)
    const[showUserLogin,setShowUserLogin] = useState(false)
    const[products,setProducts] = useState([])
    const[cartItems,setCartItems] = useState({})
    const[searchQuery,setSearchQuery] = useState("")
    
    //seller status
    const sellerStatus = async()=>{
        try {
            const {data} = await axios.get("/api/seller/is-auth");
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
            
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message||error.message)
            setIsSeller(false)
        }
    } 



//user status
const userStatus = async()=>{
    try {
        const {data} = await axios.get("/api/user/is-auth");
        if(data.success){
            setUser(data.user)
            setCartItems(data.user.cartItems)
        }
        
    } catch (error) {
        console.log(error.message)
        toast.error(error?.response?.data?.message||error.message)
        setUser(null)
    }
} 





    //fetch all products
    const fetchProducts = async()=>{
        try {
            const{data} = await axios.get("/api/product/list")
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data?.response?.data?.message)    
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message||error.message)
            
        }
    }



    // add product to the cart
    const AddProductToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]+=1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData)
        toast.success("Added to cart")
    }
    // update cart items
    const updateCartItems = (itemId,quantity)=>{
        let cartData = structuredClone(cartItems)
        cartData[itemId] = quantity
        setCartItems(cartData)
        toast.success("cart updated successfully")
    }
    // remove product  from the cart 
    const removeProduct = (itemId)=>{
        let cartData = structuredClone(cartItems)
        if(cartData[itemId]){
            cartData[itemId] -=1;
            if(cartData[itemId] ===0){
                delete cartData[itemId]
            }
        }
        toast.success("removed from the cart")
        setCartItems(cartData)
    }
    // get cart count
    const getCartCount =()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount+=cartItems[item]
        }
        return totalCount;
    } 
    const getCartAmount=()=>{
        let totalAmount = 0;
        for(const item in cartItems){
            let itemInfo = products.find((prod)=>prod._id === item)
            if(cartItems[item]>0){
                totalAmount+= itemInfo.offerPrice*cartItems[item]
            }
        }
        return Math.floor(totalAmount*100)/100
    }
    useEffect(()=>{
        sellerStatus()
        userStatus()
        fetchProducts()
    },[])
    useEffect(()=>{
        const updateCart = async()=>{
            try {
                const {data} = await axios.post("/api/cart/update",{cartItems})
                console.log(data)
                if(data.success){
                    toast.success(data.message)
                }else{
                    toast.error(data?.response?.data?.message||data?.message)

                }

            } catch (error) {
                console.log(error.message)
                toast.error(error?.response?.data?.message||error.message)
            }
        }
        if(user){
            updateCart()
        }
    },[cartItems])
    const value ={
        navigate,user,
        setUser,isSeller,
        setIsSeller,showUserLogin,
        setShowUserLogin,products,
        AddProductToCart,updateCartItems,
        removeProduct,
        currency,cartItems,
        searchQuery,setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        fetchProducts,setCartItems
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}
export const useAppContext = ()=>{
    return useContext(AppContext)
}