require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    const hash = await bcrypt.hash('Kk1234@', 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'kanishkkamboj2006@gmail.com']);
    console.log('Password updated successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
