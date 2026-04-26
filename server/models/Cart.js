// In-memory Cart Model
let cart = [];

const Cart = {
  getCart() {
    return cart;
  },

  addItem(product, quantity = 1) {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.quantity * existing.price;
      return existing;
    }
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      quantity,
      subtotal: product.price * quantity
    };
    cart.push(cartItem);
    return cartItem;
  },

  updateQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return null;
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    item.subtotal = item.quantity * item.price;
    return item;
  },

  removeItem(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index === -1) return null;
    const removed = cart.splice(index, 1)[0];
    return removed;
  },

  getTotal() {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  },

  getItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  clearCart() {
    cart = [];
    return [];
  }
};

module.exports = Cart;
