import express from "express";
import authSeller from "../middleware/authSeller.js";
import { getAllOrders, getUserOrders, placeOrderCod, placeOrderStripe } from "../controllers/order.js";
import authUser from "../middleware/authUser.js";

const router =express.Router();

router.route("/cod").post(authUser,placeOrderCod)
router.route("/stripe").post(authUser,placeOrderStripe)
router.route("/user").get(authUser,getUserOrders)
router.route("/seller").get(authSeller,getAllOrders)




export default router;