import { Route, Routes, useLocation } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/home"
import Footer from "./components/footer"
import { Toaster } from "react-hot-toast"
import { useAppContext } from "./context/appcontext"
import Login from "./pages/login"
import AllProducts from "./pages/products"
import ProductCategory from "./pages/productCategory"
import ProductDetails from "./pages/productDetails"
import Cart from "./pages/cart"
import AddAddress from "./pages/addAddress"
import MyOrders from "./pages/myOrders"
import SellerLogin from "./pages/seller/sellerLogin"
import SellerLayout from "./pages/seller/sellerLayout"
import AddProduct from "./pages/seller/addProduct"
import ProductList from "./pages/seller/productList"
import Orders from "./pages/seller/orders"
import Loading from "./components/loading"

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin,isSeller} = useAppContext()
  // const { user } = useAppContext();
  // console.log("Current path:", useLocation().pathname);
  // console.log("Current user:", user);
  return (
    <div className="text-base min-h-screen text-gray-700 bg-white">
      {isSellerPath?null:<NavBar/>}
      {showUserLogin ?<Login/>:null}
      <Toaster/>
      <div className={`${isSellerPath?"":"px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/products" element={<AllProducts/>}/>
          <Route path="/products/:category" element={<ProductCategory/>}/>
          <Route path="/products/:category/:id" element={<ProductDetails/>}/>

          <Route path="/cart" element={<Cart/>}/>
          <Route path="/add-address" element={<AddAddress/>}/>
          <Route path="/my-orders" element={<MyOrders/>}/>

          <Route path="/loader" element={<Loading/>}/>
          <Route path="/seller" element={isSeller?<SellerLayout/>:<SellerLogin/>}>
            <Route index element={isSeller?<AddProduct/>:null}/>
            <Route path="product-list" element={<ProductList/>}/>
            <Route path="orders" element={<Orders/>}/>
          </Route>
        </Routes>
      </div>
      {!isSellerPath&& <Footer/>}
    </div>
  )
}

export default App