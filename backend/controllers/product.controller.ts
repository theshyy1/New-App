import express, { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";

const productController = {
  getProducts: async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;

    try {
      const skip = (page - 1) * limit;
      const products = await Product.find().skip(skip).limit(limit);
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const allProducts = await Product.find();
      res.status(200).json({
        products,
        totalPages,
        currentPage: page,
        allProducts,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createProduct: async (req: Request, res: Response) => {
    try {
      const exist = await Product.findOne({ name: req.body.name });
      if (exist) {
        res.status(400).json({ msg: "Product already exists" });
        return;
      }

      const product = { ...req.body, star: 0, soldQuantity: 0 };
      const newProduct: IProduct = await Product.create(product);
      res.status(200).json(newProduct);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getProduct: async (req: Request, res: Response) => {
    try {
      const product: IProduct | null = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateProduct: async (req: Request, res: Response) => {
    try {
      const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.status(200).json({ msg: "Updated successfully", updatedProduct });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default productController;
