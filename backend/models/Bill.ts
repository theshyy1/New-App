import mongoose, { Document, Schema } from "mongoose";

export interface IBill extends Document {
  user_id: string;
  products: Array<String>;
  totalPrice: number;
  createAt: string;
}

const BillSchema: Schema = new Schema({
  user_id: String,
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  totalPrice: Number,
  createAt: String,
});

const Bill = mongoose.model<IBill>("Bill", BillSchema);

export default Bill;
