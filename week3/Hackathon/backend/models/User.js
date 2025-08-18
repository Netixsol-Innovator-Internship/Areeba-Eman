import mongoose from "mongoose";
import Cart from "./Cart.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const cart = await Cart.create({ user: this._id, products: [] });

    cart.save();

    this.cart = cart._id;
  }
  next();
});

export default mongoose.model("User", userSchema);
