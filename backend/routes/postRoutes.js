import express from "express";
import { createFarmerPost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadPostMiddleware } from "../middleware/uploadPostMiddleware.js";

const router = express.Router();

// farmer post create: voice form se aa raha hai
router.post(
  "/create",
  protect,                   // token required
  uploadPostMiddleware.single("image"),    // "image" field from FormData
  createFarmerPost
);

export default router;
