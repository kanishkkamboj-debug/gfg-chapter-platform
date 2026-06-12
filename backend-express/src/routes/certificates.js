const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

const issueCertificateSchema = z.object({
  user_id: z.number().int().positive(),
  event_id: z.number().int().positive().optional(),
  certificate_type: z.enum(['participation', 'achievement']),
  certificate_url: z.string().url()
});

const updateCertificateSchema = issueCertificateSchema.partial();

// Get user's certificates
router.get('/', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT c.*, e.title as event_title FROM certificates c LEFT JOIN events e ON c.event_id = e.id WHERE c.user_id = $1 ORDER BY c.issued_at DESC',
    [req.user.id]
  );
  res.json({ data: result.rows });
});

// Admin: Get all certificates
router.get('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  const result = await pool.query(
    'SELECT c.*, u.full_name, u.email, e.title as event_title FROM certificates c JOIN users u ON c.user_id = u.id LEFT JOIN events e ON c.event_id = e.id ORDER BY c.issued_at DESC'
  );
  res.json({ data: result.rows });
});

// Admin: Issue a new certificate
router.post('/', authMiddleware, requireRole(['admin']), validate({ body: issueCertificateSchema }), async (req, res) => {
  const { user_id, event_id, certificate_type, certificate_url } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO certificates (user_id, event_id, certificate_type, certificate_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, event_id || null, certificate_type, certificate_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'User ID or Event ID does not exist' });
    throw err;
  }
});

// Admin: Update a certificate
router.put('/:id', authMiddleware, requireRole(['admin']), validate({ body: updateCertificateSchema }), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

  const { user_id, event_id, certificate_type, certificate_url } = req.body;

  try {
    const result = await pool.query(
      'UPDATE certificates SET user_id = COALESCE($1, user_id), event_id = COALESCE($2, event_id), certificate_type = COALESCE($3, certificate_type), certificate_url = COALESCE($4, certificate_url), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [user_id, event_id || null, certificate_type, certificate_url, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Certificate not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'User ID or Event ID does not exist' });
    throw err;
  }
});

// Admin: Delete a certificate
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });

  const result = await pool.query('DELETE FROM certificates WHERE id = $1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Certificate not found' });

  res.json({ success: true });
});

module.exports = router;
