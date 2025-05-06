import CustomError from "./customError.js";

class NotFound extends CustomError{
    constructor(msg){
        super(msg);
        this.statusCode = 404
            
    }
}
export default NotFound