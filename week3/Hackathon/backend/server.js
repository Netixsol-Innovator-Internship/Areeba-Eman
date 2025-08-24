import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

// NEW: ensure super admin (no seeder)
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// adding cors
// ✅ CORS Setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://areeba-week3-hackathon-frontend.vercel.app",
  "https://areeba-week-3-hackathon-backend.vercel.app"
];
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

// Errors
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const createSuperAdmin = async () => {
  try {
    const superAdminEmail = 'superadmin@example.com';
    const existingSuperAdmin = await User.findOne({ email: superAdminEmail });

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash('superpassword', 10);

      await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'superAdmin',
      });

      console.log('✅ Super Admin created:', superAdminEmail);
    } else {
      console.log('✅ Super Admin already exists:', superAdminEmail);
    }
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
  }
};

// ensure predefined superAdmin exists (runs at startup)
const ensureSuperAdmin = async () => {
  const email = process.env.SUPERADMIN_EMAIL || "super@teaapp.com";
  const password = process.env.SUPERADMIN_PASSWORD || "SuperTea@123";
  const name = process.env.SUPERADMIN_NAME || "Tea SuperAdmin";

  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role: "superAdmin" });
    console.log("✅ Created predefined superAdmin:", email);
  } else if (user.role !== "superAdmin") {
    user.role = "superAdmin";
    await user.save();
    console.log("✅ Elevated existing user to superAdmin:", email);
  } else {
    console.log("ℹ️ SuperAdmin already exists:", email);
  }
};

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      // add any options you prefer
    });
    console.log("✅ MongoDB connected");

    await ensureSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Mongo/Server error:", err?.message);
    process.exit(1);
  }
}
start();
app.use("/uploads", express.static("uploads"));

createSuperAdmin();
export default app;
