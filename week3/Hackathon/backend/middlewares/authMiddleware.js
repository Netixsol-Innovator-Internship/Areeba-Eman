import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errors } from "../utils/responses.js";
import User from "../models/User.js";

dotenv.config();

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: errors?.NO_TOKEN || "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: errors?.INVALID_TOKEN || "Invalid token" });
    }
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Your account is blocked. Contact support." });
    }
    req.user = user; // includes role
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: errors?.INVALID_TOKEN || "Invalid token" });
  }
};

export const authorizeRoles = (...allowed) => {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: insufficient role" });
    }
    next();
  };
};


// 

export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'superAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role === 'superAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Super Admins only' });
  }
};