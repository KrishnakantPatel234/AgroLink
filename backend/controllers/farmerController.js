import Product from "../models/Product.js";
import User from "../models/User.js";


export const createPost = async (req, res) => {
  try {
    const farmerId = req.body.farmerId; // you will use JWT later
    const user = await User.findById(farmerId);

    if (!user || user.role !== "farmer") {
      return res.status(400).json({ error: "Invalid farmer" });
    }

    const {
      title,
      cropName,
      quantity,
      unit,
      price,
      location,
      description
    } = req.body;

    const cropImage = req.file ? req.file.path : null;

    const post = await FarmerPost.create({
      farmerId,
      title,
      cropName,
      quantity,
      unit,
      price,
      location,
      description,
      cropImage,
      organic: user.isOrganic
    });

    res.json({ success: true, post });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFarmerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== "farmer") {
      return res
        .status(404)
        .json({ success: false, error: "Farmer not found" });
    }

    // saare products/posts jo is farmer ne banaye
    const posts = await Product.find({ farmer: id })
      .sort({ createdAt: -1 }) // latest on top
      .lean();

    return res.json({
      success: true,
      user,
      posts,
    });
  } catch (err) {
    console.error("🔥 getFarmerProfile error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to load farmer profile" });
  }
};

// export const getAllPosts = async (req, res) => {
//   try {
//     const { crop, location, organic, search } = req.query;

//     let query = {};

//     if (crop) query.cropName = new RegExp(crop, "i");
//     if (location) query.location = new RegExp(location, "i");
//     if (organic === "true") query.organic = true;

//     if (search) {
//       query.$or = [
//         { cropName: new RegExp(search, "i") },
//         { location: new RegExp(search, "i") },
//         { title: new RegExp(search, "i") }
//       ];
//     }

//     const posts = await FarmerPost.find(query)
//       .populate("farmerId", "name profileImage isOrganic");

//     res.json(posts);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getPostById = async (req, res) => {
  try {
    const post = await FarmerPost.findById(req.params.id)
      .populate("farmerId", "name profileImage isOrganic landSize");

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFarmerData = async (req, res) => {
  try {
    const { userId } = req.params;

    const farmer = await User.findById(userId);
    const posts = await Post.find({ farmerId: userId }).sort({ createdAt: -1 });

    res.json({ farmer, posts });
  } catch (err) {
    res.status(500).json({ error: "Failed to load farmer data" });
  }
};

export const getTopFarmers = async (req, res) => {
  try {
    const topFarmers = await User.find({ role: "farmer" })
      .sort({ ratings: -1 })
      .limit(5);

    res.json(topFarmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

