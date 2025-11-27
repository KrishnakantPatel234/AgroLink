import Product from "../models/Product.js";
import User from "../models/User.js";

export const createFarmerPost = async (req, res) => {
  try {
    const farmerId = req.user?._id;

    if (!farmerId) {
      return res
        .status(401)
        .json({ success: false, error: "Farmer not authenticated" });
    }

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.role !== "farmer") {
      return res
        .status(400)
        .json({ success: false, error: "Only farmers can create posts" });
    }

    const {
      cropName,
      quantity,
      price,
      location,
      description,
      title,
      unit
    } = req.body;

    if (!cropName || !quantity || !price) {
      return res.status(400).json({
        success: false,
        error: "cropName, quantity aur price required hain",
      });
    }

    const normalizedUnit = unit ? unit.toLowerCase() : "kg";
    
    const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const product = await Product.create({
      farmer: farmerId,
      name: cropName,
      title: title || cropName,
      category: "Crop",
      pricePerUnit: Number(price),
      unit: normalizedUnit,
      quantityAvailable: Number(quantity),
      location,
      description,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: product,
    });
  } catch (err) {
    console.error("🔥 createFarmerPost error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error while creating post",
    });
  }
};
