import {  useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { assets } from "../assets/assets"
import { useAppContext } from "../context/appcontext"
import toast from "react-hot-toast"
const NavBar = () => {
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const {searchQuery,setSearchQuery,user,setUser,setShowUserLogin,navigate,getCartCount,getCartAmount,axios} = useAppContext()
    const logOut = async()=>{
        try {
            const {data} = await axios.get("/api/user/logout")
            console.log(data,"data")
            if(data.success){
                toast.success(data.message)
                setUser(null);
                navigate("/")

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
        if(searchQuery && location.pathname!=="products"){
            navigate("/products")

        }
    },[searchQuery])
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all" >

            <NavLink to={"/"} onClick={()=>setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="dummyLogoColored" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">

                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/products"}>All Products</NavLink>
                <NavLink to={"/contact"}>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" onChange={(e)=>{
                        setSearchQuery(e.target.value.toLowerCase() )
                    }}  />
                    <img src={assets.search_icon} alt="search" className="w-4 h-4" />
                </div>

                <div className="relative cursor-pointer" onClick={()=>navigate("/cart")}>
                    <img src={assets.nav_cart_icon} alt="cart icon" className="w-6 opacity-80" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                {!user?(

                    <button  onClick={()=>{
                        setShowUserLogin(true);

                    }} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                    </button>
                ):(
                    <div className="relative group">
                        <img src={assets.profile_icon} alt="profile icon" className="w-10" />
                        <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-35 rounded-md text-sm z-40 ">
                            <li onClick={()=>navigate("/orders")} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">My Orders</li>
                            <li onClick={()=>logOut()} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                )
                }
            </div>


            {/* Mobile Menu */}
                <div className="flex items-center gap-6 sm:hidden">

                    <div className="relative cursor-pointer" onClick={()=>navigate("/cart")}>
                            <img src={assets.nav_cart_icon} alt="cart icon" className="w-6 opacity-80" />
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                        </div>
                            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden cursor-pointer">
                            {/* Menu Icon SVG */}
                                <img src={assets.menu_icon} alt="menu" />
                            </button>
                        </div>
            

            {
                open&&(
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`} >
                <NavLink to={"/"} className="block" onClick={()=>setOpen(false)}>Home</NavLink>
                <NavLink to={"/products"} onClick={()=>setOpen(false)} className="block">All Products</NavLink>
                <NavLink to={"/contact"} className="block" onClick={()=>setOpen(false)}>Contact</NavLink>
                {user&&
                <NavLink to={"/orders"} className="block" onClick={()=>setOpen(false)}>My Orders</NavLink>
                }

                {!user?(
                    <button onClick={()=>{
                        setOpen(false);
                        setShowUserLogin(true);

                    }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Login
                </button>
                ):(
                    <button onClick={()=>{
                        setOpen(false);
                        logOut()
                    }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Logout
                </button>
                )}
            </div>

                )
            }

        </nav>
    )
}
export default NavBar