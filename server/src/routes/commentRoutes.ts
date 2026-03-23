import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment
} from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/:postId", getCommentsByPost);
router.post("/", authenticate, createComment);
router.put("/:id", authenticate, updateComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
