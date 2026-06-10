require('express-async-errors');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events', require('./routes/events'));
app.use('/api/team', require('./routes/team'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/users', authMiddleware, require('./routes/users'));

// WebSocket for live updates
const liveSubscriptions = new Map();

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe') {
        if (!liveSubscriptions.has(data.channel)) {
          liveSubscriptions.set(data.channel, []);
        }
        liveSubscriptions.get(data.channel).push(ws);
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    liveSubscriptions.forEach(clients => {
      const index = clients.indexOf(ws);
      if (index > -1) clients.splice(index, 1);
    });
  });
});

// Broadcast function for live updates
global.broadcastUpdate = (channel, data) => {
  if (liveSubscriptions.has(channel)) {
    liveSubscriptions.get(channel).forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ channel, data }));
      }
    });
  }
};

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]:', err.stack || err);
  
  // Database Errors (PostgreSQL)
  if (err.code) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A record with that value already exists' });
    }
    if (err.code === '23502') {
      return res.status(400).json({ error: 'Missing required database field' });
    }
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Invalid data type provided for database' });
    }
  }

  // Fallback 500
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

module.exports = app;
