import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },

  role: { 
    type: String, 
    enum: ["farmer", "buyer"],
    default : null
    // required: true 
  },

  name: String,
  profileImage: String,

  // Farmer-specific
  landSize: String,
  isOrganic: { type: Boolean, default: false },

  // Buyer-specific
  businessType: String,
  isBulkBuyer: { type: Boolean, default: false },
  otp: { type: String, default: null },


}, { timestamps: true });

export default mongoose.model("User", UserSchema);
