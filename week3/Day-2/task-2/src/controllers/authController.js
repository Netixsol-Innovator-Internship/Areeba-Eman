const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  })
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Will be hashed by the pre-save middleware
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    })
  } catch (error) {
    console.error("Register error:", error)

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      })
    }

    res.status(500).json({
      status: "error",
      message: "Server error during registration",
    })
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    res.status(500).json({
      status: "error",
      message: "Server error during login",
    })
  }
}

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = req.user // Set by auth middleware

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)

    res.status(500).json({
      status: "error",
      message: "Server error getting user profile",
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
}
