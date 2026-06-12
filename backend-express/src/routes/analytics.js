const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

router.get('/', authMiddleware, requireRole(['admin', 'faculty', 'coordinator']), async (req, res) => {
  try {
    const totalMembers = await pool.query("SELECT COUNT(*) FROM users");
    const activeMembers = await pool.query("SELECT COUNT(*) FROM users WHERE updated_at > NOW() - INTERVAL '30 days'");
    const totalEvents = await pool.query("SELECT COUNT(*) FROM events");
    const pendingLeaves = await pool.query("SELECT COUNT(*) FROM duty_leaves WHERE status = 'pending'");
    const totalResources = await pool.query("SELECT COUNT(*) FROM resources");
    
    // Attempt to aggregate volunteer metrics if table has data
    const volunteerMetrics = await pool.query("SELECT SUM(volunteer_hours) as total_hours, SUM(tasks_completed) as total_tasks FROM volunteer_metrics");

    res.json({
      total_members: parseInt(totalMembers.rows[0].count || 0),
      active_members: parseInt(activeMembers.rows[0].count || 0),
      total_events: parseInt(totalEvents.rows[0].count || 0),
      pending_leaves: parseInt(pendingLeaves.rows[0].count || 0),
      total_resources: parseInt(totalResources.rows[0].count || 0),
      volunteer_hours: parseFloat(volunteerMetrics.rows[0].total_hours || 0),
      tasks_completed: parseInt(volunteerMetrics.rows[0].total_tasks || 0)
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ error: 'Failed to aggregate analytics' });
  }
});

router.get('/historical', authMiddleware, requireRole(['admin', 'faculty', 'coordinator']), async (req, res) => {
  try {
    // Generate the last 7 days of dates in SQL
    const historicalQuery = `
      WITH dates AS (
        SELECT generate_series(
          current_date - interval '6 days',
          current_date,
          '1 day'::interval
        )::date as day
      ),
      user_counts AS (
        SELECT DATE(joined_at) as day, COUNT(*) as users_count
        FROM users
        WHERE joined_at >= current_date - interval '6 days'
        GROUP BY DATE(joined_at)
      ),
      ticket_counts AS (
        SELECT DATE(created_at) as day, COUNT(*) as transmissions_count
        FROM support_tickets
        WHERE created_at >= current_date - interval '6 days'
        GROUP BY DATE(created_at)
      )
      SELECT 
        to_char(d.day, 'Dy') as name,
        COALESCE(u.users_count, 0) as users,
        COALESCE(t.transmissions_count, 0) as transmissions
      FROM dates d
      LEFT JOIN user_counts u ON d.day = u.day
      LEFT JOIN ticket_counts t ON d.day = t.day
      ORDER BY d.day ASC;
    `;
    
    const result = await pool.query(historicalQuery);
    res.json(result.rows);
  } catch (err) {
    console.error('Historical Analytics Error:', err);
    res.status(500).json({ error: 'Failed to fetch historical analytics' });
  }
});

module.exports = router;
