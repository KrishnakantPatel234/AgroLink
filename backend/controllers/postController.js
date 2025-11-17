import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { farmerId, cropName, quantity, price, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required" });
    }

    const newPost = await Post.create({
      farmerId,
      cropName,
      quantity,
      price,
      location,
      image: req.file.path
    });

    return res.json({
      success: true,
      message: "Post created successfully",
      post: newPost
    });

  } catch (err) {
    console.log("🔥 CREATE POST ERROR:", err);
    return res.status(500).json({ error: "Failed to create post" });
  }
};
