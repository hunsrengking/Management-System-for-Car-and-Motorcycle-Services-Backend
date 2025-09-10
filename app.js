const express = require('express');
const app = express();
// import MySQL pool
const pool = require('./src/config/db'); 
// Import application routes
const appRoutes = require('./src/routes/app.routes'); 
const cors = require('cors');
// Middleware
app.use(express.json());
app.use(cors());
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our backend service!' });
});

// Import routes
app.use('/api', appRoutes);

// Test DB connection route
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS currentTime');
    res.json({
      message: '✅ Database connected successfully!',
      serverTime: rows[0].currentTime
    });
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

module.exports = app;
