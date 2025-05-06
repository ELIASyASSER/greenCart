import { useEffect, useState } from "react";
import { useAppContext } from "../context/appcontext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/productCard";

const ProductDetails = () => {
   const {products,navigate,currency,AddProductToCart} = useAppContext()
    const [thumbnail, setThumbnail] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const{id} = useParams()
    const product = products.find((prod)=>prod._id == id)
    useEffect(()=>{
        if(product){
            let productCopy = products.slice();
            productCopy = productCopy.filter((item)=>product.category == item.category&& product._id !== item._id)
            setRelatedProducts(productCopy.slice(0,5))

        }
    },[products])
    // console.log('d',relatedProducts)// here it empty array
    useEffect(()=>{
        setThumbnail(product?.image[0]?product.image[0]:null)
    },[product])

    return product && (
        <div className="mt-16">
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                                <img key={i} src={i<4?assets.star_icon:assets.star_dull_icon} alt="star icon" />
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" onClick={()=>AddProductToCart(product._id)} >
                            Add to Cart
                        </button>
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary transition"  onClick={()=>{
                            AddProductToCart(product._id);navigate(`/cart`)
                        }}>
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* Related Products */}
            <div className=" flex flex-col items-center mt-20">
                <div className="flex flex-col items-end  w-max">
                    <p className="text-2xl font-medium uppercase font-medium">Related Products</p>
                    <div className="w-16 h-1 bg-primary rounded-full"></div>    
                </div>
                <div className="grid mt-6 grid-cols-2 md:grid-cols-3  gap-3 md:gap-6  xl:grid-cols-5">
                    {relatedProducts.filter((item)=>item.inStock).map((item)=>(
                        <ProductCard key={item._id} product={item}/>
                    ))}
                </div>
                <button onClick={()=>{navigate('/products');scrollTo(0,0)}} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border-rounded  border-2 text-2xl text-primary transition hover:bg-primary/10">See More</button>
            </div>
        </div>
  )
}

export default ProductDetails