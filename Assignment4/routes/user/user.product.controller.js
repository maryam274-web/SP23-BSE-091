const express = require('express');
const router = express.Router();
let Product = require("../../models/product.model")
let Category = require("../../models/category.model");
const Order = require("../../models/order.model");
let authMiddleware = require("../../middlewares/auth-middleware");

router.get('/furniture/:page?',authMiddleware, async (req, res) => {
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


// Route for cart page
router.get('/cart',authMiddleware, async (req, res) => {
  try {
      const cartProductIds = req.session.cart; // Get product IDs from session
      const productsInCart = await Product.find({ '_id': { $in: cartProductIds } }); // Find products in the cart by IDs

      // Calculate total price
      let totalPrice = 0;
      productsInCart.forEach(product => {
          totalPrice += product.price; // Add the price of each product (you can multiply by quantity if needed)
      });

      res.render('cart', {
          products: productsInCart,
          cartCount: req.session.cart.length, // Number of products in cart
          totalPrice: totalPrice, // Pass the total price to the view
      });
  } catch (err) {
      console.error("Error fetching cart products:", err);
      res.status(500).send("Error fetching cart products.");
  }
});

// Handle POST request to save order details
router.post('/checkout', async (req, res) => {
  try {
    const { name, address, email, phone, paymentMethod } = req.body;

    // Fetch cart data from session
    const cartProductIds = req.session.cart;

    if (!cartProductIds || cartProductIds.length === 0) {
      return res.redirect('/cart'); // Redirect if the cart is empty
    }

    // Fetch product details for the products in the cart
    const productsInCart = await Product.find({ '_id': { $in: cartProductIds } });

    // Calculate total price and build product info
    let totalPrice = 0;
    const orderProducts = productsInCart.map(product => {
      totalPrice += product.price;
      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1, // Default quantity, can be updated if quantity functionality exists
       
      };
    });

    // Create an order object
    const newOrder = new Order({
      name,
      address,
      email,
      phone,
      paymentMethod: paymentMethod || "Cash on Delivery",
      products: orderProducts,
      totalPrice,
    });

    // Save the order to the database
    await newOrder.save();

    // Clear the cart session after order submission
    req.session.cart = [];

    // Redirect to order success page
    res.redirect('/orderSuccess');
  } catch (err) {
    console.error("Error placing the order:", err);
    res.status(500).send("Error placing the order. Please try again.");
  }
});


router.get('/checkout', authMiddleware,(req, res) => {
  // If cart is empty, redirect to the cart page
  if (!req.session.cart || req.session.cart.length === 0) {
      return res.redirect('/cart');
  }

  res.render('checkout',{
    layout:false
  });
});

router.get('/orderSuccess', authMiddleware,(req, res) => {
  res.render('orderSuccess',{
   layout:false
});
});




module.exports = router;