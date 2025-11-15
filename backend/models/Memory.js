import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Memory", memorySchema);
