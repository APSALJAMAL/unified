import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET as string;

type JwtPayload = {
  id: number;
  role: "USER" | "ADMIN" | "OWNER";
};

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded; // ✅ SAFE: AuthRequest allows `user`
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
