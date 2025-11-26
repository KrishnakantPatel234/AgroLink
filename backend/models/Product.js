import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming your farmer users are in "User" collection
      required: true,
    },
    name: {
      type: String,
      required: true, // e.g. "Wheat", "Soyabean"
      trim: true,
    },
    category: {
      type: String, // e.g. "Grain", "Vegetable", "Fruit"
      required: true,
      trim: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["kg", "quintal", "litre", "piece"],
      default: "kg",
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      village: String,
      district: String,
      state: String,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String, // for now single image URL, can extend later
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
