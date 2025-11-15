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
