const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const products = require('../data/products.json');

// GET /api/cart - Get current cart
router.get('/', (req, res) => {
  res.json({
    items: Cart.getCart(),
    total: Cart.getTotal(),
    itemCount: Cart.getItemCount()
  });
});

// POST /api/cart - Add item to cart
router.post('/', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (!product.inStock) {
    return res.status(400).json({ error: 'Product is out of stock' });
  }
  const item = Cart.addItem(product, quantity || 1);
  res.status(201).json({
    message: `${product.name} added to cart`,
    item,
    cart: { items: Cart.getCart(), total: Cart.getTotal(), itemCount: Cart.getItemCount() }
  });
});

// PUT /api/cart/:productId - Update item quantity
router.put('/:productId', (req, res) => {
  const { quantity } = req.body;
  const productId = parseInt(req.params.productId);
  if (quantity === undefined) {
    return res.status(400).json({ error: 'quantity is required' });
  }
  const item = Cart.updateQuantity(productId, quantity);
  if (!item && quantity > 0) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  res.json({
    message: quantity <= 0 ? 'Item removed from cart' : 'Cart updated',
    cart: { items: Cart.getCart(), total: Cart.getTotal(), itemCount: Cart.getItemCount() }
  });
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const removed = Cart.removeItem(productId);
  if (!removed) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  res.json({
    message: `${removed.name} removed from cart`,
    cart: { items: Cart.getCart(), total: Cart.getTotal(), itemCount: Cart.getItemCount() }
  });
});

module.exports = router;
