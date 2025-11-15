import express from "express";
import upload from "../utils/upload.js";
import { createPost } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/post", upload.single("image"), createPost);

export default router;
