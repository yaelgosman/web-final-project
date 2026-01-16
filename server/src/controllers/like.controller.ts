import { Request, Response } from "express";
import Like from "../models/like.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const likePost = async (req: AuthRequest, res: Response) => {
  const { postId } = req.body;
  try {
    const like = await Like.create({ postId, userId: req.userId });
    res.json(like);
  } catch (err) {
    res.status(400).json({ error: "Already liked" });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
  const { postId } = req.body;
  await Like.deleteOne({ postId, userId: req.userId });
  res.json({ message: "Unliked" });
};

export const getLikesByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const likes = await Like.find({ postId });
  res.json({ count: likes.length });
};
