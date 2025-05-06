import BadRequest from "../errors/bad-request.js";
import OrderModel from "../models/order.js";
import Product from "../models/Product.js";
import User from "../models/User.js"
import stripe from "stripe";

// place order COD  /api/order/cod

export const placeOrderCod = async(req,res,next)=>{
    try {
        const {id:userId} = req.userId;
        const{address,items} = req.body;
        if(!address || items.length ==0){
            return next(new BadRequest("Invalid Data "))
        }
        // calculate amount 
        let amount = 0;

        for (const currItem of items) {
            const product = await Product.findById(currItem.product);
            if (!product) {
                return next(new BadRequest(`Product not found: ${currItem.product}`));
            }
        amount += product.offerPrice * currItem.quantity;
}

        // add tax 2 %
        amount+=Math.floor(amount*0.02)
        console.log(amount,'amount')
        await OrderModel.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD"
        })
        return res.status(201).json({success:true,message:"Order Placed Successfully "})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}





// place order payment  /api/order/stripe
export const placeOrderStripe = async(req,res,next)=>{
    try {
        const {id:userId} = req.userId;
        const{address,items} = req.body;
        const{origin} = req.headers;
        console.log("headers is", req.headers)

        if(!address || items.length ==0){
            return next(new BadRequest("Invalid Data "))
        }

        let productData = []
        // calculate amount 
        let amount = 0;

        for (const currItem of items) {
            const product = await Product.findById(currItem.product);
            if (!product) {
                return next(new BadRequest(`Product not found: ${currItem.product}`));
            }
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:currItem.quantity,
            })
        amount += product.offerPrice * currItem.quantity;
}

        // add tax 2 %
        amount+=Math.floor(amount*0.02)
        console.log(productData,'product data')
        const order = await OrderModel.create({
            userId,
            items,
            amount,
            address,
            paymentType:"online"
        })
        // stripe gateways initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        // create line items for stripe 
        const line_items = productData.map((item)=>{
            return {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name,

                    },
                    unit_amount:Math.floor(item.price + item.price * 0.02)*100,
                },
                quantity:item.quantity
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId
            }
        })
        return res.status(201).json({success:true,url:session.url})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

// STRIPE WEBHOOK TO VERIFY PAYMENT ACTION 

export const stripeWebHooks = async(req,res,next)=>{
    // stripe gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
        
    } catch (error) {
        console.log(error.message)
        next(new BadRequest("webhook error"+error.message))
    }
    // handle the event

    switch (event.type) {

        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            // get session meta data
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId
            })
            const {orderId,userId} = session.data[0].metadata;
            // mark payment as paid 
            await OrderModel.findByIdAndUpdate(orderId,{isPaid:true})
            // clear user cart
            await User.findByIdAndUpdate(userId,{cartIems:{}})
            break;
            
        }
        
        
        case "payment_intent.payment_failed":{

            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            // get session meta data
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId
            })
            const {orderId} = session.data[0].metadata;
            await OrderModel.findByIdAndDelete(orderId)   
            break;
            }
            default:
                console.error(`unable event type ${event.type}`);
                break;
            }
            res.status(200).json({received:true})

}   



































// get orders by userId /api/order/user
export const getUserOrders = async(req,res,next)=>{
    try {
        const {id:userId} = req.userId;
        const orders = await OrderModel.find({userId,$or:[
            {paymentType:"COD"},
            {isPaid:true},
        ]}).populate("items.product address").sort({createdAt:-1})

        res.status(200).json({success:true,orders})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


export const getAllOrders = async(req,res,next)=>{
    try {
        const orders = await OrderModel.find({$or:[{paymentType:"COD"},{isPaid:true},
        ]}).populate("items.product address").sort({createdAt:-1})

        res.status(200).json({success:true,orders})


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

// get all orders for (seller - admin)/api/order/seller