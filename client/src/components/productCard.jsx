import { assets } from "../assets/assets";
import { useAppContext } from "../context/appcontext";

const ProductCard = ({product}) => {
    const {currency,AddProductToCart,cartItems,removeProduct,navigate} = useAppContext()
    // console.log('debugging',cartItems)
    return product &&(
        <div  className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2 " onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)}}>
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name}  />
            </div>
            <div className="text-gray-500/60 text-xl">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-2xl truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                            <img className="w-3 md:w-3.5" key={i} src={i<4?assets.star_icon:assets.star_dull_icon} alt=""/>
                    ))}
                    <p>4</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-[30px] text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "} <span className="text-gray-500/60 md:text-[18px] text-xs line-through">{currency}{product.price}</span>
                    </p>
                    <div className="text-primary">
                        {!cartItems[product._id] ? (
                            <button className="cursor-pointer flex items-center justify-center gap-1 bg-primary/5 border border-primary md:w-[80px] w-[64px] h-[34px] rounded text-primary font-medium" onClick={() => AddProductToCart(product._id)} >
                                <img src={assets.cart_icon} alt="cart icon" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => removeProduct(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => AddProductToCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductCard