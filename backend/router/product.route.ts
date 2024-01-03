import express from "express";
import productController from "../controllers/product.controller";

const router = express.Router();

router.get("/", productController.getProducts);

router.post("/create", productController.createProduct);

router.get("/:id", productController.getProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

export default router;
