import { Request, Response } from "express";
import Comment from "../models/comment.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createComment = async (req: AuthRequest, res: Response) => {
  const { postId, text } = req.body;
  const comment = await Comment.create({ postId, userId: req.userId, text });
  res.json(comment);
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).populate(
    "userId",
    "username profileImage"
  );
  res.json(comments);
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  if (comment.userId.toString() !== req.userId)
    return res.status(403).json({ error: "Forbidden" });

  await Comment.deleteOne({ _id: id });
  res.json({ message: "Deleted" });
};
