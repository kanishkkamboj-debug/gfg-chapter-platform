# Implementation Guide - GFG Chapter Platform

## Overview

This guide provides step-by-step instructions to get the entire GFG Chapter platform running locally, from database setup through frontend deployment.

## ✅ Completed Components

All of the following have been fully implemented:

### Backend (Express.js)
- [x] Server setup with WebSocket integration
- [x] PostgreSQL connection pooling
- [x] JWT authentication system
- [x] 8 API route modules (auth, announcements, events, team, gallery, resources, contact, users)
- [x] Global WebSocket broadcast system
- [x] Error handling middleware
- [x] CORS configuration
- [x] package.json with all dependencies

### Backend (Python/FastAPI)
- [x] FastAPI application factory
- [x] SQLAlchemy ORM setup
- [x] 3 route modules (search, analytics, notifications)
- [x] Database connection pooling
- [x] CORS middleware
- [x] Error handling
- [x] requirements.txt with all dependencies

### Frontend (React)
- [x] React 18 with Hooks
- [x] React Router v6 setup
- [x] Tailwind CSS configuration with design system colors
- [x] Global state management (AppContext)
- [x] Navigation component with search and auth menu
- [x] 10 page components
- [x] 2 reusable component templates
- [x] 2 detail page components (Announcements, Events)
- [x] Form components (Login, Register, Contact)
- [x] Vite build configuration
- [x] CSS framework with animations and utilities

### Database
- [x] PostgreSQL schema with 11 tables
- [x] Foreign key relationships with CASCADE delete
- [x] Indexes on performance-critical columns
- [x] Seed data support (ready for population)

## 🚀 Quick Start (5 minutes)

### Prerequisites Check
```bash
# Verify Node.js
node --version  # Should be 16+

# Verify npm
npm --version   # Should be 8+

# Verify Python
python --version  # Should be 3.9+

# Verify PostgreSQL
psql --version  # Should be 12+
```

### Step 1: Database Setup (2 min)

```bash
# Create database
createdb gfg_chapter

# Import schema
psql -U postgres -d gfg_chapter -f database/schema.sql

# Verify
psql -U postgres -d gfg_chapter -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"
# Should show: table_count = 11
```

### Step 2: Express Backend (1 min)

```bash
cd backend-express
npm install
npm run dev
# Should show: "Express server running on port 5000"
```

### Step 3: Python Backend (1 min)

Open **new terminal**:
```bash
cd backend-python

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Should show: "Uvicorn running on http://127.0.0.1:8000"
```

### Step 4: React Frontend (1 min)

Open **new terminal**:
```bash
cd frontend
npm install
npm run dev
# Should show: "Local: http://localhost:3000"
```

✅ **All systems running!** Open http://localhost:3000 in your browser.

---

## 📊 Architecture Overview

### Request Flow

```
User Action (React Component)
    ↓
useApp() Hook
    ↓
AppContext API Function
    ↓
Fetch to /api/resource
    ↓
Express Router Handler
    ↓
Database Query (pg pool)
    ↓
JSON Response
    ↓
AppContext setState()
    ↓
Component Re-render
```

### Real-time Updates Flow

```
DB Change (via API)
    ↓
Express broadcastUpdate()
    ↓
WebSocket Server
    ↓
Broadcast to Subscribed Clients
    ↓
Client Receives Message
    ↓
AppContext Updates State
    ↓
Components Re-render
```

### Authentication Flow

```
Login Form Submit
    ↓
POST /api/auth/login
    ↓
Bcrypt Password Compare
    ↓
JWT Token Generation
    ↓
AppContext: setUser() + setToken()
    ↓
localStorage.setItem('token')
    ↓
Include in Auth Header for Future Requests
```

---

## 🗄️ Database Schema

### Core Tables

1. **users** - User accounts (email, password, profile)
2. **announcements** - System announcements with categories
3. **events** - Upcoming events with registration
4. **event_registrations** - Join table for event signups
5. **team_members** - Team profiles with expertise
6. **gallery_items** - Event photos and images
7. **resources** - Learning materials with view tracking
8. **support_tickets** - Contact form submissions
9. **hall_of_fame** - Achievement showcases
10. **search_history** - Track user searches (future analytics)
11. **notifications** - Real-time notification queue

### Key Relationships

```
users (1) ──→ (M) announcements
users (1) ──→ (M) events
users (1) ──→ (M) event_registrations
events (1) ──→ (M) event_registrations
events (1) ──→ (M) gallery_items
resources (M) ──→ (M) users (via favorites - future)
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

```
POST /register
  Input: {email, password, username, full_name}
  Output: {user: {...}, token: "jwt"}
  
POST /login
  Input: {email, password}
  Output: {user: {...}, token: "jwt"}
  
POST /verify
  Headers: Authorization: Bearer {token}
  Output: {valid: true/false}
```

### Announcements (`/api/announcements`)

```
GET /
  Query: page=1, limit=10, category=, search=
  Output: {data: [...], pagination: {page, pages, total}}

GET /:id
  Output: {id, title, description, ...}

POST /
  Headers: Authorization: Bearer {token}
  Input: {title, description, category, priority, link, image_url}
  Output: {id, ...} - WebSocket broadcast

PUT /:id
  Headers: Authorization: Bearer {token}
  Input: Partial fields
  Output: Updated announcement - WebSocket broadcast

DELETE /:id
  Headers: Authorization: Bearer {token}
  Output: {success: true} - WebSocket broadcast
```

### Events (`/api/events`)

```
GET /
  Query: page=1, limit=10, event_type=, search=, upcoming_only=true
  Output: {data: [...], pagination: {...}}

GET /:id
  Output: {id, title, start_date, registered_count, ...}

POST /
  Headers: Authorization: Bearer {token}
  Input: {title, description, location, start_date, end_date, capacity, ...}
  Output: Event object

POST /:id/register
  Headers: Authorization: Bearer {token}
  Output: {registered: true}

POST /:id/unregister
  Headers: Authorization: Bearer {token}
  Output: {unregistered: true}
```

### Team (`/api/team`)

```
GET /
  Query: department=
  Output: [{id, full_name, role_title, expertise, ...}]

GET /:id
  Output: {id, full_name, bio, social_links, ...}

POST /
  Headers: Authorization: Bearer {token}
  Input: {full_name, role_title, designation, expertise, ...}
  Output: Team member object
```

### Gallery (`/api/gallery`)

```
GET /
  Query: page=1, limit=12, category=, event_id=
  Output: {data: [...], pagination: {...}}

POST /
  Headers: Authorization: Bearer {token}, Content-Type: multipart/form-data
  Input: {image_file, title, category, description}
  Output: {id, image_url, ...}

DELETE /:id
  Headers: Authorization: Bearer {token}
  Output: {deleted: true}
```

### Resources (`/api/resources`)

```
GET /
  Query: page=1, limit=10, category=, search=
  Output: {data: [...], pagination: {...}}

POST /
  Headers: Authorization: Bearer {token}
  Input: {title, description, category, resource_type, link, file_url}
  Output: Resource object

POST /:id/view
  Output: {views: 42}
```

### Users (`/api/users`)

```
GET /me
  Headers: Authorization: Bearer {token}
  Output: {id, email, username, full_name, ...}

PUT /me
  Headers: Authorization: Bearer {token}
  Input: Partial {full_name, avatar_url, ...}
  Output: Updated user object
```

### Search (`/api/search` - Python/FastAPI)

```
GET /global?q=term
  Output: {announcements: [...], events: [...], resources: [...], team: [...]}

GET /announcements?q=term
  Output: [...]

GET /events?q=term
  Output: [...]
```

### Analytics (`/api/analytics` - Python/FastAPI)

```
GET /dashboard
  Output: {
    total_users,
    total_events,
    total_announcements,
    events_this_month,
    recent_registrations,
    top_events
  }

GET /user-activity
  Output: [{date, count}]

GET /engagement-metrics
  Output: [{resource, views, clicks}]
```

---

## 🎯 Component Architecture

### Global State (AppContext)

**Authentication State**
```javascript
{
  user: { id, email, username, full_name, role, avatar_url },
  token: "jwt_token_string",
  isAuthenticated: boolean,
  login: async (email, password) => {...},
  register: async (email, password, username, full_name) => {...},
  logout: () => {...}
}
```

**UI State**
```javascript
{
  darkMode: boolean,
  toggleDarkMode: () => {...},
  sidebarOpen: boolean,
  setSidebarOpen: (open) => {...}
}
```

**Data State**
```javascript
{
  announcements: [...],
  events: [...],
  team: [...],
  resources: [...],
  gallery: [...],
  hallOfFame: [...],
  searchResults: {...}
}
```

**Loading & Error**
```javascript
{
  loading: boolean,
  error: string,
  setError: (msg) => {...}
}
```

**API Functions**
```javascript
{
  fetchAnnouncements: (page, category, search) => Promise,
  fetchEvents: (page, eventType, search) => Promise,
  fetchTeam: (department) => Promise,
  fetchResources: (page, category, search) => Promise,
  fetchGallery: (page, category) => Promise,
  globalSearch: (query) => Promise,
  registerForEvent: (eventId) => Promise,
  unregisterFromEvent: (eventId) => Promise,
  submitContactForm: (data) => Promise
}
```

### Page Component Pattern

```javascript
export const PageName = () => {
  // 1. Get data/functions from context
  const { dataArray, fetchData, loading, error } = useApp();
  
  // 2. Local state for pagination/filters
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  
  // 3. Fetch on mount/dependency change
  useEffect(() => {
    fetchData(page, filter);
  }, [page, filter, fetchData]);
  
  // 4. Handle loading/error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (dataArray.length === 0) return <EmptyState />;
  
  // 5. Render content with data from context
  return (
    <div>
      {dataArray.map(item => (
        <ItemComponent key={item.id} data={item} />
      ))}
    </div>
  );
};
```

---

## 🛠️ Development Workflow

### Adding a New Page

1. **Create page component**:
   ```javascript
   // frontend/src/pages/NewPage.jsx
   export const NewPage = () => {
     const { data, fetchData } = useApp();
     
     useEffect(() => {
       fetchData();
     }, [fetchData]);
     
     return <div>{/* JSX */}</div>;
   };
   ```

2. **Add route in App.jsx**:
   ```javascript
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **Add navigation link in Navigation.jsx**:
   ```javascript
   <a href="/new-page" className="...">New Page</a>
   ```

### Adding a New API Endpoint

1. **Create route handler**:
   ```javascript
   // backend-express/src/routes/resource.js
   const express = require('express');
   const router = express.Router();
   const { pool } = require('../db');
   
   router.get('/', async (req, res) => {
     try {
       const result = await pool.query('SELECT * FROM resources');
       res.json(result.rows);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });
   
   module.exports = router;
   ```

2. **Register route in Express server**:
   ```javascript
   // backend-express/src/index.js
   const resourceRouter = require('./routes/resource');
   app.use('/api/resources', resourceRouter);
   ```

3. **Add AppContext API function**:
   ```javascript
   // frontend/src/context/AppContext.jsx
   const fetchResources = async (page = 1) => {
     try {
       setLoading(true);
       const response = await fetch(`${API_URL}/api/resources?page=${page}`);
       const data = await response.json();
       setResources(data);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };
   ```

### Database Modifications

1. **Update schema.sql** with new table/columns
2. **Recreate database**:
   ```bash
   dropdb gfg_chapter
   createdb gfg_chapter
   psql -U postgres -d gfg_chapter -f database/schema.sql
   ```
3. **Update Express route** to query new fields
4. **Update AppContext** if new state needed

---

## 🔒 Security Practices

### Authentication
- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens with expiration (set in .env)
- ✅ Tokens stored in localStorage (frontend)
- ✅ Tokens included in Authorization header (Backend verifies)

### API Protection
- ✅ CORS enabled only for frontend URL
- ✅ Protected routes check Authorization header
- ✅ User can only modify their own data
- ✅ Admin operations validated on backend

### Input Validation
- ✅ Form validation on frontend (React)
- ✅ Input sanitization on backend (prepared statements)
- ✅ Type validation via Pydantic (Python)

### Best Practices
- ❌ Never commit `.env` files
- ❌ Never hardcode API URLs
- ❌ Never trust client-side authorization
- ✅ Always validate on backend
- ✅ Use HTTPS in production
- ✅ Rotate JWT_SECRET regularly

---

## 🧪 Testing Checklist

### Backend Testing
```bash
# Start Express server
cd backend-express && npm run dev

# Test endpoints with curl
curl http://localhost:5000/api/announcements
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","username":"testuser","full_name":"Test User"}'

# Check database
psql -U postgres -d gfg_chapter
SELECT * FROM announcements LIMIT 5;
```

### Frontend Testing
```bash
# Start React dev server
cd frontend && npm run dev

# Check console for errors
# Test pages:
# - Home page loads
# - Navigation works
# - Announcements page displays data
# - Can toggle dark mode
# - Search works
# - Can navigate to detail pages
```

### WebSocket Testing
```bash
# Connect to WebSocket
# In browser console:
const ws = new WebSocket('ws://localhost:5000');
ws.onmessage = (e) => console.log(e.data);

# Should receive: {"type":"connected"}
# After announcing: {"type":"new","channel":"announcements",...}
```

---

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Upload dist/ folder to hosting
```

### Backend (Heroku/Railway/Render)
```bash
# Add Procfile
web: npm start

# Deploy
git push heroku main
```

### Environment Variables (Production)
```
DB_USER=prod_user
DB_PASSWORD=<strong_password>
DB_HOST=prod-db.example.com
JWT_SECRET=<random_40_char_string>
NODE_ENV=production
```

---

## 📝 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check credentials in .env
psql -U postgres -d gfg_chapter
```

### React Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
```bash
# Verify CORS config in Express:
# - Frontend URL must be in corsOptions
# - Check /api/... routes have CORS enabled
```

---

## ✅ Next Steps

1. **Populate Sample Data** - Add test data via API or direct SQL
2. **Setup Email Service** - For notifications and contact form
3. **Add Rate Limiting** - Prevent abuse
4. **Setup Logging** - Morgan middleware for Express
5. **Add Tests** - Jest for React, Supertest for Express
6. **Setup CI/CD** - GitHub Actions for automated testing
7. **Performance Optimization** - Caching, code splitting
8. **Analytics Integration** - Google Analytics, Mixpanel

---

## 📞 Support

For issues:
1. Check `.env` files are properly configured
2. Verify all services are running (Express, Python, PostgreSQL)
3. Check browser console for client-side errors
4. Check terminal output for server errors
5. Check database with `psql`

---

**Happy Coding! 🚀**
