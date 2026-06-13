const nodemailer = require('nodemailer');
const pool = require('../db');

// Setup transporter
let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Sends an email blast to all registered users.
 * @param {string} subject 
 * @param {string} htmlBody 
 */
async function sendEmailBlast(subject, htmlBody) {
  try {
    // Fetch all user emails
    const result = await pool.query('SELECT email FROM users');
    const emails = result.rows.map(row => row.email);

    if (emails.length === 0) return;

    if (!transporter) {
      console.log('================= EMAIL BLAST (Simulation) =================');
      console.log(`To: ${emails.length} users`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:\n${htmlBody}`);
      console.log('===========================================================');
      console.log('NOTE: Setup SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to send real emails.');
      return;
    }

    // Send emails in batches or BCC to avoid exposing emails and hitting limits
    const mailOptions = {
      from: `"GeeksforGeeks Chapter" <${process.env.SMTP_USER || 'noreply@gfgchapter.com'}>`,
      to: process.env.SMTP_USER || 'noreply@gfgchapter.com', // To ourselves
      bcc: emails, // BCC all users
      subject: subject,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email blast sent! Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('Failed to send email blast:', error);
  }
}

module.exports = { sendEmailBlast };
