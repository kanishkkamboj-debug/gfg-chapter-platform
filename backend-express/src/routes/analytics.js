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

module.exports = router;
