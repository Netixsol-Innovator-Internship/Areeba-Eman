// import Product from "../models/productModel.js";
import Product from "../models/Product.js";

import { errors, success } from "../utils/responses.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      ingredients,
      caffeine,
      organic,
      attributes,
      variants,
      stock
    } = req.body;

    // Parse JSON fields (since they come as strings from form-data)
    const parsedIngredients = JSON.parse(ingredients);
    const parsedAttributes = JSON.parse(attributes);
    const parsedVariants = JSON.parse(variants);

    // Get uploaded image filenames
    const imageFiles = req.files.map(file => file.filename);

    const newProduct = new Product({
      name,
      slug,
      description,
      ingredients: parsedIngredients,
      caffeine,
      organic: organic === "true",
      attributes: parsedAttributes,
      variants: parsedVariants,
      images: imageFiles,
      stock
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $facet: {
          data: [{ $match: {} }],
          count: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      message: success.PRODUCTS_RETRIEVED,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Product by ID
export const getProductByID = async (req, res) => {
  try {
    let { id } = req.params;

    let product = await Product.findById(id);

    if (product) {
      return res.status(200).json({
        success: true,
        data: product,
        message: success.PRODUCT_RETRIEVED,
      });
    }
    return res.status(400).json({
      success: false,
      data: null,
      message: errors.INVALID_PRODUCT_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Product by Slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug: slug.toLowerCase() });

    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Invalid product slug",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: success.PRODUCT_RETRIEVED || "Product retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update Product (Role-Based Field Control)
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role; // coming from protect middleware
    let data = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => file.path);
    }

    // Role-based restrictions
    if (userRole === "admin") {
      // Admin can only update name & price
      const { name, price } = data;
      if (name) product.name = name;
      if (price) product.price = price;
    } else if (userRole === "superAdmin") {
      // SuperAdmin can update everything
      Object.keys(data).forEach((key) => {
        product[key] = data[key];
      });
    } else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Product (Only SuperAdmin)
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== "superAdmin") {
      return res.status(403).json({ success: false, message: "Only superAdmin can delete products" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete All Products (SuperAdmin only)
export const deleteAllProducts = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "superAdmin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Product.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All products deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//try
// ✅ Extra (Collections, Filters) - placeholders if you need them
// export const getCollections = async (req, res) => {
//   try {
//     const collections = await Product.distinct("attributes.collections");
//     res.status(200).json({ success: true, collections });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const getAvailableFilterOptions = async (req, res) => {
  try {
    const attributes = await Product.aggregate([
      {
        $project: {
          attributes: { $objectToArray: "$attributes" },
        },
      },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.v" },
      {
        $group: {
          _id: "$attributes.k",
          values: { $addToSet: "$attributes.v" },
        },
      },
    ]);

    const caffeineLevels = await Product.distinct("caffeine");
    const organicValues = await Product.distinct("organic");

    res.json({ attributes, caffeineLevels, organicValues });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getFilteredProductsByOption = async (req, res) => {
  try {
    let filteredQuery = req.query;
    let query = {};

    if (filteredQuery.caffeine) {
      query.caffeine = filteredQuery.caffeine;
    }
    if (filteredQuery.organic) {
      query.organic = filteredQuery.organic == "true";
    }

    const attributes = [
      "collections",
      "origin",
      "flavor",
      "qualities",
      "allergies",
    ];
    attributes.forEach((key) => {
      if (filteredQuery[key]) {
        query[`attributes.${key}`] = filteredQuery[key];
      }
    });

    const products = await Product.find(query);

    if (products.length > 0) {
      return res.status(200).json({
        success: true,
        data: products,
        message: "Products retrieved successfully ✅",
      });
    }

    return res.status(404).json({
      success: false,
      data: null,
      message: "No products found ❌",
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getCollections = async (req, res) => {
  try {
    const collections = await Product.aggregate([
      {
        $unwind: "$attributes.collections" // break array into separate docs
      },
      {
        $group: {
          _id: "$attributes.collections", // group by collection name
          productId: { $first: "$_id" },  // pick first product
          name: { $first: "$name" },      // pick first product name
          image: { $first: { $arrayElemAt: ["$images", 0] } } // pick first image
        }
      },
      {
        $project: {
          _id: 0,
          collection: "$_id",
          productId: 1,
          name: 1,
          image: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
      error: error.message
    });
  }
};







// extraaaaaaaaaaaaaaa
// ✅ Get All Collections
// export const getCollections = async (req, res) => {
//   try {
//     const collections = await Product.distinct("collection"); // or your actual logic
//     res.json({ success: true, collections });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// ✅ Get Products by Collection
export const getProductsByCollection = async (req, res) => {
  try {
    const { collectionName } = req.params;

    if (!collectionName) {
      return res.status(400).json({ success: false, message: "Collection name is required" });
    }

    const products = await Product.find({ "attributes.collections": collectionName });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this collection" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};