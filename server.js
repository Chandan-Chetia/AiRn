const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔗 PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'world',
  password: 'chandanchetia123',
  port: 5432,
});


// 🔐 Sign Up
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    res.json({ msg: '✅ User registered!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: '❌ Username already exists or DB error.' });
  }
});

// 🔓 Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: '❌ User not found.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ msg: '🎉 Login successful!' });
    } else {
      res.status(400).json({ msg: '❌ Wrong password.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '❌ Server error.' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
