import express from "express";
import {
  createProduct,
  deleteAllProducts,
  deleteProductById,
  getAllProducts,
  getAvailableFilterOptions,
  getCollections,
  getFilteredProductsByOption,
  getProductByID,
  getProductBySlug,
  updateProductById,
} from "../controllers/productController.js";

import { upload } from "../multer/multer.js";
import { validateID, validateProduct, validateSlug } from "../validators/productValidator.js";
import { validate } from "../middlewares/productValidate.js";
const productRoutes = express.Router();



// Create a new Product
productRoutes.post(
  "/",
  validateProduct,
  validate,
  upload.array("images", 5),
  createProduct
);

// Get all Products
productRoutes.get("/", getAllProducts);

// Get Collections
productRoutes.get('/collections',getCollections)

// Get Filter Options
productRoutes.get("/filters/options", getAvailableFilterOptions);

// Get Products by filtering the attributes
productRoutes.get("/filter/search", getFilteredProductsByOption);

// Get product by ID
productRoutes.get(
  "/:id",
  validateID,
  validate,
  getProductByID
);

// Get product by slug
productRoutes.get(
  "/slug/:slug",
  validateSlug,
  validate,
  getProductBySlug
);


// Delete All Products

productRoutes.delete("/", deleteAllProducts);

// Delete Product by id
productRoutes.delete(
  "/:id",
  validateID,
  validate,
  deleteProductById
);

// Update by id

productRoutes.put(
  "/",
  validateProduct,
  validate,
  upload.array("images", 5),
  updateProductById
);






export default productRoutes;
