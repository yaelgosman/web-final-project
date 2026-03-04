import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
} from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/:postId", getCommentsByPost);
router.post("/", authenticate, createComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
