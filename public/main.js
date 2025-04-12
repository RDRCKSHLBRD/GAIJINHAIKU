// main.js

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

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
          alert(`Signup successful for user: ${data.user.username}`);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (err) {
        console.error(err);
        alert('Signup request failed.');
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
          alert(`Login successful! Hello, ${data.user.username}`);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (err) {
        console.error(err);
        alert('Login request failed.');
      }
    });
  }
});
