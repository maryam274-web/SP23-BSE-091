const express = require('express');
const router = express.Router();
const Order = require('../../models/order.model');

// Orders page route
router.get('/orders', async (req, res) => {
    try {
        // Fetch orders in descending order of createdAt
        const orders = await Order.find().sort({ createdAt: -1 });

        // Render orders page and pass the orders data
        res.render('admin/orders', { orders,layout:false});
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Server error while fetching orders.");
    }
});





router.post('/products/checkout', async (req, res) => {
  try {
    const { name, address, email, phone, paymentMethod } = req.body;
    
    // Check if session contains a cart
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // Validate required fields
    if (!name || !address || !email || !phone || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Calculate totalAmount based on cart items
    let totalAmount = 0;
    const items = [];

    // Loop through each product ID in the cart
    for (let productId of req.session.cart) {
      // Find the product by ID in the database (assumed to be a Product model)
      const product = await Product.findById(productId);
      
      if (!product) {
        // If a product is not found, return an error
        return res.status(400).json({ message: `Product with ID ${productId} not found.` });
      }

      // Add the product's price to the total amount
      totalAmount += product.price; // Assuming price is a field in the product model
      items.push({ productId: product._id, price: product.price }); // Add the product to items array
    }

    // Create a new order
    const newOrder = new Order({
      customer: { name, address, email, phone },
      items: items, // The cart items
      totalAmount,   // The calculated total amount
    });

    // Save order to database
    await newOrder.save();
    
    // Clear the cart after the order is placed (optional)
    req.session.cart = [];

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports=router;