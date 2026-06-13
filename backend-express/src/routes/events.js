const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const { sendEmailBlast } = require('../utils/emailService');

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
  image_url: z.string().url().optional(),
  send_email: z.boolean().optional()
});

const updateEventSchema = createEventSchema.partial();

// Get all events with pagination and filtering
router.get('/', validate({ query: getEventsQuerySchema }), async (req, res) => {
  try {
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

    let countQuery = 'SELECT COUNT(*) FROM events e JOIN users u ON e.organizer_id = u.id WHERE 1=1';
    if (upcoming) countQuery += ' AND e.start_date > NOW()';
    if (event_type) countQuery += ` AND e.event_type = $1`;
    if (search) countQuery += ` AND (e.title ILIKE $${event_type ? 2 : 1} OR e.description ILIKE $${event_type ? 2 : 1})`;
    
    const countParams = params.slice(0, params.length);

    query += ' ORDER BY e.start_date ASC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
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

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) return res.status(400).json({ error: 'Invalid event ID format' });

    const result = await pool.query(
      'SELECT e.*, u.username, u.full_name FROM events e JOIN users u ON e.organizer_id = u.id WHERE e.id = $1',
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event
router.post('/', authMiddleware, requireRole(['admin']), validate({ body: createEventSchema }), async (req, res) => {
  try {
    const { title, description, event_type, start_date, end_date, location, capacity, image_url, send_email } = req.body;
    const organizer_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, image_url, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, description, event_type, start_date, end_date, location, capacity, image_url, organizer_id]
    );

    global.broadcastUpdate('events', { type: 'new', data: result.rows[0] });

    if (send_email) {
      sendEmailBlast(
        `🎉 New Event: ${title}`,
        `<h2>${title}</h2><p>${description}</p><p><strong>When:</strong> ${new Date(start_date).toLocaleString()}</p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/events/${result.rows[0].id}">Register now!</a>`
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register for event
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const event_id = parseInt(req.params.id);
    if (isNaN(event_id)) return res.status(400).json({ error: 'Invalid event ID format' });
    const user_id = req.user.id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Lock the event row for update
      const eventRes = await client.query('SELECT capacity, registered_count FROM events WHERE id = $1 FOR UPDATE', [event_id]);
      if (eventRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Event not found' });
      }
      const event = eventRes.rows[0];

      // 2. Check capacity
      if (event.capacity !== null && event.registered_count >= event.capacity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Event is at full capacity' });
      }

      // 3. Check existing registration
      const existing = await client.query('SELECT * FROM event_registrations WHERE event_id = $1 AND user_id = $2', [event_id, user_id]);
      if (existing.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Already registered' });
      }

      // 4. Insert registration & update count
      await client.query('INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)', [event_id, user_id]);
      await client.query('UPDATE events SET registered_count = registered_count + 1 WHERE id = $1', [event_id]);

      await client.query('COMMIT');

      global.broadcastUpdate('events', { type: 'registration', event_id });
      res.json({ success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server/Database error' });
  }
});

// Unregister from event
router.post('/:id/unregister', authMiddleware, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) return res.status(400).json({ error: 'Invalid event ID format' });

    const user_id = req.user.id;
    const event_id = eventId;

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event
router.put('/:id', authMiddleware, requireRole(['admin']), validate({ body: updateEventSchema }), async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) return res.status(400).json({ error: 'Invalid event ID format' });

    const { title, description, event_type, start_date, end_date, location, capacity, image_url } = req.body;

    const result = await pool.query(
      'UPDATE events SET title = COALESCE($1, title), description = COALESCE($2, description), event_type = COALESCE($3, event_type), start_date = COALESCE($4, start_date), end_date = COALESCE($5, end_date), location = COALESCE($6, location), capacity = COALESCE($7, capacity), image_url = COALESCE($8, image_url), updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [title, description, event_type, start_date, end_date, location, capacity, image_url, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    global.broadcastUpdate('events', { type: 'update', data: result.rows[0] });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) return res.status(400).json({ error: 'Invalid event ID format' });

    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    global.broadcastUpdate('events', { type: 'delete', id: eventId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
