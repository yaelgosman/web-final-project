import { Request, Response } from "express";
import Like from "../models/likeModel";
import { AuthRequest } from "../middlewares/authMiddleware";

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

export const getLikesByPost = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const likes = await Like.find({ postId });
  
  // Check if the currently logged-in user's ID is in this list
  const hasLiked = likes.some(like => like.userId.toString() === req.userId);
  
  // Return BOTH the count and the boolean to the frontend
  res.json({ 
    count: likes.length, 
    hasLiked 
  });
};
