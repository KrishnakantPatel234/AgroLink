import express from "express";
import { register, updateUserProfile , login , getProfile} from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register" , upload.single("profileImage"), register);
router.post("/login", login);
router.post(
    "/update-profile",
    protect, 
    upload  .single("profileImage"), 
    updateUserProfile
);
router.get("/profile/:id", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
