// Checkout Component — Order placement and confirmation
const Checkout = {

  async render() {
    const root = document.getElementById('app-root');

    try {
      const data = await API.getCart();
      const { items, total, itemCount } = data;

      if (items.length === 0) {
        App.navigate('cart');
        return;
      }

      const deliveryFee = total > 50 ? 0 : 4.99;
      const grandTotal = total + deliveryFee;

      root.innerHTML = `
        <div class="cart-page fade-in">
          <div class="section-header">
            <h2 class="section-title">📋 Checkout</h2>
            <p class="section-subtitle">Fill in your details and confirm your order</p>
          </div>

          <div class="checkout-grid">
            <!-- Left: Customer Details Form -->
            <div class="checkout-form-section">

              <!-- Delivery Information -->
              <div class="checkout-card">
                <div class="checkout-card-header">
                  <span class="checkout-card-icon">📍</span>
                  <h3>Delivery Information</h3>
                </div>
                <div class="form-group">
                  <label class="form-label" for="checkout-name">Full Name <span class="required">*</span></label>
                  <input type="text" id="checkout-name" class="form-input" placeholder="e.g. John Doe" autocomplete="name">
                  <span class="form-error" id="error-name"></span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="checkout-phone">Phone Number <span class="required">*</span></label>
                  <input type="tel" id="checkout-phone" class="form-input" placeholder="e.g. +1 234 567 8900" autocomplete="tel">
                  <span class="form-error" id="error-phone"></span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="checkout-email">Email Address</label>
                  <input type="email" id="checkout-email" class="form-input" placeholder="e.g. john@example.com" autocomplete="email">
                </div>
                <div class="form-group">
                  <label class="form-label" for="checkout-address">Delivery Address <span class="required">*</span></label>
                  <textarea id="checkout-address" class="form-input form-textarea" rows="3" placeholder="House/Apt number, Street, City, ZIP code"></textarea>
                  <span class="form-error" id="error-address"></span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="checkout-notes">Delivery Notes <span style="color: var(--text-muted); font-weight: 400;">(optional)</span></label>
                  <input type="text" id="checkout-notes" class="form-input" placeholder="e.g. Leave at the door, ring bell...">
                </div>
              </div>

              <!-- Payment Method -->
              <div class="checkout-card">
                <div class="checkout-card-header">
                  <span class="checkout-card-icon">💳</span>
                  <h3>Payment Method</h3>
                </div>
                <span class="form-error" id="error-payment" style="margin-bottom: 8px;"></span>
                <div class="payment-options" id="payment-options">
                  <label class="payment-option" for="pay-cod">
                    <input type="radio" name="payment" id="pay-cod" value="Cash on Delivery">
                    <div class="payment-option-content">
                      <span class="payment-icon">💵</span>
                      <div>
                        <span class="payment-title">Cash on Delivery</span>
                        <span class="payment-desc">Pay when your order arrives</span>
                      </div>
                    </div>
                    <span class="payment-check"></span>
                  </label>
                  <label class="payment-option" for="pay-card">
                    <input type="radio" name="payment" id="pay-card" value="Credit / Debit Card">
                    <div class="payment-option-content">
                      <span class="payment-icon">💳</span>
                      <div>
                        <span class="payment-title">Credit / Debit Card</span>
                        <span class="payment-desc">Visa, Mastercard, Amex</span>
                      </div>
                    </div>
                    <span class="payment-check"></span>
                  </label>
                  <label class="payment-option" for="pay-upi">
                    <input type="radio" name="payment" id="pay-upi" value="UPI / Digital Wallet">
                    <div class="payment-option-content">
                      <span class="payment-icon">📱</span>
                      <div>
                        <span class="payment-title">UPI / Digital Wallet</span>
                        <span class="payment-desc">Google Pay, Apple Pay, PayPal</span>
                      </div>
                    </div>
                    <span class="payment-check"></span>
                  </label>
                  <label class="payment-option" for="pay-netbanking">
                    <input type="radio" name="payment" id="pay-netbanking" value="Net Banking">
                    <div class="payment-option-content">
                      <span class="payment-icon">🏦</span>
                      <div>
                        <span class="payment-title">Net Banking</span>
                        <span class="payment-desc">Pay through your bank</span>
                      </div>
                    </div>
                    <span class="payment-check"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Right: Order Summary -->
            <div class="checkout-summary-section">
              <div class="checkout-card sticky-summary">
                <div class="checkout-card-header">
                  <span class="checkout-card-icon">🛍️</span>
                  <h3>Order Summary</h3>
                </div>
                <div class="checkout-items-list">
                  ${items.map(item => `
                    <div class="order-item-row">
                      <span class="item-name">
                        ${item.image} ${item.name}
                        <span class="item-qty">× ${item.quantity}</span>
                      </span>
                      <span>$${item.subtotal.toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="checkout-totals">
                  <div class="order-item-row" style="color: var(--text-muted); font-size: 13px;">
                    <span>Subtotal (${itemCount} items)</span>
                    <span>$${total.toFixed(2)}</span>
                  </div>
                  <div class="order-item-row" style="color: var(--text-muted); font-size: 13px;">
                    <span>Delivery</span>
                    <span style="color: ${deliveryFee === 0 ? 'var(--accent)' : 'inherit'}">${deliveryFee === 0 ? 'FREE ✨' : '$' + deliveryFee.toFixed(2)}</span>
                  </div>
                  <div class="order-total-row">
                    <span>Total</span>
                    <span class="amount">$${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button class="checkout-btn" id="place-order-btn" onclick="Checkout.placeOrder()">
                  🛍️ Place Order — $${grandTotal.toFixed(2)}
                </button>
                <p class="checkout-secure-note">🔒 Your information is secure and encrypted</p>
              </div>
              <div style="margin-top: 16px; text-align: center;">
                <button class="btn-outline" onclick="App.navigate('cart')">← Back to Cart</button>
              </div>
            </div>
          </div>
        </div>`;

    } catch (err) {
      root.innerHTML = `
        <div class="cart-page">
          <div class="cart-empty">
            <div class="cart-empty-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <button class="continue-shopping-btn" onclick="Checkout.render()">Retry</button>
          </div>
        </div>`;
    }
  },

  validateForm() {
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('input-error'));

    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked');

    if (!name) {
      document.getElementById('error-name').textContent = 'Please enter your full name';
      document.getElementById('checkout-name').classList.add('input-error');
      valid = false;
    }

    if (!phone) {
      document.getElementById('error-phone').textContent = 'Please enter your phone number';
      document.getElementById('checkout-phone').classList.add('input-error');
      valid = false;
    }

    if (!address) {
      document.getElementById('error-address').textContent = 'Please enter your delivery address';
      document.getElementById('checkout-address').classList.add('input-error');
      valid = false;
    }

    if (!payment) {
      document.getElementById('error-payment').textContent = 'Please select a payment method';
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstError = document.querySelector('.input-error, .form-error:not(:empty)');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid ? {
      name,
      phone,
      email: document.getElementById('checkout-email').value.trim(),
      address,
      notes: document.getElementById('checkout-notes').value.trim(),
      paymentMethod: payment.value
    } : null;
  },

  async placeOrder() {
    const customerInfo = this.validateForm();
    if (!customerInfo) return;

    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner">⏳</span> Processing your order...`;

    try {
      const data = await API.placeOrder(customerInfo);
      App.updateCartBadge(0);
      this.renderConfirmation(data.order);
    } catch (err) {
      App.showToast('Failed to place order. Please try again.', 'error');
      btn.disabled = false;
      btn.innerHTML = `🛍️ Place Order`;
    }
  },

  renderConfirmation(order) {
    const root = document.getElementById('app-root');

    const paymentIcons = {
      'Cash on Delivery': '💵',
      'Credit / Debit Card': '💳',
      'UPI / Digital Wallet': '📱',
      'Net Banking': '🏦'
    };

    root.innerHTML = `
      <div class="order-success fade-in">
        <div class="order-success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p class="order-id">Order ID: <span>#${order.id}</span></p>

        <!-- Customer Details -->
        <div class="order-details-card">
          <h3>📍 Delivery Details</h3>
          <div class="confirmation-detail-row">
            <span class="detail-label">Name</span>
            <span>${order.customer.name}</span>
          </div>
          <div class="confirmation-detail-row">
            <span class="detail-label">Phone</span>
            <span>${order.customer.phone}</span>
          </div>
          ${order.customer.email ? `
          <div class="confirmation-detail-row">
            <span class="detail-label">Email</span>
            <span>${order.customer.email}</span>
          </div>` : ''}
          <div class="confirmation-detail-row">
            <span class="detail-label">Address</span>
            <span>${order.customer.address}</span>
          </div>
          ${order.customer.notes ? `
          <div class="confirmation-detail-row">
            <span class="detail-label">Notes</span>
            <span>${order.customer.notes}</span>
          </div>` : ''}
          <div class="confirmation-detail-row">
            <span class="detail-label">Payment</span>
            <span>${paymentIcons[order.customer.paymentMethod] || '💳'} ${order.customer.paymentMethod}</span>
          </div>
        </div>

        <!-- Items Ordered -->
        <div class="order-details-card">
          <h3>🛍️ Items Ordered</h3>
          ${order.items.map(item => `
            <div class="order-item-row">
              <span class="item-name">
                ${item.image} ${item.name}
                <span class="item-qty">× ${item.quantity}</span>
              </span>
              <span>$${item.subtotal.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="order-total-row">
            <span>Total Paid</span>
            <span class="amount">$${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="order-actions">
          <button class="continue-shopping-btn" onclick="App.navigate('home')">
            🛒 Continue Shopping
          </button>
          <button class="btn-outline" onclick="App.navigate('orders')">
            📋 View All Orders
          </button>
        </div>
      </div>`;
  },

  async renderOrders() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="orders-page fade-in">
        <div class="section-header">
          <h2 class="section-title">📋 My Orders</h2>
          <p class="section-subtitle">Loading your order history...</p>
        </div>
      </div>`;

    try {
      const data = await API.getOrders();
      const { orders } = data;

      if (orders.length === 0) {
        root.innerHTML = `
          <div class="orders-page fade-in">
            <div class="section-header">
              <h2 class="section-title">📋 My Orders</h2>
            </div>
            <div class="orders-empty">
              <div class="orders-empty-icon">📦</div>
              <h2>No orders yet</h2>
              <p style="color: var(--text-secondary); margin-bottom: 24px;">Once you place an order, it will appear here.</p>
              <button class="continue-shopping-btn" onclick="App.navigate('home')">Start Shopping</button>
            </div>
          </div>`;
        return;
      }

      const ordersHTML = orders.map(order => {
        const date = new Date(order.createdAt);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return `
          <div class="order-card fade-in">
            <div class="order-card-header">
              <span class="order-card-id">Order #${order.id}</span>
              <span class="order-status">${order.status}</span>
            </div>
            <div class="order-card-meta">
              <span>📅 ${dateStr} at ${timeStr}</span>
              <span>📦 ${order.itemCount} item${order.itemCount > 1 ? 's' : ''}</span>
              ${order.customer ? `<span>👤 ${order.customer.name}</span>` : ''}
              ${order.customer ? `<span>${order.customer.paymentMethod}</span>` : ''}
            </div>
            <div class="order-card-items">
              ${order.items.map(item => `
                <span class="order-card-item">${item.image} ${item.name} × ${item.quantity}</span>
              `).join('')}
            </div>
            ${order.customer ? `
            <div class="order-card-delivery">
              📍 ${order.customer.address}
            </div>` : ''}
            <div class="order-card-total">$${order.total.toFixed(2)}</div>
          </div>`;
      }).join('');

      root.innerHTML = `
        <div class="orders-page fade-in">
          <div class="section-header">
            <h2 class="section-title">📋 My Orders</h2>
            <p class="section-subtitle">${orders.length} order${orders.length > 1 ? 's' : ''} placed</p>
          </div>
          ${ordersHTML}
          <div style="margin-top: 24px; text-align: center;">
            <button class="btn-outline" onclick="App.navigate('home')">← Back to Shop</button>
          </div>
        </div>`;

    } catch (err) {
      root.innerHTML = `
        <div class="orders-page">
          <div class="orders-empty">
            <div class="orders-empty-icon">⚠️</div>
            <h2>Failed to load orders</h2>
            <button class="continue-shopping-btn" onclick="Checkout.renderOrders()">Retry</button>
          </div>
        </div>`;
    }
  }
};
