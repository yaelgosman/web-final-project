import { Request, Response } from "express";
import User from "../models/userModel";
import RefreshToken from "../models/refreshTokenModel";
import { generateAccessToken, generateRefreshToken, saveRefreshToken, verifyRefreshToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client();
export const googleSignin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "No credential provided" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(401).json({ error: "Invalid token - no email" });
    }

    const email = payload.email;
    const picture = payload.picture || null;
    const name = payload.name || email.split("@")[0];
    const googleId = payload.sub;

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user from Google
      user = await User.create({
        username: name || email.split("@")[0],
        email: email.toLowerCase(),
        password: "", // Google users don't have password
        profileImagePath: picture,
        provider: "google",
      });
    } else {
      // Check if user has same provider
      if (user.provider && user.provider !== "google" && user.provider !== "local") {
        return res.status(400).json({
          error: "User exists with different login method",
        });
      }
      // Update provider if local user
      if (user.provider === "local") {
        user.provider = "google";
        if (!user.profileImagePath && picture) {
          user.profileImagePath = picture;
        }
        await user.save();
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await saveRefreshToken(user._id.toString(), refreshToken);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      profileImagePath: user.profileImagePath,
      provider: user.provider,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("Google signin error:", error);
    res.status(400).json({ error: "Google authentication failed" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //TODO: add validation for email and password

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hash,
      provider: "local",
      profileImagePath: null,
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await saveRefreshToken(user._id.toString(), refreshToken);

    res.status(201).json({ _id: user._id, email, profileImagePath: user.profileImagePath, accessToken, refreshToken });
  }
  catch (error: any) {
    console.error("Register error:", error);
    res.status(400).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });


    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await saveRefreshToken(user._id.toString(), refreshToken);

    res.status(201).json({ _id: user._id, username: user.username, email, profileImagePath: user.profileImagePath, accessToken, refreshToken });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Login failed" });
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: "No refresh token provided" });


    // verify token exists in DB
    const saved = await RefreshToken.findOne({ token });
    if (!saved) return res.status(401).json({ error: "Invalid refresh token" });

    if (new Date() > saved.expiresAt) {
      await RefreshToken.deleteOne({ token });
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // verify JWT
    try {
      verifyRefreshToken(token);
    } catch (err) {
      res.status(401).json({ error: "Token invalid" });
    }

    const newAccessToken = generateAccessToken(saved.userId.toString());
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    // Delete token from DB
    const deleted = await RefreshToken.deleteOne({ token });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "Token not found" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

