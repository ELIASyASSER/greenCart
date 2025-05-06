import { useAppContext } from "../context/appcontext"
import ProductCard from "./productCard"

const BestSeller = () => {
    const {products} = useAppContext()
  return (
    <div className="mt-16">
        <p className="text-2xl md:text-3xl font-medium ">Best Sellers</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-3 md:gap-6 ">
            {products.filter((product)=>product.inStock).slice(0,5).map((prod,idx)=>{
                return <ProductCard product={prod} key={idx}/>

            })}
        </div>
    </div>
  )
}

export default BestSeller