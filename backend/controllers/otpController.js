import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);



// SEND OTP USING TWILIO
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ error: "Phone required" });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    // Delete old OTPs for this phone
    await Otp.deleteMany({ phone });

    // Save new OTP
    await Otp.create({
      phone,
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // SEND OTP VIA TWILIO SMS
    await client.messages.create({
      body: `Your BharatKrishi OTP is: ${otp}`,
      from: process.env.TWILIO_NUMBER,
      to: phone
    });

    res.json({ message: "OTP sent via Twilio successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const otpRecord = await Otp.findOne({ phone });
    if (!otpRecord) return res.status(400).json({ error: "OTP not found" });

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otp);
    if (!isMatch) return res.status(400).json({ error: "Invalid OTP" });

    // OTP valid → remove otp entry
    await Otp.deleteMany({ phone });

    // Check if user exists
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        role: "",
        name: "",
        location: "",
        profilePic: ""
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ message: "OTP verified successfully", token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

