import express from "express";
import { sendOTP, verifyOTP, updateUserProfile } from "../controllers/authController.js";
import { uploadProfile } from "../middleware/uploadProfile.js";   // ⭐ ADD THIS

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// ⭐ FIX: Apply multer here
router.post("/update-profile", uploadProfile.single("profileImage"), updateUserProfile);

export default router;
