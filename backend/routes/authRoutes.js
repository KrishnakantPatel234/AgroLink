import express from "express";
import { sendOTP, verifyOTP, updateUserProfile } from "../controllers/authController.js";
import { uploadProfile } from "../middleware/uploadProfile.js";
import { login } from "../controllers/authController.js";


const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/update-profile", uploadProfile.single("profileImage"), updateUserProfile);

export default router;
