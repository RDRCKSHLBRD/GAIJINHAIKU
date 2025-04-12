document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

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
          showMessage(`Signup successful! Welcome, ${data.user.username}`);
          signupForm.reset();
        } else {
          showMessage(data.error, true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Signup request failed.', true);
      }
    });
  }

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
          showMessage(`Login successful! Welcome back, ${data.user.username}`);
          loginForm.reset();
        } else {
          showMessage(data.error, true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Login request failed.', true);
      }
    });
  }
});
