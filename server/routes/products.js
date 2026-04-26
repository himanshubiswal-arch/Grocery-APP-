const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /api/products - List all products, optional ?category= filter
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = products;

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  res.json({ products: result, total: result.length });
});

// GET /api/products/categories - List all unique categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

module.exports = router;
