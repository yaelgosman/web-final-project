import { Router } from "express";
import {
  likePost,
  unlikePost,
  getLikesByPost,
} from "../controllers/likeController";
import { authenticate, optionalAuthenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/:postId", optionalAuthenticate, getLikesByPost);
router.post("/", authenticate, likePost);
router.delete("/", authenticate, unlikePost);

export default router;
