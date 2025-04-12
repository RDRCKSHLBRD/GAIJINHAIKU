document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const formsSection = document.querySelector('.forms-section');
  const logoutButton = document.getElementById('logoutButton');
  const postSection = document.getElementById('postSection');
  const postForm = document.getElementById('postForm');
  const postsContainer = document.getElementById('postsContainer');

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

  const updateHeaderUserInfo = (username) => {
    const userInfo = document.getElementById('userInfo');
    const loggedInUser = document.getElementById('loggedInUser');
    if (userInfo && loggedInUser) {
      loggedInUser.textContent = username;
      userInfo.style.display = 'flex';
    }
  };

  fetchAndDisplayPosts

  const onLoginSuccess = (username) => {
    showMessage(`Welcome, ${username}! You are now logged in.`);
    if (formsSection) formsSection.style.display = 'none';
    if (postSection) postSection.style.display = 'block';
    updateHeaderUserInfo(username);
    fetchAndDisplayPosts();
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

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        const res = await fetch('/users/logout', { method: 'POST' });
        if (res.ok) {
          location.reload();
        } else {
          showMessage('Logout failed', true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Logout request failed.', true);
      }
    });
  }

  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(postForm);
      const title = formData.get('title');
      const content = formData.get('content');

      try {
        const res = await fetch('/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        });
        const data = await res.json();
        if (res.ok) {
          showMessage('Haiku posted successfully!');
          postForm.reset();
          fetchAndDisplayPosts();
        } else {
          showMessage(data.error, true);
        }
      } catch (err) {
        console.error(err);
        showMessage('Post request failed.', true);
      }
    });
  }

  // Initial fetch of posts (for guests)
  fetchAndDisplayPosts();
});
