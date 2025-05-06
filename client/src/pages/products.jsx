import { useEffect, useState } from "react"
import { useAppContext } from "../context/appcontext"
import ProductCard from "../components/productCard"

const AllProducts = () => {
    const {products,searchQuery} = useAppContext()
    const[filteredProducts,setFilteredProducts] = useState([]) 
    
    useEffect(()=>{
        
        if(searchQuery.length>0){
            setFilteredProducts(products.filter((product)=>product.name.toLowerCase().includes(searchQuery)))
        }else{
            setFilteredProducts(products)
        }
    },[products,searchQuery])
    return (
    <div className=" mt-16 flex flex-col">
        <div className="flex flex-col items-end  w-max">

            <p className="text-2xl font-medium uppercase">All Products</p>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>
        <div className="grid mt-6 grid-cols-2 md:grid-cols-3  gap-3 md:gap-6  xl:grid-cols-5 ">
            {
                filteredProducts.
                filter((product)=>product.inStock).
                map((product,idx)=>(
                    <ProductCard key={idx} product={product}/>
                ))

            }
        </div>
    </div>
  )
}

export default AllProducts