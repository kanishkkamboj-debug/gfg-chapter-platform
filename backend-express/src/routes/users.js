const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const updateUserSchema = z.object({
  full_name: z.string().min(1).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional()
});

// Get current user profile
router.get('/me', async (req, res) => {
  const result = await pool.query('SELECT id, email, username, full_name, role, avatar_url, bio, joined_at FROM users WHERE id = $1', [req.user.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});

// Get user by ID
router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT id, email, username, full_name, role, avatar_url, bio, joined_at FROM users WHERE id = $1', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});

// Update user profile
router.put('/me', validate({ body: updateUserSchema }), async (req, res) => {
  const { full_name, bio, avatar_url } = req.body;

  const result = await pool.query(
    'UPDATE users SET full_name = COALESCE($1, full_name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, username, full_name, role, avatar_url, bio',
    [full_name, bio, avatar_url, req.user.id]
  );

  res.json(result.rows[0]);
});

// ADMIN ROUTES

// Get all users
router.get('/', authMiddleware, requireRole(['admin']), async (req, res) => {
  const result = await pool.query('SELECT id, email, username, full_name, role, auth_provider, joined_at FROM users ORDER BY joined_at DESC');
  res.json({ data: result.rows });
});

// Update user role
const roleSchema = z.object({ role: z.enum(['admin', 'member']) });
router.put('/:id/role', authMiddleware, requireRole(['admin']), validate({ body: roleSchema }), async (req, res) => {
  const { role } = req.body;
  const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, username, full_name, role', [role, req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

// Delete user
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Cannot delete user (likely due to existing records like event registrations)' });
  }
});

module.exports = router;
