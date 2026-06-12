require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const makeAdmin = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Please provide an email address.');
    console.log('Usage: node make_admin.js <email>');
    process.exit(1);
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *",
      [email]
    );

    if (result.rows.length === 0) {
      console.log(`❌ No user found with email: ${email}`);
    } else {
      console.log(`✅ Success! ${email} is now an ADMIN.`);
      console.log('They can now access the /admin portal.');
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await pool.end();
  }
};

makeAdmin();
