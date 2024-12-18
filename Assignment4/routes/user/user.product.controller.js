const express = require('express');
const router = express.Router();
let Product = require("../../models/product.model")
let Category = require("../../models/category.model");
const Order = require("../../models/order.model");
let authMiddleware = require("../../middlewares/auth-middleware");

//added auth_middleware at every get page and commentedout logoutlines to check if needed
router.get('/furniture/:page?',authMiddleware, async (req, res) => {
  try {
    const category = req.query.category || ""; 
    const sort = req.query.sort || "";         

    console.log("Received query parameters:", req.query);

    let query = {};

    // Filtering by category 
    if (category && category !== "") {
      const categoryDoc = await Category.findOne({ title: category });
      if (categoryDoc) {
        query.category = categoryDoc._id; 
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
    const page = req.params.page ? Number(req.params.page) : 1; 
    const pageSize = 8; 
    const skip = (page - 1) * pageSize;
    const totalProducts = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // console.log("Fetched Products:", products.length);
    const categories = await Category.find();
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
      const cartProductIds = req.session.cart; 
      const productsInCart = await Product.find({ '_id': { $in: cartProductIds } }); 

      // Calculate total price
      let totalPrice = 0;
      productsInCart.forEach(product => {
          totalPrice += product.price;
      });

      res.render('cart', {
          products: productsInCart,
          cartCount: req.session.cart.length, 
          totalPrice: totalPrice, 
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
    const cartProductIds = req.session.cart;

    if (!cartProductIds || cartProductIds.length === 0) {
      return res.redirect('/cart'); 
    }
    const productsInCart = await Product.find({ '_id': { $in: cartProductIds } });

    // Calculate total price and build product info
    let totalPrice = 0;
    const orderProducts = productsInCart.map(product => {
      totalPrice += product.price;
      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1, 
       
      };
    });
    const newOrder = new Order({
      name,
      address,
      email,
      phone,
      paymentMethod: paymentMethod || "Cash on Delivery",
      products: orderProducts,
      totalPrice,
    });
    await newOrder.save();
    req.session.cart = [];

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