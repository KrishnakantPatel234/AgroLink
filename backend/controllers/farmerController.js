import FarmerPost from "../models/FarmerPost.js";

export const createPost = async (req, res) => {
  try {
    const post = new FarmerPost({
      ...req.body,
      image: req.file?.path
    });
    await post.save();

    res.json({ message: "Post Created", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
