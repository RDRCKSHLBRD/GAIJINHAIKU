document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const formsSection = document.querySelector('.forms-section');
  const logoutButton = document.getElementById('logoutButton');

  // Helper: Show message
  const showMessage = (message, isError = false) => {
    let messageContainer = document.getElementById('message');
    if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.id = 'message';
      document.body.prepend(messageContainer);
    }
    messageContainer.textContent = message;
    messageContainer.style.color = isError ? 'red' : 'green';
  };

  // Helper: Update header with username
  const updateHeaderUserInfo = (username) => {
    const userInfo = document.getElementById('userInfo');
    const loggedInUser = document.getElementById('loggedInUser');
    if (userInfo && loggedInUser) {
      loggedInUser.textContent = username;
      userInfo.style.display = 'flex';
    }
  };

  // On successful login/signup
  const onLoginSuccess = (username) => {
    showMessage(`Welcome, ${username}! You are now logged in.`);
    if (formsSection) formsSection.style.display = 'none';
    updateHeaderUserInfo(username);
  };

  // Signup form submit
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(signupForm);
      const username = formData.get('username');
      const password = formData.get('password');

      try {
        const res = await fetch('/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          onLoginSuccess(data.user.username);
        } else {
          showMessage(data.error, true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Signup request failed.', true);
      }
    });
  }

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const username = formData.get('username');
      const password = formData.get('password');

      try {
        const res = await fetch('/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          onLoginSuccess(data.user.username);
        } else {
          showMessage(data.error, true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Login request failed.', true);
      }
    });
  }

  // Logout button click
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        const res = await fetch('/users/logout', { method: 'POST' });
        if (res.ok) {
          location.reload(); // Reload to reset state
        } else {
          showMessage('Logout failed', true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Logout request failed.', true);
      }
    });
  }
});
