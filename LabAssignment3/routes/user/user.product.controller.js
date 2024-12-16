const express = require('express');
const router = express.Router();
let Product = require("../../models/product.model")
let Category = require("../../models/category.model");

router.get('/furniture/:page?', async (req, res) => {
    try {
      // Pagination logic
      let page = req.params.page ? Number(req.params.page) : 1; // Default to page 1 if not provided
      let pageSize = 8;
  
      // Count total products across all categories
      let totalRecords = await Product.countDocuments();
  
      let totalPages = Math.ceil(totalRecords / pageSize); // Calculate total pages
  
      // Fetch products for the current page across all categories
      const products = await Product.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize);
  
      // Render the view
      res.render('furniture', {
        products,          // List of products for the current page
        page,              // Current page number
        pageSize,          // Page size
        totalPages,        // Total number of pages
        totalRecords,      // Total number of products
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching products');
    }
  });



  router.get("/furniture/sort-lowtohigh", async(req, res) => {
    try {
        let page = req.query.page ? Number(req.query.page) : 1; // Get current page from query string or default to page 1
        let pageSize = 8;

        // Sort by price in ascending order
        let products = await Product.find()
            .sort({ price: 1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize); // Implement pagination

        // Get the total number of records to calculate totalPages
        let totalRecords = await Product.countDocuments();

        // Calculate total pages
        let totalPages = Math.ceil(totalRecords / pageSize);

        const stylesheets = ['/css/style.css', '/css/furniturestyle.css'];

        return res.render('furniture', {
            stylesheet: stylesheets,
            products,
            page, // Send the current page
            pageSize,
            totalPages,
            totalRecords,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
    }
});

router.get("/furniture/sort-hightolow", async(req, res) => {
    try {
        let page = req.query.page ? Number(req.query.page) : 1; // Get current page from query string or default to page 1
        let pageSize = 8;

        // Sort by price in descending order
        let products = await Product.find()
            .sort({ price: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize); // Implement pagination

        // Get the total number of records to calculate totalPages
        let totalRecords = await Product.countDocuments();

        // Calculate total pages
        let totalPages = Math.ceil(totalRecords / pageSize);

        const stylesheets = ['/css/style.css', '/css/furniturestyle.css'];

        return res.render('furniture', {
            stylesheet: stylesheets,
            products,
            page, // Send the current page
            pageSize,
            totalPages,
            totalRecords,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
    }
});

  
  module.exports = router;