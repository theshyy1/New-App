import { Request, Response } from "express";
import User, { IUser } from "../models/user";

const UserController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const allUsers: IUser[] = await User.find();
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const user: IUser | null = await User.findOne({
        _id: req.params.id,
      }).populate("careItems cart");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateUser: async (req: Request, res: Response) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body }
      );

      res.status(200).json({ message: "Updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    try {
      const user: any = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Deleted successfully", user });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default UserController;
