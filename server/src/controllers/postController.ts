import { Request, Response } from "express";
import Post from "../models/postModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createPost = async (req: AuthRequest, res: Response) => {
  const { rating, text } = req.body;
  
  // parse the restaurant string back into an object
  let parsedRestaurant;
  try {
    // Check if it's a string (FormData) and parse it. 
    // The fallback allows standard JSON requests to still work during API testing.
    parsedRestaurant = typeof req.body.restaurant === 'string' 
      ? JSON.parse(req.body.restaurant) 
      : req.body.restaurant;
  } catch (error) {
    return res.status(400).json({ error: "Invalid restaurant data format" });
  }
    
  const imagePath = req.file ? req.file.path : req.body.imagePath;

  try {
    const post = await Post.create({
      userId: req.userId,
      restaurant: parsedRestaurant,
      rating: Number(rating),
      text,
      imagePath,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Database save error:", error);
    res.status(500).json({ error: "Failed to save post" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find()
    .populate("userId", "username profileImageUrl")
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

export const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Find all posts where the author's ID matches the one in the URL
    const userPosts = await Post.find({ userId: userId });
    
    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};