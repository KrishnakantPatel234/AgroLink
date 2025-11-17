import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: { type: String, required: true },
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "KG" },

  price:  { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true , minlength : 20},

  cropImage: { type: String, required: true },

  organic: Boolean,

}, { timestamps: true });

export default mongoose.model("Post", PostSchema);
