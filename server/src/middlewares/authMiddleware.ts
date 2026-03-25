import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  if (!authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Invalid token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const payload: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "access_secret"
    );
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
