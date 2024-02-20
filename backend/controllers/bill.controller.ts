import express, { Request, Response } from "express";
import Bill, { IBill } from "../models/Bill";

const billController = {
  createBill: async (req: Request, res: Response) => {
    try {
      const newBill: IBill = await Bill.create(req.body);
      res.status(200).json({ message: "Created successfully", newBill });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getBills: async (req: Request, res: Response) => {
    try {
      const allBills = await Bill.find();
      res.status(200).json(allBills);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getBillById: async (req: Request, res: Response) => {
    try {
      const thisBill: IBill | null = await Bill.findOne({
        _id: req.params.id,
      }).populate("products");
      res.status(200).json(thisBill);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getBillsById: async (req: Request, res: Response) => {
    try {
      const allBills = await Bill.find().populate("products");
      const allBillsById = allBills.filter(
        (i) => i.user_id === String(req.params.id)
      );
      res.status(200).json(allBillsById);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default billController;
