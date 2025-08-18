import express from "express";
import { validateLogin, validateRegister } from "../middlewares/validateAuth.js";
import { deleteAccount, getProfile, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", validateRegister, registerUser)
authRoutes.post("/login", validateLogin, loginUser)

authRoutes.get("/profile", protect, getProfile)
authRoutes.delete("/profile", protect, deleteAccount)

export default authRoutes