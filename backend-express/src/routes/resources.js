const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

const getResourcesQuerySchema = z.object({
  category: z.string().optional(),
  resource_type: z.string().optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10')
});

const createResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  resource_type: z.string().optional(),
  link: z.string().url().optional(),
  file_url: z.string().url().optional()
});

// Get all resources with filtering
router.get('/', validate({ query: getResourcesQuerySchema }), async (req, res) => {
  const { category, resource_type, search, page, limit } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT r.*, u.username FROM resources r JOIN users u ON r.created_by = u.id WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND r.category = $${params.length}`;
  }

  if (resource_type) {
    params.push(resource_type);
    query += ` AND r.resource_type = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (r.title ILIKE $${params.length} OR r.description ILIKE $${params.length})`;
  }

  query += ' ORDER BY r.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);
  
  const countResult = await pool.query('SELECT COUNT(*) FROM resources');
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

// Create resource (Requires Auth)
router.post('/', authMiddleware, requireRole(['admin']), validate({ body: createResourceSchema }), async (req, res) => {
  const { title, description, category, resource_type, link, file_url } = req.body;
  const created_by = req.user.id;

  const result = await pool.query(
    'INSERT INTO resources (title, description, category, resource_type, link, file_url, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, description, category, resource_type, link, file_url, created_by]
  );

  global.broadcastUpdate('resources', { type: 'new', data: result.rows[0] });

  res.status(201).json(result.rows[0]);
});

// Update resource views
router.post('/:id/view', async (req, res) => {
  const result = await pool.query(
    'UPDATE resources SET views = views + 1 WHERE id = $1 RETURNING *',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  res.json(result.rows[0]);
});

// Delete resource (Requires Auth)
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  const resId = parseInt(req.params.id);
  if (isNaN(resId)) return res.status(400).json({ error: 'Invalid ID format' });

  const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING id', [resId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  global.broadcastUpdate('resources', { type: 'delete', id: req.params.id });
  res.json({ success: true });
});

module.exports = router;
