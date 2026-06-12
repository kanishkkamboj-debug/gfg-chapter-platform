const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

const applyLeaveSchema = z.object({
  event_name: z.string().min(1),
  leave_type: z.enum(['ordinary', 'special']),
  reason: z.string().optional(),
  pdf_url: z.string().url().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'coordinator_approved', 'faculty_approved', 'rejected'])
});

// Get user's duty leaves
router.get('/', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM duty_leaves WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json({ data: result.rows });
});

// Apply for duty leave
router.post('/', authMiddleware, validate({ body: applyLeaveSchema }), async (req, res) => {
  const { event_name, leave_type, reason, pdf_url } = req.body;

  const result = await pool.query(
    'INSERT INTO duty_leaves (user_id, event_name, leave_type, reason, pdf_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [req.user.id, event_name, leave_type, reason, pdf_url || null]
  );

  global.broadcastUpdate('duty_leaves', { type: 'new', data: result.rows[0] });
  res.status(201).json(result.rows[0]);
});

// Admin: Get all duty leaves
router.get('/admin', authMiddleware, requireRole(['admin', 'faculty', 'coordinator']), async (req, res) => {
  const result = await pool.query(
    'SELECT d.*, u.full_name, u.email FROM duty_leaves d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC'
  );
  res.json({ data: result.rows });
});

// Admin: Update status
router.put('/:id/status', authMiddleware, requireRole(['admin', 'faculty', 'coordinator']), validate({ body: updateStatusSchema }), async (req, res) => {
  const { status } = req.body;
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

  const result = await pool.query(
    'UPDATE duty_leaves SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: 'Duty leave not found' });

  global.broadcastUpdate('duty_leaves', { type: 'update', data: result.rows[0] });
  res.json(result.rows[0]);
});

module.exports = router;
