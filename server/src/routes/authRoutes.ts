import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  googleSignin,
} from "../controllers/authController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/google", googleSignin);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
