// server.js

require('dotenv').config(); // If you want to use environment variables in .env
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');

// Import routes
const userRouter = require('./routes/user.route');
const postsRouter = require('./routes/posts.route');

const app = express();

// Basic security headers
app.use(helmet());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if you have HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour session
  }
}));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Use the routers
app.use('/users', userRouter);
app.use('/posts', postsRouter);

// Default route -> serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
