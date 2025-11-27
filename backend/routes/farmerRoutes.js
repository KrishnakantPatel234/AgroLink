import express from "express";
import { getFarmerProfile } from "../controllers/farmerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile/:id", protect, getFarmerProfile);

export default router;
