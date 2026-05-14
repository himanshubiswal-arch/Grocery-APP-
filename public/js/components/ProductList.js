// ProductList Component — Renders category filters + product grid
const ProductList = {
  categories: [],
  activeCategory: 'All',

  categoryIcons: {
    'All': '🏪',
    'Fruits': '🍎',
    'Vegetables': '🥦',
    'Dairy': '🥛',
    'Bakery': '🍞',
    'Beverages': '☕',
    'Snacks': '🍿'
  },

  renderSkeleton() {
    let cards = '';
    for (let i = 0; i < 8; i++) {
      cards += `
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-body">
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>`;
    }
    return `<div class="skeleton-grid">${cards}</div>`;
  },

  renderCategoryBar() {
    const allCats = ['All', ...this.categories];
    return `
      <div class="category-bar" id="category-bar">
        ${allCats.map(cat => `
          <button class="category-chip ${cat === this.activeCategory ? 'active' : ''}"
                  onclick="ProductList.selectCategory('${cat}')"
                  data-category="${cat}">
            <span class="chip-icon">${this.categoryIcons[cat] || '📦'}</span>
            ${cat}
          </button>
        `).join('')}
      </div>`;
  },

  renderProductCard(product, index, qty = 0) {
    let controlsHTML = '';
    if (qty > 0) {
      controlsHTML = `
        <div class="qty-control" style="height: 36px; display: flex; border: 1px solid var(--accent); border-radius: var(--radius-md); overflow: hidden;">
          <button class="qty-btn" style="background: var(--accent-glow); color: var(--accent);" onclick="ProductList.updateQty(${product.id}, ${qty - 1}, event)">−</button>
          <div style="padding: 0 14px; font-weight: 600; font-size: 14px; background: var(--bg-card); display: flex; align-items: center; color: var(--text-primary);">${qty}</div>
          <button class="qty-btn" style="background: var(--accent-glow); color: var(--accent);" onclick="ProductList.updateQty(${product.id}, ${qty + 1}, event)">+</button>
        </div>
      `;
    } else {
      controlsHTML = `
        <button class="add-to-cart-btn" id="add-btn-${product.id}"
                onclick="ProductList.addToCart(${product.id}, event)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add
        </button>
      `;
    }

    return `
      <div class="product-card" style="animation-delay: ${index * 0.06}s" id="product-${product.id}">
        <div class="card-image-area">
          <span class="card-category-tag">${product.category}</span>
          <span class="card-emoji">${product.image}</span>
        </div>
        <div class="card-body">
          <h3 class="card-name">${product.name}</h3>
          <p class="card-desc">${product.description}</p>
          <div class="card-footer">
            <div class="card-price">
              $${product.price.toFixed(2)}
              <span class="card-unit">/ ${product.unit}</span>
            </div>
            <div class="card-controls-wrapper" id="controls-${product.id}">
              ${controlsHTML}
            </div>
          </div>
        </div>
      </div>`;
  },

  async render(searchQuery = '') {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">🛍️ Shop Groceries</h2>
        <p class="section-subtitle">Browse our curated selection of premium groceries</p>
      </div>
      ${this.renderSkeleton()}`;

    try {
      // Fetch categories, products, and cart
      const [catData, prodData, cartData] = await Promise.all([
        API.getCategories(),
        API.getProducts(this.activeCategory, searchQuery),
        API.getCart().catch(() => ({ items: [] }))
      ]);

      this.categories = catData.categories;
      this.productsCache = prodData.products; // cache products for re-rendering controls

      let productsHTML = '';
      if (prodData.products.length === 0) {
        productsHTML = `
          <div class="cart-empty fade-in">
            <div class="cart-empty-icon">🔍</div>
            <h2>No products found</h2>
            <p>Try a different search or category.</p>
            <button class="continue-shopping-btn" onclick="ProductList.selectCategory('All')">Show All Products</button>
          </div>`;
      } else {
        productsHTML = `
          <div class="product-grid">
            ${prodData.products.map((p, i) => {
              const cartItem = cartData.items?.find(item => item.productId === p.id);
              const qty = cartItem ? cartItem.quantity : 0;
              return this.renderProductCard(p, i, qty);
            }).join('')}
          </div>`;
      }

      root.innerHTML = `
        <div class="section-header fade-in">
          <h2 class="section-title">🛍️ Shop Groceries</h2>
          <p class="section-subtitle">${prodData.total} products available${this.activeCategory !== 'All' ? ' in ' + this.activeCategory : ''}</p>
        </div>
        ${this.renderCategoryBar()}
        ${productsHTML}`;

    } catch (err) {
      root.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">⚠️</div>
          <h2>Failed to load products</h2>
          <p>Please check your connection and try again.</p>
          <button class="continue-shopping-btn" onclick="ProductList.render()">Retry</button>
        </div>`;
    }
  },

  async selectCategory(category) {
    this.activeCategory = category;
    await this.render();
  },

  async addToCart(productId, event) {
    const btn = event.currentTarget;
    btn.disabled = true;
    btn.innerHTML = `<span style="font-size:14px">⏳</span>`;

    try {
      const data = await API.addToCart(productId);
      App.updateCartBadge(data.cart.itemCount);
      App.showToast(`Added to cart!`, 'success');
      this.refreshProductControls(productId, 1);
    } catch (err) {
      App.showToast('Failed to add item', 'error');
      btn.disabled = false;
      btn.innerHTML = `Add`;
    }
  },

  async updateQty(productId, newQty, event) {
    const wrapper = event.currentTarget.closest('.qty-control');
    if(wrapper) wrapper.style.pointerEvents = 'none';
    
    try {
      if (newQty <= 0) {
        const data = await API.removeFromCart(productId);
        App.updateCartBadge(data.cart.itemCount);
        App.showToast('Item removed from cart', 'success');
        this.refreshProductControls(productId, 0);
      } else {
        const data = await API.updateCartItem(productId, newQty);
        App.updateCartBadge(data.cart.itemCount);
        this.refreshProductControls(productId, newQty);
      }
    } catch (err) {
      App.showToast('Failed to update quantity', 'error');
      if(wrapper) wrapper.style.pointerEvents = 'auto';
    }
  },

  refreshProductControls(productId, qty) {
    const controlsWrapper = document.getElementById(`controls-${productId}`);
    if (controlsWrapper) {
      if (qty > 0) {
        controlsWrapper.innerHTML = `
          <div class="qty-control" style="height: 36px; display: flex; border: 1px solid var(--accent); border-radius: var(--radius-md); overflow: hidden;">
            <button class="qty-btn" style="background: var(--accent-glow); color: var(--accent);" onclick="ProductList.updateQty(${productId}, ${qty - 1}, event)">−</button>
            <div style="padding: 0 14px; font-weight: 600; font-size: 14px; background: var(--bg-card); display: flex; align-items: center; color: var(--text-primary);">${qty}</div>
            <button class="qty-btn" style="background: var(--accent-glow); color: var(--accent);" onclick="ProductList.updateQty(${productId}, ${qty + 1}, event)">+</button>
          </div>
        `;
      } else {
        controlsWrapper.innerHTML = `
          <button class="add-to-cart-btn" id="add-btn-${productId}"
                  onclick="ProductList.addToCart(${productId}, event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        `;
      }
    }
  }
};
