import { Router } from "express";
import {
  likePost,
  unlikePost,
  getLikesByPost,
} from "../controllers/likeController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/:postId", authenticate, getLikesByPost);
router.post("/", authenticate, likePost);
router.delete("/", authenticate, unlikePost);

export default router;
