// In-memory Order Model
let orders = [];
let nextOrderId = 1001;

const Order = {
  createOrder(cartItems, total, customer = null) {
    const order = {
      id: nextOrderId++,
      items: cartItems.map(item => ({ ...item })),
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      customer: customer ? {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address,
        notes: customer.notes || '',
        paymentMethod: customer.paymentMethod
      } : null,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    return order;
  },

  getOrders() {
    return orders.slice().reverse();
  },

  getOrderById(id) {
    return orders.find(order => order.id === id) || null;
  }
};

module.exports = Order;
