// app.js
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const todoRoutes = require("./routes/todo"); // if you already have this
app.use("/todos", todoRoutes);

module.exports = app;
