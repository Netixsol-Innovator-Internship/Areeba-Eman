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

const MONGO_URI='mongodb+srv://areebasajjad00:areebaemanhello@cluster0.uitxdku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// yeh env mn put kr ky process sy yahan pr lena ha

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// ✅ CORS Setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://areeba-week3-hackathon-frontend.vercel.app",
  "https://areeba-week-3-hackathon-backend.vercel.app"
];

// app.use(cors({}));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ MongoDB Connection
const mongoURI = MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// ✅ Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
