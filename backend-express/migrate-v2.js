require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      }
);

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Starting migration V2...');
    
    // Add activity_points to users table
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS activity_points INTEGER DEFAULT 0;
    `);
    
    // Create event_attendance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS event_attendance (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `);

    // Create index for fast leaderboard lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_activity_points ON users(activity_points DESC);
    `);

    // Create index for attendance lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
      CREATE INDEX IF NOT EXISTS idx_event_attendance_user_id ON event_attendance(user_id);
    `);
    
    console.log('Migration V2 successful!');
  } catch (err) {
    console.error('Migration V2 failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
