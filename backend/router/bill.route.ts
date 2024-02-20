import express from "express";
import billController from "../controllers/bill.controller";

const router = express.Router();

router.get("/", billController.getBills);

router.post("/create", billController.createBill);

router.get("/:id", billController.getBillById);

router.get("/history/:id", billController.getBillsById);

// router.delete("/:id", BillController);

export default router;
