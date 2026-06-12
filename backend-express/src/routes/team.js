const express = require('express');
const router = express.Router();
const pool = require('../db');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

const getTeamQuerySchema = z.object({
  department: z.string().optional(),
  role_filter: z.string().optional()
});

const createTeamProfileSchema = z.object({
  role_title: z.string().min(1),
  designation: z.string().optional(),
  expertise: z.string().optional(),
  social_links: z.record(z.string()).optional(),
  bio: z.string().optional(),
  profile_image: z.string().url().optional(),
  department: z.string().optional(),
  year_of_study: z.string().optional()
});

const updateTeamProfileSchema = createTeamProfileSchema.partial();

// Get all team members
router.get('/', validate({ query: getTeamQuerySchema }), async (req, res) => {
  try {
    const { department, role_filter } = req.query;

    let query = 'SELECT tm.*, u.full_name, u.username, u.avatar_url FROM team_members tm JOIN users u ON tm.user_id = u.id WHERE 1=1';
    const params = [];

    if (department) {
      params.push(department);
      query += ` AND tm.department = $${params.length}`;
    }

    if (role_filter) {
      params.push(role_filter);
      query += ` AND tm.role_title = $${params.length}`;
    }

    query += ' ORDER BY tm.created_at ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT tm.*, u.full_name, u.username, u.avatar_url FROM team_members tm JOIN users u ON tm.user_id = u.id WHERE tm.id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create team member profile (Requires Auth)
router.post('/', authMiddleware, requireRole(['admin']), validate({ body: createTeamProfileSchema }), async (req, res) => {
  try {
    const { role_title, designation, expertise, social_links, bio, profile_image, department, year_of_study } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO team_members (user_id, role_title, designation, expertise, social_links, bio, profile_image, department, year_of_study) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [user_id, role_title, designation, expertise, JSON.stringify(social_links || {}), bio, profile_image, department, year_of_study]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update team member (Requires Auth)
router.put('/:id', authMiddleware, requireRole(['admin']), validate({ body: updateTeamProfileSchema }), async (req, res) => {
  try {
    const { role_title, designation, expertise, social_links, bio, profile_image } = req.body;

    const result = await pool.query(
      'UPDATE team_members SET role_title = COALESCE($1, role_title), designation = COALESCE($2, designation), expertise = COALESCE($3, expertise), social_links = COALESCE($4, social_links), bio = COALESCE($5, bio), profile_image = COALESCE($6, profile_image), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [role_title, designation, expertise, social_links ? JSON.stringify(social_links) : null, bio, profile_image, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
