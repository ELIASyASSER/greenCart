import { useState } from "react";
import {useAppContext} from "../../context/appcontext"
import toast from "react-hot-toast";
const ProductList = () => {
const{currency,products,axios,fetchProducts} = useAppContext()

const ToggleSwitch = ({id,inStock}) => {
    const [checked,setChecked] = useState(inStock)

    const toggleBtn = async()=>{
        const updatedStock = !checked
        try {    
            
            const {data} = await axios.post("/api/product/stock",{id,inStock:updatedStock})
            if(data.success){
                fetchProducts()
                toast.success(data.message)

            }else{

                toast.error(data?.response?.data?.message||data.message)
                console.log(data?.response?.data?.message||data.message)
                setChecked(!updatedStock)

                toast.error(data?.response?.data?.message||data.message)
                setChecked(!updatedStock)
        
                
        }
    } catch (error) {
        console.log(error.message)
        toast.error(error?.response?.data?.message||error.message)
        setChecked(!updatedStock)

        
    }
        
    }


  return (
    <label className="relative inline-block w-20 h-8 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        onChange={()=>toggleBtn(id,!inStock)}
        checked={checked}
      />
      <div className="w-full h-full bg-gray-300 rounded-full transition duration-300 peer-checked:bg-indigo-500"></div>
      <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-12"></div>
    </label>
  );
};



return (
      <div className="flex-1 py-10 flex flex-col justify-between">
          <div className="w-full md:p-10 p-4">
              <h2 className="pb-4 text-lg font-medium">All Products</h2>
              <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                  <table className="md:table-auto table-fixed w-full overflow-hidden">
                      <thead className="text-gray-900 text-sm text-left">
                          <tr>
                              <th className="px-4 py-3 font-semibold truncate">Product</th>
                              <th className="px-4 py-3 font-semibold truncate">Category</th>
                              <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                              <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm text-gray-500">
                          {products.map((product) => (
                              <tr key={product._id} className="border-t border-gray-500/20">
                                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                      <div className="border border-gray-300 rounded p-2">
                                          <img src={product.image[0]} alt="Product" className="w-16" />
                                      </div>
                                      <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                  </td>
                                  <td className="px-4 py-3">{product.category}</td>
                                  <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                  <td className="px-4 py-3">
                                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                          <input type="checkbox" className="sr-only peer"  />
                                          <ToggleSwitch
                                          id={product._id}
                                          inStock={product.inStock}
                                          checked={product.inStock}
                                        />
                                        </label>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  )
}

export default ProductList