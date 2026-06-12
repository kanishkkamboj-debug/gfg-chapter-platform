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
    console.log('Starting migration...');
    
    // Add columns to users table
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS designation VARCHAR(100),
      ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS profile_privacy VARCHAR(20) DEFAULT 'public';
    `);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
