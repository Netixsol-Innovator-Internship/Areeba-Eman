import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  updateUserRole,
  toggleBlockUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "superAdmin"), getAllUsers);
router.patch("/:id/role", protect, authorizeRoles("admin", "superAdmin"), updateUserRole);
router.patch("/:id/block", protect, authorizeRoles("admin", "superAdmin"), toggleBlockUser);

export default router;