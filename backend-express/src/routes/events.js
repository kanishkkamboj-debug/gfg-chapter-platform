const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const getEventsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  event_type: z.string().optional(),
  search: z.string().optional(),
  upcoming: z.string().transform(val => val === 'true').default('true')
});

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  event_type: z.enum(['workshop', 'seminar', 'hackathon', 'contest']),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  image_url: z.string().url().optional()
});

// Get all events with pagination and filtering
router.get('/', validate({ query: getEventsQuerySchema }), async (req, res) => {
  const { page, limit, event_type, search, upcoming } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT e.*, u.username, u.full_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE 1=1';
  const params = [];

  if (upcoming) {
    query += ' AND e.start_date > NOW()';
  }

  if (event_type) {
    params.push(event_type);
    query += ` AND e.event_type = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (e.title ILIKE $${params.length} OR e.description ILIKE $${params.length})`;
  }

  query += ' ORDER BY e.start_date ASC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await pool.query(query, params);
  
  const countResult = await pool.query('SELECT COUNT(*) FROM events WHERE start_date > NOW()');
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

// Get single event
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT e.*, u.username, u.full_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE e.id = $1',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(result.rows[0]);
});

// Create event
router.post('/', authMiddleware, validate({ body: createEventSchema }), async (req, res) => {
  const { title, description, event_type, start_date, end_date, location, capacity, image_url } = req.body;
  const organizer_id = req.user.id;

  const result = await pool.query(
    'INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, image_url, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [title, description, event_type, start_date, end_date, location, capacity, image_url, organizer_id]
  );

  global.broadcastUpdate('events', { type: 'new', data: result.rows[0] });

  res.status(201).json(result.rows[0]);
});

// Register for event
router.post('/:id/register', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const event_id = req.params.id;

  const existing = await pool.query(
    'SELECT * FROM event_registrations WHERE event_id = $1 AND user_id = $2',
    [event_id, user_id]
  );

  if (existing.rows.length > 0) {
    return res.status(400).json({ error: 'Already registered' });
  }

  await pool.query(
    'INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)',
    [event_id, user_id]
  );

  await pool.query(
    'UPDATE events SET registered_count = registered_count + 1 WHERE id = $1',
    [event_id]
  );

  global.broadcastUpdate('events', { type: 'registration', event_id });

  res.json({ success: true });
});

// Unregister from event
router.post('/:id/unregister', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const event_id = req.params.id;

  const deleted = await pool.query(
    'DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2 RETURNING id',
    [event_id, user_id]
  );
  
  if (deleted.rows.length === 0) {
      return res.status(400).json({ error: 'Not registered' });
  }

  await pool.query(
    'UPDATE events SET registered_count = registered_count - 1 WHERE id = $1 AND registered_count > 0',
    [event_id]
  );

  global.broadcastUpdate('events', { type: 'unregistration', event_id });

  res.json({ success: true });
});

module.exports = router;
