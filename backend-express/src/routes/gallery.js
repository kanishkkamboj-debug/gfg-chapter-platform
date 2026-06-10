const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const getGalleryQuerySchema = z.object({
  category: z.string().optional(),
  event_id: z.string().uuid().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('12')
});

const uploadGalleryItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url(),
  category: z.string().optional(),
  event_id: z.string().uuid().optional()
});

// Get gallery items with filtering
router.get('/', validate({ query: getGalleryQuerySchema }), async (req, res) => {
  const { category, event_id, page, limit } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT gi.*, u.username FROM gallery_items gi JOIN users u ON gi.uploaded_by = u.id WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND gi.category = $${params.length}`;
  }

  if (event_id) {
    params.push(event_id);
    query += ` AND gi.event_id = $${params.length}`;
  }

  query += ' ORDER BY gi.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);
  
  const countResult = await pool.query('SELECT COUNT(*) FROM gallery_items');
  const total = parseInt(countResult.rows[0].count);

  res.json({
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Upload gallery item (Requires Auth)
router.post('/', authMiddleware, validate({ body: uploadGalleryItemSchema }), async (req, res) => {
  const { title, description, image_url, category, event_id } = req.body;
  const uploaded_by = req.user.id;

  const result = await pool.query(
    'INSERT INTO gallery_items (title, description, image_url, category, event_id, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, image_url, category, event_id || null, uploaded_by]
  );

  global.broadcastUpdate('gallery', { type: 'new', data: result.rows[0] });

  res.status(201).json(result.rows[0]);
});

// Delete gallery item (Requires Auth)
router.delete('/:id', authMiddleware, async (req, res) => {
  const result = await pool.query('DELETE FROM gallery_items WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  global.broadcastUpdate('gallery', { type: 'delete', id: req.params.id });

  res.json({ success: true });
});

module.exports = router;
