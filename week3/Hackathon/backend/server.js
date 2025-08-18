import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" with { type: "json" };

const app = express();

// const cors = require("cors");
// app.use(cors({
//   origin: [
//     "http://localhost:5173", // local dev
//     "https://areeba-week3-hackathon-frontend.vercel.app" // deployed frontend
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));



const allowedOrigins = [
  'http://localhost:5173',
  'https://areeba-week3-hackathon-frontend.vercel.app'
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

// app.use(cors({
//   origin: "*",
//   credentials: true
// }));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)


// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app