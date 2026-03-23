import { Request, Response } from "express";
import User from "../models/userModel";
import RefreshToken from "../models/refreshTokenModel";
import { generateAccessToken, generateRefreshToken, saveRefreshToken, verifyRefreshToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client();
export const googleSignin = async (req: Request, res: Response) => {
  try {
    const idToken = req.body.credential;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const email = payload?.email;

    if (email !== null) {
      const user = await User.findOne({ email });
      if (!user) {
        let user = await User.create({
          email,
          username: payload?.name,
          password: "",
          provider: "google",
          profileImageUrl: payload?.picture,
        });

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        await saveRefreshToken(user._id.toString(), refreshToken);

        res.status(201).json({ _id: user._id, username: user.username, email, profileImageUrl: user.profileImageUrl, accessToken, refreshToken });
      } else {
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        await saveRefreshToken(user._id.toString(), refreshToken);

        res.status(201).json({ _id: user._id, username: user.username, email, profileImageUrl: user.profileImageUrl, accessToken, refreshToken });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ error: "invalid token - " + error.message });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const user = await User.create({
      username,
      email,
      password: hash,
      provider: "local",
      profileImageUrl
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await saveRefreshToken(user._id.toString(), refreshToken);

    res.status(201).json({
      _id: user._id,
      username,
      email,
      profileImageUrl,
      accessToken,
      refreshToken
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password)
    return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  await saveRefreshToken(user._id.toString(), refreshToken);

  res.status(201).json({ _id: user._id, username: user.username, email, profileImageUrl: user.profileImageUrl, accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const saved = await RefreshToken.findOne({ token });
    if (!saved) return res.status(401).json({ error: "Invalid refresh token" });

    const payload: any = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);
    await RefreshToken.deleteOne({ token });
    await saveRefreshToken(payload.userId, newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: "Token expired or invalid" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { token } = req.body;
  await RefreshToken.deleteOne({ token });
  res.json({ message: "Logged out" });
}


