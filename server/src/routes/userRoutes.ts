import express from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.get("/profile", authenticate, userController.getUserProfile);
router.get("/:id", userController.getUserById);
router.put("/profile", authenticate, upload.single("profileImage"), userController.updateProfile);

export default router;