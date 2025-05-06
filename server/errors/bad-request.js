import CustomError from "./customError.js";

class BadRequest extends CustomError{
    constructor(msg){
        super(msg);
        this.statusCode = 400
            
    }
}
export default BadRequest