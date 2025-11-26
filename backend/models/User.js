import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: false, // added after OTP verification
    },

    role: {
      type: String,
      enum: ["farmer", "buyer"],
      default: null,
    },

    name: String,
    profileImage: String,

    // Farmer-specific fields
    landSize: String,
    isOrganic: { type: Boolean, default: false },

    // Buyer-specific fields
    businessType: String,
    isBulkBuyer: { type: Boolean, default: false },


    rating: {
      type: Number,
      default: 4.5,
    },
  },
  { timestamps: true }
);

// 🧂 Hash password automatically
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare password for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};  

export default mongoose.model("User", UserSchema);
