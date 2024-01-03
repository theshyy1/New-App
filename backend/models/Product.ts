import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  soldQuantity: number;
  star: number;
  image: string;
  quantityInStock: number;
  quantity: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  soldQuantity: { type: Number, required: true },
  quantity: { type: Number },
  star: { type: Number },
  image: { type: String, required: true },
  quantityInStock: { type: Number },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
