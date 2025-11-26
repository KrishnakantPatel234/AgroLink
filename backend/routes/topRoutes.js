// backend/routes/topRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Top farmers (public)
router.get("/farmers/top", async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .select("name profileImage isOrganic location")
      .limit(6); // top 6, frontend me 3 dikha rahe ho

    res.json({ success: true, farmers });
  } catch (err) {
    console.error("Top farmers error:", err);
    res.status(500).json({ success: false, error: "Failed to load farmers" });
  }
});

// 🔹 Top buyers (public)
router.get("/buyers/top", async (req, res) => {
  try {
    const buyers = await User.find({ role: "buyer" })
      .select("name profileImage businessType isBulkBuyer")
      .limit(6);

    res.json({ success: true, buyers });
  } catch (err) {
    console.error("Top buyers error:", err);
    res.status(500).json({ success: false, error: "Failed to load buyers" });
  }
});

export default router;
