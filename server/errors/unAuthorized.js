import CustomError from "./customError.js";

class UnAuthorized extends CustomError{
    constructor(msg){
        super(msg);
        this.statusCode = 401
            
    }
}
export default UnAuthorized