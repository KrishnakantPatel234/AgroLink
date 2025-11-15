import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  audioURL: String,
  duration: Number
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
