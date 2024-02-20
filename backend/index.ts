import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authenticateToken from "./middleware/authToken";
import productRoute from "./router/product.route";
import authRoute from "./router/auth.route";
import userRoute from "./router/user.route";
import billRoute from "./router/bill.route";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/vueproject";

mongoose
  .connect(MONGODB_URL!)
  .then(() => console.log("Connect to mongoDB successfully"));

app.use("/v1/products", authenticateToken, productRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/users", authenticateToken, userRoute);
app.use("/v1/bills", billRoute);

app.listen(port, () => {
  console.log("listening on port " + port);
});
