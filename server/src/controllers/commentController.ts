import { Request, Response } from "express";
import Comment from "../models/commentModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createComment = async (req: AuthRequest, res: Response) => {
  const { postId, text } = req.body;
  const comment = await Comment.create({ postId, userId: req.userId, text });
  
  const populatedComment = await Comment.findById(comment._id).populate(
    "userId",
    "username profileImageUrl"
  );
  res.json(populatedComment);
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).populate(
    "userId",
    "username profileImageUrl"
  );
  res.json(comments);
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  if (comment.userId.toString() !== req.userId)
    return res.status(403).json({ error: "Forbidden" });

  comment.text = text;
  await comment.save();

  // Populate before returning so the edited comment still has the user details
  const populatedComment = await Comment.findById(comment._id).populate(
    "userId",
    "username profileImageUrl"
  );
  res.json(populatedComment);
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
