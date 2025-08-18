import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { success, errors } from "../utils/responses.js";
import Cart from "../models/Cart.js";

// Helper to create JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: errors.USER_EXISTS });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
   

      //   sending response
      res.status(201).json({
        success: true,
        message: success.USER_REGISTERED,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          cart:user.cart,
          token: generateToken(user.id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: errors.SERVER_ERROR });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        message: success.USER_LOGGED_IN,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: errors.INVALID_CREDENTIALS });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json({
        success: true,
        message: success.PROFILE_RETRIEVED,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: errors.USER_NOT_FOUND });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: errors.SERVER_ERROR });
  }
};

// delete /api/auth/profile
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: success.ACCOUNT_DELETED });
  } catch (error) {
    res.status(500).json({ success: false, message: error.SERVER_ERROR });
  }
};
