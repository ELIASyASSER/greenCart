import { useAppContext } from "../../context/appcontext"
import { Navigate } from "react-router-dom"
const ProtectedSeller = ({children}) => {
    const {isSeller} = useAppContext()
    if(!isSeller){
        return <Navigate to={"/"}/>
    }
  
}

export default ProtectedSeller