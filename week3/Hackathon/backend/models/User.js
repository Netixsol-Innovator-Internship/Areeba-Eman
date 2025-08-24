import mongoose from "mongoose";
import Cart from "./Cart.js";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // NEW
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
      index: true,
    },
    // NEW
    isBlocked: { type: Boolean, default: false },

    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  },
  { timestamps: true }
);

// Keep your existing behavior: auto-create empty cart
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const cart = await Cart.create({ user: this._id, products: [] });
    this.cart = cart._id;
  }
  next();
});

export default mongoose.model("User", userSchema);
