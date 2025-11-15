import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, required: true }, // farmer or buyer
  phone: { type: String, required: true },
  email: String,
  name: { type: String, required: true },
  profilePic: String,
  location: String,

  // Farmer fields
  landSize: { type: String, required: true },
  organicCertified: Boolean,

  // Buyer fields
  businessType: { type: String, required: true },
  needs: String,
  bulkBuyer: Boolean,

  rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },

  languagesPreferred: [String],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
