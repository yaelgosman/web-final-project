import { Request, Response } from "express";
import User from "../models/userModel"; // Make sure import is correct
import { AuthRequest } from "../middlewares/authMiddleware"; // Correct type
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

/**
 * GET /api/users/profile - Get current logged-in user's profile
 * Requires: Authorization header with JWT token
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid or missing authentication" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * GET /api/users/:id - Get public user profile by ID
 * Doesn't require authentication - anyone can view
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        error: "Invalid user ID format",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * PUT /api/users/profile - Update user profile
 * Requires: Authorization header with JWT token
 * Can update: username, profileImagePath
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; 

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid or missing authentication" });
    }

    const { username } = req.body;
    const imageFile = req.file; // From multer

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update username if provided
    if (username) {
      // Check if username is already taken (by another user)
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }, // Exclude current user
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }

      user.username = username;
    }

    // Update image if file was uploaded
    if (imageFile) {
      // Delete old image if exists
      if (user.profileImagePath) {
        const oldPath = path.join("public", user.profileImagePath);
        try {
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }

      // Set new image path
      user.profileImagePath = `/uploads/${imageFile.filename}`;
    }

    await user.save();

    // ✅ Return updated user with correct field names
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImagePath: user.profileImagePath,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error: any) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};