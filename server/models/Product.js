import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sizes: {
    type: [String],
    default: [], // optional but helpful for defaults
  },
  colors: {
    type: [String],
    default: [],
  },
  imagesByColor: {
    type: Map,
    of: String,
    default: {},
  },
  category: {
    type: [String],
    enum: ["men", "women", "kids"],
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
