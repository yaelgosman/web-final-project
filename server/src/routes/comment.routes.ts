import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
} from "../controllers/comment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:postId", getCommentsByPost);
router.post("/", authenticate, createComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
