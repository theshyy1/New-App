import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any;
  name: string;
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "Your're not authenticated" });

  jwt.verify(token, "myaccesskey", (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    } else {
      (req as CustomRequest).user = user;
      next();
    }
  });
};

export default authenticateToken;
