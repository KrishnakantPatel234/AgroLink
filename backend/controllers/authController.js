import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      phone,
      password,
      name,
      role,
      landSize,
      isOrganic,
      businessType,
      isBulkBuyer,
    } = req.body;

    if (!phone || !password || !name || !role) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists. Please login." });
    }

    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path;
    }

    const newUser = await User.create({
      phone,
      password,
      name,
      role,
      profileImage,
      landSize: role === "farmer" ? landSize : undefined,
      isOrganic: role === "farmer" ? isOrganic === "true" : undefined,
      businessType: role === "buyer" ? businessType : undefined,
      isBulkBuyer: role === "buyer" ? isBulkBuyer === "true" : undefined,
    });

    // ⚠️ Make sure password hash ho raha hai (User model me pre-save hook se)
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      _id: newUser._id,
      name: newUser.name,
      role: newUser.role,
      token,
      user: newUser,
    });

  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error during registration" });
  }
};

// 🔹 LOGIN USER
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res.status(400).json({ success: false, error: "Phone & password required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      _id: user._id,
      name: user.name,
      role: user.role,
      token,
      user,
    });
  } catch (err) {
    console.log("🔥 LOGIN ERROR:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

// 🔹 UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, role, landSize, isOrganic, businessType, isBulkBuyer } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    if (name) user.name = name;
    if (role) user.role = role;
    if (req.file) user.profileImage = req.file.path;

    if (role === "farmer") {
      user.landSize = landSize || user.landSize;
      user.isOrganic = isOrganic === "true" || isOrganic === true;
    }

    if (role === "buyer") {
      user.businessType = businessType || user.businessType;
      user.isBulkBuyer = isBulkBuyer === "true" || isBulkBuyer === true;
    }

    await user.save();
    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    console.log("🔥 UPDATE PROFILE ERROR:", err);
    res.status(500).json({ success: false, error: "Profile update failed" });
  }
};

// 🔹 GET PROFILE BY ID
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.log("🔥 GET PROFILE ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to load profile" });
  }
};
