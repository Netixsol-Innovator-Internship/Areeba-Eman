import { body, param } from "express-validator";

export const validateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 5 })
    .withMessage("Product name at least of 5 characters")
    .isLength({ max: 30 })
    .withMessage("Product name must be less than 30 characters"),
  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .isLength({ min: 5 })
    .withMessage("Slug name at least of 5 characters")
    .isLength({ max: 30 })
    .withMessage("Slug name must be less than 30 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Product description at least of 10 characters")
    .isLength({ max: 200 })
    .withMessage("Product description must be less than 200 characters"),
  body("attributes").notEmpty().withMessage("Attributes are required"),
  body("images").notEmpty().withMessage("Image is required"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock value must be a positive integer"),
];

export const validateID = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
];

export const validateSlug = [
  param("slug").notEmpty().withMessage("Slug is required"),
];
