import express from "express";
import { upload } from "../middleware/upload.js";
// import {
//   createPost,
//   getAllPosts,
//   getPostById,
//   getFarmerData,
//   getTopFarmers
// } from "../controllers/farmerController.js";
import { getProfile } from "../controllers/authController.js";
import { protect, isFarmer } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get("/all", getAllPosts);
// router.get("/top", getTopFarmers);

// router.post("/post", upload.single("cropImage"), createPost);
// router.get("/post/:id", getPostById);

router.get("/profile/:id", protect, getProfile);



export default router;
