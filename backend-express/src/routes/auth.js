const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const validate = require('../middleware/validate');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  full_name: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Register
router.post('/register', validate({ body: registerSchema }), async (req, res) => {
  const { email, password, username, full_name } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, username, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, full_name',
    [email, hashedPassword, username, full_name, 'member']
  );

  const token = jwt.sign(
    { id: result.rows[0].id, email: result.rows[0].email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    user: result.rows[0],
    token
  });
});

// Login
router.post('/login', validate({ body: loginSchema }), async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url
    },
    token
  });
});

// Verify token
router.post('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
