import { Router } from "express";
import { getProfile, updateProfile, getUserById } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, upload.single("profileImage"), updateProfile);

// handles dynamic ID requests. Here theres No 'authenticate' middleware, to allow anyone to view a profile
router.get("/:id", getUserById);

export default router;
