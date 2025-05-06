const errorHandler = (err,req,res,next)=>{
    const statusCode = err.statusCode ||500;
    const msg = err.message||"something went wrong try again later"

    res.status(statusCode).json({message:msg})

}
export default errorHandler