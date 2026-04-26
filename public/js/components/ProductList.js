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

  renderProductCard(product, index) {
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
            <button class="add-to-cart-btn" id="add-btn-${product.id}"
                    onclick="ProductList.addToCart(${product.id}, event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add
            </button>
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
      // Fetch categories and products
      const [catData, prodData] = await Promise.all([
        API.getCategories(),
        API.getProducts(this.activeCategory, searchQuery)
      ]);

      this.categories = catData.categories;

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
            ${prodData.products.map((p, i) => this.renderProductCard(p, i)).join('')}
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
    btn.innerHTML = `<span style="font-size:14px">✓</span> Added`;
    btn.classList.add('added');

    try {
      const data = await API.addToCart(productId);
      App.updateCartBadge(data.cart.itemCount);
      App.showToast(`${data.item.name} added to cart!`, 'success');
    } catch (err) {
      App.showToast('Failed to add item', 'error');
    }

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add`;
      btn.classList.remove('added');
    }, 1200);
  }
};
