const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const { contactLimiter } = require('../middleware/rateLimiter');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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
router.post('/', contactLimiter, validate({ body: submitContactSchema }), async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;

    const result = await pool.query(
      'INSERT INTO support_tickets (name, email, subject, message, category, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, subject, message, category || 'general', 'open']
    );

    global.broadcastUpdate('contact', { type: 'new_ticket', data: result.rows[0] });

    res.status(201).json({ success: true, ticket_id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contact/support tickets (admin only)
router.get('/', authMiddleware, requireRole(['admin']), validate({ query: getTicketsQuerySchema }), async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reply to a ticket and mark as closed
const replySchema = z.object({
  reply_message: z.string().min(1)
});

router.post('/:id/reply', authMiddleware, requireRole(['admin']), validate({ body: replySchema }), async (req, res) => {
  try {
    const { id } = req.params;
    const { reply_message } = req.body;

    // Get ticket
    const ticketResult = await pool.query('SELECT * FROM support_tickets WHERE id = $1', [id]);
    const ticket = ticketResult.rows[0];

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // Send email
    await transporter.sendMail({
      from: `"GFG Chapter Admin" <${process.env.SMTP_USER || 'admin@gfgchapter.org'}>`,
      to: ticket.email,
      subject: `Re: ${ticket.subject}`,
      text: `Hello ${ticket.name},\n\n${reply_message}\n\n--\nGFG Chapter Admin Team`
    });

    // Mark ticket as resolved/closed
    await pool.query('UPDATE support_tickets SET status = $1 WHERE id = $2', ['closed', id]);

    global.broadcastUpdate('contact', { type: 'ticket_replied', id });

    res.json({ success: true, message: 'Reply sent and ticket closed' });
  } catch (err) {
    console.error('Email/Database error:', err);
    res.status(500).json({ error: 'Failed to process reply' });
  }
});

module.exports = router;
