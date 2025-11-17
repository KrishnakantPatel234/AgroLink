import express from "express";
import { createPost } from "../controllers/postController.js";
import { uploadPostImage } from "../middleware/uploadPost.js";

const router = express.Router();

// FINAL ENDPOINT → POST /api/post/create
router.post("/create", uploadPostImage.single("image"), createPost);

export default router;
