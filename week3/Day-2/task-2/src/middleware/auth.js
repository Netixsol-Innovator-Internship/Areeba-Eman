const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Token is not valid. User not found.",
      })
    }

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error.message)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token.",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expired.",
      })
    }

    res.status(500).json({
      status: "error",
      message: "Server error in authentication.",
    })
  }
}

module.exports = auth
