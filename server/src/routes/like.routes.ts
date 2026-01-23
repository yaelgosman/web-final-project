import { Router } from "express";
import {
  likePost,
  unlikePost,
  getLikesByPost,
} from "../controllers/like.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:postId", getLikesByPost);
router.post("/", authenticate, likePost);
router.delete("/", authenticate, unlikePost);

export default router;
