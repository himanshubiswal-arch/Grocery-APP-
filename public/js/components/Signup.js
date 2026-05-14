// Signup Component
const SignupComponent = {
  render() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="login-wrapper fade-in">
        <div class="login-logo-container">
          <span class="logo-icon">🛒</span>
          <span class="logo-text">Fresh<span class="logo-accent">Cart</span></span>
        </div>
        <div class="login-card">
          <h1 class="login-title">Create account</h1>
          <form id="signup-form" onsubmit="SignupComponent.handleSignup(event)">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="login-label">Your name</label>
              <input type="text" required class="login-input" placeholder="First and last name" />
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="login-label">Email or mobile phone number</label>
              <input type="email" required class="login-input" />
            </div>
            <div class="form-group" style="margin-bottom: 24px;">
              <label class="login-label">Password</label>
              <input type="password" required class="login-input" placeholder="At least 6 characters" minlength="6" />
            </div>
            <button type="submit" class="btn-ecommerce-primary">
              Continue
            </button>
          </form>
          <div class="login-legal">
            By creating an account, you agree to FreshCart's 
            <a href="#">Conditions of Use</a> and 
            <a href="#">Privacy Notice</a>.
          </div>
        </div>
        <div class="login-divider">
          <span>Already have an account?</span>
        </div>
        <button class="btn-ecommerce-secondary" onclick="App.navigate('login')">
          Sign in
        </button>
      </div>
    `;
  },

  handleSignup(event) {
    event.preventDefault();
    App.showToast('Account created successfully!', 'success');
    App.navigate('home');
  }
};
