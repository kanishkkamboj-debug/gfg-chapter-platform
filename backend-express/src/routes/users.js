const express = require('express');
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
  avatar_url: z.string().url().optional(),
  designation: z.string().optional(),
  skills: z.array(z.string()).optional(),
  social_links: z.record(z.string()).optional(),
  profile_privacy: z.enum(['public', 'private']).optional()
});

// Get current user profile
router.get('/me', async (req, res) => {
  const result = await pool.query('SELECT id, email, username, full_name, role, avatar_url, bio, joined_at, designation, skills, social_links, achievements, profile_privacy FROM users WHERE id = $1', [req.user.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});

// Get public profile by username
router.get('/public/:username', async (req, res) => {
  const result = await pool.query(
    "SELECT id, username, full_name, role, avatar_url, bio, joined_at, designation, skills, social_links, achievements FROM users WHERE username = $1 AND profile_privacy = 'public'", 
    [req.params.username]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found or private' });
  res.json(result.rows[0]);
});

// Get user by ID
router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT id, email, username, full_name, role, avatar_url, bio, joined_at, designation, skills, social_links, achievements, profile_privacy FROM users WHERE id = $1', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});

// Update user profile
router.put('/me', validate({ body: updateUserSchema }), async (req, res) => {
  const { full_name, bio, avatar_url, designation, skills, social_links, profile_privacy } = req.body;

  const result = await pool.query(
    'UPDATE users SET full_name = COALESCE($1, full_name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url), designation = COALESCE($4, designation), skills = COALESCE($5, skills), social_links = COALESCE($6, social_links), profile_privacy = COALESCE($7, profile_privacy), updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING id, email, username, full_name, role, avatar_url, bio, designation, skills, social_links, achievements, profile_privacy',
    [full_name, bio, avatar_url, designation, skills ? JSON.stringify(skills) : null, social_links ? JSON.stringify(social_links) : null, profile_privacy, req.user.id]
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
const roleSchema = z.object({ role: z.enum(['admin', 'faculty', 'coordinator', 'member']) });
router.put('/:id/role', authMiddleware, requireRole(['admin']), validate({ body: roleSchema }), async (req, res) => {
  const { role } = req.body;
  const targetId = parseInt(req.params.id);

  if (role !== 'admin') {
    const targetUserRes = await pool.query("SELECT role FROM users WHERE id = $1", [targetId]);
    if (targetUserRes.rows.length > 0 && targetUserRes.rows[0].role === 'admin') {
      const adminCountRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
      if (parseInt(adminCountRes.rows[0].count) <= 1) {
        return res.status(400).json({ error: 'Cannot demote the last remaining admin' });
      }
    }
  }

  const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, username, full_name, role', [role, targetId]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

// Delete user
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const targetUserRes = await pool.query("SELECT role FROM users WHERE id = $1", [targetId]);
    if (targetUserRes.rows.length > 0 && targetUserRes.rows[0].role === 'admin') {
      const adminCountRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
      if (parseInt(adminCountRes.rows[0].count) <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last remaining admin' });
      }
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [targetId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Cannot delete user (likely due to existing records like event registrations)' });
  }
});

module.exports = router;
