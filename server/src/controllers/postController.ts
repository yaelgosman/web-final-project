import { Request, Response } from "express";
import Post from "../models/postModel";
import User from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

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

// GET /api/posts/:id - Get single post
export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate(
      "userId",
      "username profileImagePath"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error: any) {
    console.error("Get post error:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// POST /api/posts - Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid or missing authentication" });
    }
    const { restaurant, rating, text, imagePath } = req.body;

    // Validation
    if (!restaurant?.name || !restaurant?.city) {
      return res.status(400).json({ error: "Restaurant name and city are required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!imagePath) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await Post.create({
      userId,
      restaurant: {
        name: restaurant.name.trim(),
        city: restaurant.city.trim(),
        cuisine: restaurant.cuisine?.trim() || null,
      },
      rating: parseInt(rating),
      text: text.trim(),
      imagePath,
      commentCount: 0,
      likeCount: 0,
    }) as any;

    await post.populate("userId", "username profileImagePath");

    res.status(201).json(post);
  } catch (error: any) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// PUT /api/posts/:id - Update a post
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {    
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Forbidden" });

    // Update text and rating if they exist
    if (req.body?.text) post.text = req.body.text;
    if (req.body?.rating) post.rating = Number(req.body.rating);

    // Parse and update the restaurant object safely
    if (req.body?.restaurant) {
      post.restaurant = typeof req.body.restaurant === 'string'
        ? JSON.parse(req.body.restaurant)
        : req.body.restaurant;
    }

    // Update the image path ONLY if a new file was uploaded
    if (req.file) {
      post.imagePath = req.file.path;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// DELETE /api/posts/:id - Delete a post
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid or missing authentication" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Verify ownership
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    // Delete image file
    if (post.imagePath) {
      const imagePath = path.join("public", post.imagePath);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    }

    await Post.deleteOne({ _id: postId });

    // TODO: צריך   למחוק גם comments ו-likes של ה-post הזה
    // await Comment.deleteMany({ postId });
    // await Like.deleteMany({ postId });
    // await Favorite.deleteMany({ postId });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// GET /api/posts/user/:userId - Get user's posts
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const posts = await Post.find({ userId })
      .populate("userId", "username profileImagePath")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Post.countDocuments({ userId });

    res.status(200).json({
      data: posts,
      pagination: {
        current: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    console.error("Get user posts error:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};