// Login Component
const LoginComponent = {
  render() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="login-wrapper fade-in">
        <div class="login-logo-container">
          <span class="logo-icon">🛒</span>
          <span class="logo-text">Fresh<span class="logo-accent">Cart</span></span>
        </div>
        <div class="login-card">
          <h1 class="login-title">Sign in</h1>
          <form id="login-form" onsubmit="LoginComponent.handleLogin(event)">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="login-label">Email or mobile phone number</label>
              <input type="email" required class="login-input" />
            </div>
            <div class="form-group" style="margin-bottom: 24px;">
              <label class="login-label">Password</label>
              <input type="password" required class="login-input" />
            </div>
            <button type="submit" class="btn-ecommerce-primary">
              Continue
            </button>
          </form>
          <div class="login-legal">
            By continuing, you agree to FreshCart's 
            <a href="#">Conditions of Use</a> and 
            <a href="#">Privacy Notice</a>.
          </div>
          <div class="login-help">
            <a href="#">Need help?</a>
          </div>
        </div>
        <div class="login-divider">
          <span>New to FreshCart?</span>
        </div>
        <button class="btn-ecommerce-secondary" onclick="App.showToast('Redirecting to sign up...', 'success')">
          Create your FreshCart account
        </button>
      </div>
    `;
  },

  handleLogin(event) {
    event.preventDefault();
    App.showToast('Logged in successfully!', 'success');
    App.navigate('home');
  }
};
