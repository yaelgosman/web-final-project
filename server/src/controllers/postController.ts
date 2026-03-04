import { Request, Response } from "express";
import Post from "../models/postModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createPost = async (req: AuthRequest, res: Response) => {
  const { restaurant, rating, text, imagePath } = req.body;
  const post = await Post.create({
    userId: req.userId,
    restaurant,
    rating,
    text,
    imagePath,
  });
  res.json(post);
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find()
    .populate("userId", "username profileImage")
    .sort({ createdAt: -1 });
  res.json(posts);
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.userId.toString() !== req.userId)
    return res.status(403).json({ error: "Forbidden" });

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.userId.toString() !== req.userId)
    return res.status(403).json({ error: "Forbidden" });

  await post.deleteOne();
  res.json({ message: "Deleted" });
};
