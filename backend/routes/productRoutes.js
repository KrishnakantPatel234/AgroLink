import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js"; // your auth middleware

const router = express.Router();

/**
 * POST /api/products
 * Farmer adds new product
 */
router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      category,
      pricePerUnit,
      unit,
      quantityAvailable,
      location,
      description,
      imageUrl,
    } = req.body;

    // optional: check user type == farmer
    // if (req.user.role !== "farmer") return res.status(403).json({ message: "Only farmers can add products" });

    const product = await Product.create({
      farmer: req.user._id,
      name,
      category,
      pricePerUnit,
      unit,
      quantityAvailable,
      location,
      description,
      imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/products
 * Public marketplace with filters
 * Query params: search, category, district, minPrice, maxPrice
 */
router.get("/", async (req, res) => {
  try {
    const { search, category, district, minPrice, maxPrice } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (district) {
      filter["location.district"] = { $regex: district, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("farmer", "name phone") // adjust fields based on your User model
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/products/:id
 * Product detail page
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "name phone"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
