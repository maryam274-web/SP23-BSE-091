const express = require('express');
const router = express.Router();
let Product = require("../../models/product.model")
let Category = require("../../models/category.model");

router.get('/furniture/:page?', async (req, res) => {
  try {
    // Extract query parameters with defaults
    const category = req.query.category || ""; // Default to empty for "All Categories"
    const sort = req.query.sort || "";         // Default to no sorting

    console.log("Received query parameters:", req.query);

    // Build query for filtering
    let query = {};

    // Filtering by category (skip if "All Categories" is selected)
    if (category && category !== "") {
      const categoryDoc = await Category.findOne({ title: category });
      if (categoryDoc) {
        query.category = categoryDoc._id; // Apply category filter
      } else {
        console.log("No category found for name:", category);
      }
    } else {
      console.log("No specific category selected. Fetching all categories.");
    }

    // console.log("Final Query for Products:", query);

    // Sorting options
    let sortOptions = {};
    if (sort === 'price_low') sortOptions.price = 1; // Ascending
    if (sort === 'price_high') sortOptions.price = -1; // Descending
    // console.log("Sorting options:", sortOptions);

    // Pagination logic
    const page = req.params.page ? Number(req.params.page) : 1; // Default to page 1
    const pageSize = 8; // Products per page
    const skip = (page - 1) * pageSize;

    // Fetch total products count
    const totalProducts = await Product.countDocuments(query);

    // Fetch products with filtering, sorting, and pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // console.log("Fetched Products:", products.length);

    // Fetch categories for dropdown
    const categories = await Category.find();

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Render the furniture page
    res.render('furniture', {
      products,
      categories,
      page,
      totalPages,
      currentCategory: category,
      currentSort: sort,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});



  
  
  module.exports = router;