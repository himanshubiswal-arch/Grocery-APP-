// Main App Controller — SPA Router, State Management, Utilities
const App = {
  currentRoute: 'home',

  init() {
    this.bindEvents();
    this.handleRoute();
    this.loadCartBadge();
  },

  bindEvents() {
    // Hash-based routing
    window.addEventListener('hashchange', () => this.handleRoute());

    // Search input with debounce
    let searchTimer;
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          if (this.currentRoute === 'home') {
            ProductList.render(e.target.value);
          } else {
            window.location.hash = '#/';
            setTimeout(() => ProductList.render(e.target.value), 100);
          }
        }, 350);
      });
    }
  },

  handleRoute() {
    const hash = window.location.hash || '#/';
    const hero = document.getElementById('hero-section');
    const mainContent = document.getElementById('main-content');

    // Show/hide hero based on route
    if (hash === '#/' || hash === '') {
      hero.style.display = 'block';
      mainContent.classList.remove('no-hero');
      this.currentRoute = 'home';
      ProductList.activeCategory = 'All';
      ProductList.render();
    } else {
      hero.style.display = 'none';
      mainContent.classList.add('no-hero');

      if (hash === '#/cart') {
        this.currentRoute = 'cart';
        CartComponent.render();
      } else if (hash === '#/checkout') {
        this.currentRoute = 'checkout';
        Checkout.render();
      } else if (hash === '#/orders') {
        this.currentRoute = 'orders';
        Checkout.renderOrders();
      } else {
        this.currentRoute = 'home';
        hero.style.display = 'block';
        mainContent.classList.remove('no-hero');
        ProductList.render();
      }
    }

    this.updateActiveNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigate(page) {
    switch (page) {
      case 'home':
        window.location.hash = '#/';
        break;
      case 'cart':
        window.location.hash = '#/cart';
        break;
      case 'checkout':
        window.location.hash = '#/checkout';
        break;
      case 'orders':
        window.location.hash = '#/orders';
        break;
      default:
        window.location.hash = '#/';
    }
  },

  filterByCategory(category) {
    ProductList.activeCategory = category;
    ProductList.render();
  },

  updateActiveNav() {
    // Update orders link active state
    const ordersLink = document.getElementById('nav-orders');
    if (ordersLink) {
      ordersLink.classList.toggle('active', this.currentRoute === 'orders');
    }
  },

  async loadCartBadge() {
    try {
      const data = await API.getCart();
      this.updateCartBadge(data.itemCount);
    } catch (e) {
      // silently fail
    }
  },

  updateCartBadge(count) {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      // Pulse animation
      badge.classList.remove('pulse');
      void badge.offsetWidth; // reflow
      badge.classList.add('pulse');
    }
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
