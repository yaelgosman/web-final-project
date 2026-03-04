import { Request, Response } from "express";
import User from "../models/userModel";
import RefreshToken from "../models/refreshTokenModel";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    passwordHash: hash,
    provider: "local",
  });
  res.json({ userId: user._id });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash)
    return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: "No token" });

  // verify token exists in DB
  const saved = await RefreshToken.findOne({ token });
  if (!saved) return res.status(401).json({ error: "Invalid refresh token" });

  // verify JWT
  try {
    const payload: any = generateAccessToken(saved.userId.toString());
    const newAccessToken = generateAccessToken(saved.userId.toString());
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { token } = req.body;
  await RefreshToken.deleteOne({ token });
  res.json({ message: "Logged out" });
};
