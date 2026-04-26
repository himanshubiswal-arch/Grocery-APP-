// Cart Component — Renders cart page with item management
const CartComponent = {

  async render() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="cart-page fade-in">
        <div class="section-header">
          <h2 class="section-title">🛒 Your Cart</h2>
          <p class="section-subtitle">Loading your items...</p>
        </div>
        <div class="skeleton-grid"><div class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-body"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div></div>
      </div>`;

    try {
      const data = await API.getCart();
      const { items, total, itemCount } = data;

      if (items.length === 0) {
        root.innerHTML = `
          <div class="cart-page fade-in">
            <div class="section-header">
              <h2 class="section-title">🛒 Your Cart</h2>
            </div>
            <div class="cart-empty fade-in">
              <div class="cart-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start adding delicious groceries to your cart!</p>
              <button class="continue-shopping-btn" onclick="App.navigate('home')">
                ← Start Shopping
              </button>
            </div>
          </div>`;
        App.updateCartBadge(0);
        return;
      }

      const itemsHTML = items.map(item => `
        <div class="cart-item fade-in" id="cart-item-${item.productId}">
          <div class="cart-item-emoji">${item.image}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price-unit">$${item.price.toFixed(2)} / ${item.unit}</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button class="qty-btn" onclick="CartComponent.updateQty(${item.productId}, ${item.quantity - 1})">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="CartComponent.updateQty(${item.productId}, ${item.quantity + 1})">+</button>
            </div>
            <span class="cart-item-subtotal">$${item.subtotal.toFixed(2)}</span>
            <button class="remove-btn" onclick="CartComponent.removeItem(${item.productId})" title="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `).join('');

      const deliveryFee = total > 50 ? 0 : 4.99;
      const grandTotal = total + deliveryFee;

      root.innerHTML = `
        <div class="cart-page fade-in">
          <div class="section-header">
            <h2 class="section-title">🛒 Your Cart</h2>
            <p class="section-subtitle">${itemCount} item${itemCount > 1 ? 's' : ''} in your cart</p>
          </div>
          <div class="cart-items-list">
            ${itemsHTML}
          </div>
          <div class="cart-summary">
            <div class="cart-summary-row">
              <span class="cart-summary-label">Subtotal (${itemCount} items)</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <div class="cart-summary-row">
              <span class="cart-summary-label">Delivery</span>
              <span style="color: ${deliveryFee === 0 ? 'var(--accent)' : 'inherit'}">
                ${deliveryFee === 0 ? 'FREE ✨' : '$' + deliveryFee.toFixed(2)}
              </span>
            </div>
            ${deliveryFee > 0 ? `
            <div class="cart-summary-row">
              <span class="cart-summary-label" style="font-size:12px; color:var(--text-muted)">Free delivery on orders over $50</span>
              <span></span>
            </div>` : ''}
            <div class="cart-summary-row total">
              <span>Total</span>
              <span class="amount">$${grandTotal.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="App.navigate('checkout')">
              Proceed to Checkout
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-outline" onclick="App.navigate('home')">← Continue Shopping</button>
          </div>
        </div>`;

      App.updateCartBadge(itemCount);

    } catch (err) {
      root.innerHTML = `
        <div class="cart-page">
          <div class="cart-empty">
            <div class="cart-empty-icon">⚠️</div>
            <h2>Failed to load cart</h2>
            <p>Please try again.</p>
            <button class="continue-shopping-btn" onclick="CartComponent.render()">Retry</button>
          </div>
        </div>`;
    }
  },

  async updateQty(productId, quantity) {
    try {
      if (quantity <= 0) {
        await this.removeItem(productId);
        return;
      }
      const data = await API.updateCartItem(productId, quantity);
      App.updateCartBadge(data.cart.itemCount);
      await this.render();
    } catch (err) {
      App.showToast('Failed to update quantity', 'error');
    }
  },

  async removeItem(productId) {
    try {
      const data = await API.removeFromCart(productId);
      App.updateCartBadge(data.cart.itemCount);
      App.showToast(data.message, 'success');
      await this.render();
    } catch (err) {
      App.showToast('Failed to remove item', 'error');
    }
  }
};
