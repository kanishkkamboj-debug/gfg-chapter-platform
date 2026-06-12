const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  full_name: z.string().min(1),
  master_key: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Register
router.post('/register', authLimiter, validate({ body: registerSchema }), async (req, res) => {
  const { email, password, username, full_name, master_key } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  let role = 'member';
  if (master_key && process.env.ADMIN_MASTER_KEY && master_key === process.env.ADMIN_MASTER_KEY) {
    role = 'admin';
  }
  
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, username, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, full_name, role',
    [email, hashedPassword, username, full_name, role]
  );

  const token = jwt.sign(
    { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    user: result.rows[0]
  });
});

// Login
router.post('/login', authLimiter, validate({ body: loginSchema }), async (req, res) => {
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
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url
    }
  });
});

// Verify token
router.post('/verify', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// OAuth Helper
async function handleOAuthUser(res, email, fullName, providerId, providerCol) {
  let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  let user = result.rows[0];

  if (!user) {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;
    
    result = await pool.query(
      `INSERT INTO users (email, username, full_name, auth_provider, ${providerCol}) 
       VALUES ($1, $2, $3, 'oauth', $4) RETURNING *`,
      [email, username, fullName || baseUsername, providerId]
    );
    user = result.rows[0];
  } else if (!user[providerCol]) {
    result = await pool.query(
      `UPDATE users SET ${providerCol} = $1 WHERE id = $2 RETURNING *`,
      [providerId, user.id]
    );
    user = result.rows[0];
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/dashboard`);
}

// Google OAuth
router.get('/google', authLimiter, (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
  res.redirect(url);
});

router.get('/google/callback', authLimiter, async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    // Get token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
        code
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(400).json({ error: 'OAuth token exchange failed' });

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();

    if (!userData.email) return res.status(400).json({ error: 'No email from Google' });
    
    await handleOAuthUser(res, userData.email, userData.name, userData.id, 'google_id');
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
  }
});

// GitHub OAuth
router.get('/github', authLimiter, (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;
  res.redirect(url);
});

router.get('/github/callback', authLimiter, async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    // Get token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
        code
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(400).json({ error: 'OAuth token exchange failed' });

    // Get user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'Node.js' }
    });
    const userData = await userRes.json();

    // Get emails (GitHub might keep email private, so we need a separate call)
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'Node.js' }
    });
    const emailData = await emailRes.json();
    const primaryEmail = emailData.find(e => e.primary)?.email || emailData[0]?.email;

    if (!primaryEmail) return res.status(400).json({ error: 'No primary email from GitHub' });

    await handleOAuthUser(res, primaryEmail, userData.name || userData.login, userData.id.toString(), 'github_id');
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
  }
});

module.exports = router;
