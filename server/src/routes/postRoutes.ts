import { Router } from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostsByUserId
} from "../controllers/postController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", getPosts);

router.get("/user/:userId", getPostsByUserId);
router.post("/", authenticate, upload.single("image"), createPost);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
