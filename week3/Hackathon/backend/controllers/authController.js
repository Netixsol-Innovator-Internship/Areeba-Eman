import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { success, errors } from "../utils/responses.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: errors?.USER_ALREADY_EXISTS || "User already exists",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
      success: true,
      message: success?.USER_REGISTERED || "User registered",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: errors?.SERVER_ERROR || "Server error" });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({
          success: false,
          message: errors?.INVALID_CREDENTIALS || "Invalid credentials",
        });

    if (user.isBlocked)
      return res
        .status(403)
        .json({
          success: false,
          message: "Your account is blocked. Contact support.",
        });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(400)
        .json({
          success: false,
          message: errors?.INVALID_CREDENTIALS || "Invalid credentials",
        });

    res.json({
      success: true,
      message: success?.USER_LOGGED_IN || "Logged in",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: errors?.SERVER_ERROR || "Server error" });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

// DELETE /api/auth/profile
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({
      success: true,
      message: success?.ACCOUNT_DELETED || "Account deleted",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: errors?.SERVER_ERROR || "Server error" });
  }
};
