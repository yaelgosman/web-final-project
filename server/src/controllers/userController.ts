import { Request, Response } from "express";
import User from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { username, profileImageUrl } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (username) user.username = username;
  if (profileImageUrl) user.profileImageUrl = profileImageUrl;
  await user.save();

  res.json(user);
};
