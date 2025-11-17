import User from "../models/User.js";
import BuyerNeeds from "../models/BuyerNeeds.js";

export const matchBuyers = async (req, res) => {
  const { commodity } = req.query;

  try {
    const buyers = await BuyerNeeds.find({ commodity })
      .populate("buyerId", "name profilePic location");

    res.json(buyers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTopBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ role: "buyer" })
      .sort({ rating: -1, createdAt: -1 })
      .select("name profileImage businessType isBulkBuyer rating");

    res.json(buyers);
  } catch (err) {
    res.status(500).json({ error: "Failed to load buyers" });
  }
};

