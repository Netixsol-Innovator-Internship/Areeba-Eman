require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Import routes
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

// Import Swagger documentation
const swaggerSetup = require("./docs/swagger")

const app = express()

// Connect to MongoDB
connectDB()

// CORS configuration — allow frontend origin(s)
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://areeba-week3-day2-backend.vercel.app',
  'https://areeba-week3day3-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin' + origin));
    }
  },
  credentials: true
}));

// Middleware
// app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Task Manager API is running!",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/users", authRoutes)
app.use("/api/tasks", taskRoutes)

// Swagger Documentation
swaggerSetup(app)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error)

  res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
})

module.exports = app
