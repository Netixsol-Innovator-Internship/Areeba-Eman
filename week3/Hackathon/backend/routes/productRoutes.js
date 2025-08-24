import express from "express";
import {
  createProduct,
  deleteAllProducts,
  deleteProductById,
  getAllProducts,
  getAvailableFilterOptions,
  getCollections,
  getProductsByCollection,
  getFilteredProductsByOption,
  getProductByID,
  getProductBySlug,
  updateProductById,
} from "../controllers/productController.js";

import { upload } from "../multer/multer.js";
import {
  validateID,
  validateProduct,
  validateSlug,
} from "../validators/productValidator.js";
import { validate } from "../middlewares/productValidate.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const productRoutes = express.Router();

// Public reads
productRoutes.get("/", getAllProducts);
productRoutes.get("/collections", getCollections);
productRoutes.get("/collection/:collectionName", getProductsByCollection);
productRoutes.get("/filters/options", getAvailableFilterOptions);
productRoutes.get("/filters/search", getFilteredProductsByOption);
productRoutes.get("/slug/:slug", validateSlug, validate, getProductBySlug);
productRoutes.get("/:id", validateID, validate, getProductByID);

// Create (admin + superAdmin)
productRoutes.post(
  "/",
  protect,
  authorizeRoles("admin", "superAdmin"),
  upload.array("images", 5),
  // validateProduct,
  // validate,
  createProduct
);

// Update (admin + superAdmin)
// NOTE: validation on update is handled in controller (role-based field filtering)
productRoutes.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  upload.array("images", 5),
  updateProductById
);

// Delete (superAdmin only)
productRoutes.delete(
  "/:id",
  protect,
  authorizeRoles("superAdmin"),
  deleteProductById
);

// Optional (if you keep this admin utility): wipe all (superAdmin only)
productRoutes.delete(
  "/",
  protect,
  authorizeRoles("superAdmin"),
  deleteAllProducts
);

export default productRoutes;
