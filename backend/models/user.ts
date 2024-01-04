import mongoose, { Schema, Document, Types } from "mongoose";
import { IProduct } from "./Product";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  admin: boolean;
  careItems: Types.Array<IProduct>;
  cart: Types.Array<IProduct>;
  gender: string;
  phone: string;
  address: string;
  description: string;
  birthday: string;
  image: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  careItems: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  gender: { type: String },
  birthday: { type: String },
  address: { type: String },
  description: { type: String },
  phone: { type: String },
  image: { type: String },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
