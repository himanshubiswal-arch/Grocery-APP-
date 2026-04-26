const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// POST /api/orders - Place an order from current cart
router.post('/', (req, res) => {
  const cartItems = Cart.getCart();
  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty. Add items before placing an order.' });
  }
  const { customer } = req.body;
  const total = Cart.getTotal();
  const order = Order.createOrder(cartItems, total, customer);
  Cart.clearCart();
  res.status(201).json({
    message: 'Order placed successfully!',
    order
  });
});

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  res.json({ orders: Order.getOrders() });
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', (req, res) => {
  const order = Order.getOrderById(parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

module.exports = router;
