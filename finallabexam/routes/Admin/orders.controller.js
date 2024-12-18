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



router.post('/api/orders', async (req, res) => {
    try {
      const { name, address, email, phone, paymentMethod, items, totalAmount } = req.body;
  
      // Validate required fields
      if (!name || !address || !email || !phone || !paymentMethod || !totalAmount) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Create a new order
      const newOrder = new Order({
        customer: { name, address, email, phone },
        items: items || [], // Ensure items array is present
        totalAmount,
      });
  
      // Save order to database
      await newOrder.save();
      res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

module.exports = router;
