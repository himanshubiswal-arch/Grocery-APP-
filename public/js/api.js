// API Client — Fetch wrapper for all backend calls
const API = {
  BASE: '/api',

  async getProducts(category = '', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    const res = await fetch(`${this.BASE}/products?${params}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${this.BASE}/products/categories`);
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${this.BASE}/products/${id}`);
    return res.json();
  },

  async getCart() {
    const res = await fetch(`${this.BASE}/cart`);
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${this.BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    return res.json();
  },

  async updateCartItem(productId, quantity) {
    const res = await fetch(`${this.BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return res.json();
  },

  async removeFromCart(productId) {
    const res = await fetch(`${this.BASE}/cart/${productId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async placeOrder(customerInfo = {}) {
    const res = await fetch(`${this.BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer: customerInfo })
    });
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${this.BASE}/orders`);
    return res.json();
  }
};
