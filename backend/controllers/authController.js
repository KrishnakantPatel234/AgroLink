import axios from "axios";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ error: "Phone required" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // TEMP Save OTP in DB or Cache
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    user.otp = otp;
    await user.save();

    // SEND SMS
    const apiRes = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        sender_id: "FSTSMS",
        message: `Your OTP is ${otp}`,
        language: "english",
        route: "q",
        numbers: phone,
      },
      {
        headers: {
          "authorization": process.env.FAST2SMS_API_KEY,
        },
      }
    );

    res.json({ success: true, phone });

  } catch (err) {
    console.log("OTP ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "OTP send failed" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP correct → clear it
    user.otp = null;
    await user.save();

    res.json({ success: true, userId: user._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, role, name } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId missing" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.role = role || user.role;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    // Handle profile image
    if (req.file) {
      user.profileImage = req.file.path;
    }

    // If FARMER
    if (role === "farmer") {
      user.landSize = req.body.landSize || user.landSize;
      user.isOrganic = req.body.isOrganic === "true";
    }

    // If BUYER
    if (role === "buyer") {
      user.businessType = req.body.businessType || user.businessType;
      user.isBulkBuyer = req.body.isBulkBuyer === "true";
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
    console.log("🔥 req.body:", req.body);
    console.log("🔥 req.file:", req.file);
  } catch (err) {
    console.log("🔥 PROFILE UPDATE ERROR:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        error: "User not found. Please register first."
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    return res.json({
      success: true,
      message: "Login successful",
      userId: user._id,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};