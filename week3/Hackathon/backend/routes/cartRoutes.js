import express from "express";
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  getUserCartProducts,
  increaseQuantity,
  removeItemFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const cartRoutes = express.Router();

// Add to cart
cartRoutes.post("/", protect, addToCart);

// Getting all Cart products
cartRoutes.get("/", protect, getUserCartProducts);

// Increase Quantity
cartRoutes.patch("/increase/:cartItemId", protect, increaseQuantity);

// Decrease Quantity
cartRoutes.patch("/decrease/:cartItemId", protect, decreaseQuantity);

// Remove Item from Cart
cartRoutes.delete("/:cartItemId", protect, removeItemFromCart);

// Clear Cart
cartRoutes.delete("/", protect, clearCart);

export default cartRoutes;
