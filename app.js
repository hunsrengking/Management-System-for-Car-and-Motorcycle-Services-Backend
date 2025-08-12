const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our backend service!' });
});

module.exports = app;