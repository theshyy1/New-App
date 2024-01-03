import express from "express";
import UserController from "../controllers/user.controller";
import authenticateToken from "../middleware/authToken";

const router = express.Router();

router.get("/", UserController.getUsers);

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.updateUser);

// router.put("/:id/cart", UserController.updateCart);

router.delete("/:id", UserController.deleteUser);

export default router;
