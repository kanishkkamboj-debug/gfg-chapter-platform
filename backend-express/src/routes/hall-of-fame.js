const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

const getHofSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10')
});

const createHofSchema = z.object({
  user_id: z.number().int().positive(),
  achievement_title: z.string().min(1),
  achievement_type: z.string().optional(),
  description: z.string().optional(),
  company: z.string().optional()
});

// Get all hall of fame entries
router.get('/', validate({ query: getHofSchema }), async (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  const result = await pool.query(
    'SELECT h.*, u.username, u.full_name, u.avatar_url FROM hall_of_fame h JOIN users u ON h.user_id = u.id ORDER BY h.created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  
  const countResult = await pool.query('SELECT COUNT(*) FROM hall_of_fame');
  const total = parseInt(countResult.rows[0].count);

  res.json({
    data: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

// Create entry (Admin only)
router.post('/', authMiddleware, requireRole(['admin']), validate({ body: createHofSchema }), async (req, res) => {
  const { user_id, achievement_title, achievement_type, description, company } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO hall_of_fame (user_id, achievement_title, achievement_type, description, company) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, achievement_title, achievement_type, description, company]
    );

    global.broadcastUpdate('hall_of_fame', { type: 'new', data: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'User ID does not exist' });
    throw err;
  }
});

// Delete entry (Admin only)
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

  const result = await pool.query('DELETE FROM hall_of_fame WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) return res.status(404).json({ error: 'Entry not found' });

  global.broadcastUpdate('hall_of_fame', { type: 'delete', id: req.params.id });
  res.json({ success: true });
});

module.exports = router;
