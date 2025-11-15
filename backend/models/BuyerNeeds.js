import mongoose from "mongoose";

const needsSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  commodity: String,
  quantity: Number,
  frequency: String
}, { timestamps: true });

export default mongoose.model("BuyerNeeds", needsSchema);
