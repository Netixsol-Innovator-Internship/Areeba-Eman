import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User";
import dotenv from "dotenv";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("SuperAdmin123", 10);

    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "superadmin"
    });

    console.log("✅ Super Admin created:", superAdmin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding super admin:", err);
    process.exit(1);
  }
};

seedSuperAdmin();
