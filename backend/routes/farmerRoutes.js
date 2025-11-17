import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  getFarmerData
} from "../controllers/farmerController.js";

const router = express.Router();

/********* POST ROUTES *********/
router.post("/post", upload.single("cropImage"), createPost);

/********* GET ALL POSTS *********/
router.get("/all", getAllPosts);

/********* GET SPECIFIC POST *********/
router.get("/post/:id", getPostById);

/********* GET FARMER DASHBOARD DATA *********/
router.get("/profile/:userId", getFarmerData);

export default router;
