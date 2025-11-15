import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productName: {type : String , required : true},
  quantity: {type : String , required : true},
  unit: {type : String , required : true},
  price: {type : Number , required : true},
  location: String,
  description: {type : String , required : true , minlength : 30},
  image: String,
  organic: Boolean
}, { timestamps: true });

export default mongoose.model("FarmerPost", postSchema);
