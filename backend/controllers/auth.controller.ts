import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let refreshTokenArray: string[] = [];

const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser: IUser = await User.create({
        ...req.body,
        password: hash,
        careItems: [],
        cart: [],
        phone: "",
        address: "",
        gender: "",
        birthday: "",
        description: "",
      });
      res
        .status(200)
        .json({ message: "Đăng ký tài khoản thành công!", newUser });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateUser: async (req: Request, res: Response) => {
    try {
      const newUser: IUser | null = await User.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: "Updated user successfully", newUser });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  generateAccessToken: (user: IUser): string => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      "myaccesskey",
      { expiresIn: "120s" }
    );
  },
  generateRefreshToken: (user: IUser): string => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      "myrefreshtoken",
      { expiresIn: "365d" }
    );
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const validUser: any = await User.findOne({ email: email });
      if (!validUser) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const truePassword = bcrypt.compareSync(password, validUser!.password);
      if (!truePassword) {
        res.status(400).json({ message: "Wrong password" });
        return;
      }

      if (validUser && truePassword) {
        const accessToken = AuthController.generateAccessToken(validUser);
        const refreshToken = AuthController.generateRefreshToken(validUser);

        refreshTokenArray.push(refreshToken);
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = validUser._doc;
        const user = await User.findById(others._id).populate("careItems cart");

        res.status(200).json({
          message: "Login successful",
          user,
          accessToken,
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ message: "You'r not loggin" });
      return;
    }

    if (!refreshToken.includes(refreshToken)) {
      return res.status(403).json({ message: "Refresh token is invalid" });
    }

    jwt.verify(refreshToken, "myrefreshtoken", (err: any, user: any) => {
      if (err) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
      }

      refreshTokenArray = refreshTokenArray.filter(
        (token) => token !== refreshToken
      );

      const newAccessToken = AuthController.generateAccessToken(user);
      const newRefreshToken = AuthController.generateRefreshToken(user);

      refreshTokenArray.push(newRefreshToken);

      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },
};

export default AuthController;
