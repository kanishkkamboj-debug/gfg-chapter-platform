const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const getAnnouncementsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  category: z.string().optional(),
  search: z.string().optional()
});

const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  image_url: z.string().url().optional()
});

const updateAnnouncementSchema = createAnnouncementSchema.extend({
  is_pinned: z.boolean().optional()
}).partial();

// Get all announcements with pagination and filtering
router.get('/', validate({ query: getAnnouncementsQuerySchema }), async (req, res) => {
  const { page, limit, category, search } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT a.*, u.username, u.full_name FROM announcements a JOIN users u ON a.author_id = u.id WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND a.category = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (a.title ILIKE $${params.length} OR a.description ILIKE $${params.length})`;
  }

  query += ' ORDER BY a.is_pinned DESC, a.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);
  
  const countResult = await pool.query('SELECT COUNT(*) FROM announcements');
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

// Get single announcement
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT a.*, u.username, u.full_name FROM announcements a JOIN users u ON a.author_id = u.id WHERE a.id = $1',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  res.json(result.rows[0]);
});

// Create announcement (Requires Auth)
router.post('/', authMiddleware, validate({ body: createAnnouncementSchema }), async (req, res) => {
  const { title, description, content, category, priority, image_url } = req.body;
  const author_id = req.user.id;

  const result = await pool.query(
    'INSERT INTO announcements (title, description, content, category, priority, author_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, description, content, category, priority, author_id, image_url]
  );

  global.broadcastUpdate('announcements', { type: 'new', data: result.rows[0] });

  res.status(201).json(result.rows[0]);
});

// Update announcement (Requires Auth)
router.put('/:id', authMiddleware, validate({ body: updateAnnouncementSchema }), async (req, res) => {
  const { title, description, content, category, priority, is_pinned } = req.body;
  
  const result = await pool.query(
    'UPDATE announcements SET title = COALESCE($1, title), description = COALESCE($2, description), content = COALESCE($3, content), category = COALESCE($4, category), priority = COALESCE($5, priority), is_pinned = COALESCE($6, is_pinned), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
    [title, description, content, category, priority, is_pinned, req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  global.broadcastUpdate('announcements', { type: 'update', data: result.rows[0] });

  res.json(result.rows[0]);
});

// Delete announcement (Requires Auth)
router.delete('/:id', authMiddleware, async (req, res) => {
  const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  global.broadcastUpdate('announcements', { type: 'delete', id: req.params.id });

  res.json({ success: true });
});

module.exports = router;
