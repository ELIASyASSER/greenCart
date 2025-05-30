import { useParams } from "react-router-dom"
import { useAppContext } from "../context/appcontext"
import { categories } from "../assets/assets"
import ProductCard from "../components/productCard"
const ProductCategory = () => {
    const {products} = useAppContext()
    const {category} = useParams()
    const searchCategory = categories.find((item)=>item.path.toLowerCase() == category)
    const filteredProducts = products.filter((product)=>product.category.toLowerCase()==category) 
  return (
    <div className="mt-16">
        {searchCategory&& (
            <div className="flex flex-col items-end w-max">
                <p className="font-medium text-2xl">{searchCategory.text.toUpperCase()}</p>
                <div className="w-16 h-1 bg-primary rounded-full"></div>
            </div>
        )}


        {filteredProducts.length>0?(
        <div className="grid mt-6  sm:grid-cols-2 md:grid-cols-3  gap-3 md:gap-6  xl:grid-cols-5">
        {
            filteredProducts.map((product)=>(
                <ProductCard  key={product._id} product={product}/>
                
            ))
        }
        </div>

        ):<div className="flex items-center justify-center h-[60vh]">
        <p className="text-2xl font-medium text-primary">No Products Found</p>
        </div>}
    </div>
  )
}

export default ProductCategory