document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const formsSection = document.querySelector('.forms-section');
  const logoutButton = document.getElementById('logoutButton');
  const postSection = document.getElementById('postSection');
  const postForm = document.getElementById('postForm');
  const blocks = document.querySelectorAll('.block');
  const messageContainer = document.getElementById('message'); // Footer message container ✅

  const showMessage = (message, isError = false) => {
    if (!messageContainer) {
      console.error('Message container not found!');
      return;
    }
    messageContainer.textContent = message;
    messageContainer.style.color = isError ? 'red' : 'white';
  };

  const updateHeaderUserInfo = (username) => {
    const userInfo = document.getElementById('userInfo');
    const loggedInUser = document.getElementById('loggedInUser');
    if (userInfo && loggedInUser) {
      loggedInUser.textContent = username;
      userInfo.style.display = 'flex';
    }
  };

  const fetchAndDisplayPosts = async () => {
    try {
      const res = await fetch('/posts');
      const posts = await res.json();

      // Clear all blocks
      blocks.forEach(block => block.innerHTML = '');

      if (posts.length === 0) {
        showMessage('No haikus yet. Be the first to write one!');
        return;
      }

      posts.forEach((post, index) => {
        if (index >= blocks.length) return; // Only use existing blocks

        const block = blocks[index];
        block.innerHTML = `
          <div style="padding: 1rem;">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>by ${post.username} on ${new Date(post.created_at).toLocaleString()}</small>
          </div>
        `;
      });
    } catch (err) {
      console.error(err);
      showMessage('Failed to load posts.', true);
    }
  };

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
