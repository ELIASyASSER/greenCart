import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middleware/authSeller.js";
import { addProduct, changeStock, productList, singleProduct } from "../controllers/product.js";

const router =express.Router();

router.route("/add").post(upload.array(["images"]),authSeller,addProduct)

router.route("/stock").post(authSeller,changeStock)
router.route("/list").get(authSeller,productList)
router.route("/id").get(authSeller,singleProduct)



export default router;