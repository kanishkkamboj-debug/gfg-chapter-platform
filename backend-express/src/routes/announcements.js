const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

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
  try {
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

    let countQuery = 'SELECT COUNT(*) FROM announcements a JOIN users u ON a.author_id = u.id WHERE 1=1';
    if (category) countQuery += ` AND a.category = $1`;
    if (search) countQuery += ` AND (a.title ILIKE $${category ? 2 : 1} OR a.description ILIKE $${category ? 2 : 1})`;

    const countParams = params.slice(0, params.length);

    query += ' ORDER BY a.is_pinned DESC, a.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    const countResult = await pool.query(countQuery, countParams);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const annId = parseInt(req.params.id);
    if (isNaN(annId)) return res.status(400).json({ error: 'Invalid ID format' });

    const result = await pool.query(
      'SELECT a.*, u.username, u.full_name FROM announcements a JOIN users u ON a.author_id = u.id WHERE a.id = $1',
      [annId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create announcement (Requires Auth)
router.post('/', authMiddleware, requireRole(['admin']), validate({ body: createAnnouncementSchema }), async (req, res) => {
  try {
    const { title, description, content, category, priority, image_url } = req.body;
    const author_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO announcements (title, description, content, category, priority, author_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, content, category, priority, author_id, image_url]
    );

    global.broadcastUpdate('announcements', { type: 'new', data: result.rows[0] });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update announcement (Requires Auth)
router.put('/:id', authMiddleware, requireRole(['admin']), validate({ body: updateAnnouncementSchema }), async (req, res) => {
  try {
    const annId = parseInt(req.params.id);
    if (isNaN(annId)) return res.status(400).json({ error: 'Invalid ID format' });

    const { title, description, content, category, priority, is_pinned } = req.body;
    
    const result = await pool.query(
      'UPDATE announcements SET title = COALESCE($1, title), description = COALESCE($2, description), content = COALESCE($3, content), category = COALESCE($4, category), priority = COALESCE($5, priority), is_pinned = COALESCE($6, is_pinned), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, content, category, priority, is_pinned, annId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    global.broadcastUpdate('announcements', { type: 'update', data: result.rows[0] });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete announcement (Requires Auth)
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const annId = parseInt(req.params.id);
    if (isNaN(annId)) return res.status(400).json({ error: 'Invalid ID format' });

    const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING id', [annId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    global.broadcastUpdate('announcements', { type: 'delete', id: req.params.id });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
