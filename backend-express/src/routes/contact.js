const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const submitContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  category: z.string().optional()
});

const getTicketsQuerySchema = z.object({
  status: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10')
});

// Submit contact form (Public)
router.post('/', validate({ body: submitContactSchema }), async (req, res) => {
  const { name, email, subject, message, category } = req.body;

  const result = await pool.query(
    'INSERT INTO support_tickets (name, email, subject, message, category, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, email, subject, message, category || 'general', 'open']
  );

  global.broadcastUpdate('contact', { type: 'new_ticket', data: result.rows[0] });

  res.status(201).json({ success: true, ticket_id: result.rows[0].id });
});

// Get contact/support tickets (admin only)
router.get('/', authMiddleware, validate({ query: getTicketsQuerySchema }), async (req, res) => {
  const { status, page, limit } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM support_tickets WHERE 1=1';
  const params = [];

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }

  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);
  
  const countResult = await pool.query('SELECT COUNT(*) FROM support_tickets');
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

module.exports = router;
