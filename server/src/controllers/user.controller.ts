import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { username, profileImage } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (username) user.username = username;
  if (profileImage) user.profileImage = profileImage;
  await user.save();

  res.json(user);
};
