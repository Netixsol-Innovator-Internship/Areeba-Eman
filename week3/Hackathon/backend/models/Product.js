import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    caffeine: {
      type: String,
      enum: ["Low Caffeine", "High Caffeine", "Medium Caffeine", "No Caffeine"],
    },
    organic: { type: Boolean, default: false },
    attributes: {
      type: Map,
      of: [String],
    },

    steepingInstructions: {
      servingSize: { type: [String] },
      temperature: { type: [String] },
      time: { type: [String] },
      colorNote: { type: [String] },
    },
    variants: [
      {
        weight: { type: String, required: true },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    ingredients: {
      type: [String],
    },
    images: { type: [String], required: true },
    stock: { type: Number, default: 0, min: [0, "Stock cannot be negative"] },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
