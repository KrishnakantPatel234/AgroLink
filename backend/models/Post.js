import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  cropName: {
    type: String,
    required: true,
  },

  quantity: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true, // multer path
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Post", PostSchema);
