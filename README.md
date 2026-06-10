# GFG Chapter Platform

A modern, full-stack web application for the GFG (GeeksforGeeks) Student Chapter with a production-grade architecture featuring React frontend, Node.js/Express API, Python/FastAPI analytics, and PostgreSQL database.

## 🎯 Features

### Core Functionality
- **Dynamic Content Management**: Announcements, Events, Resources, Gallery with real-time updates
- **User Authentication**: Secure registration/login with JWT tokens and bcrypt password hashing
- **Event Registration System**: Users can register/unregister for events with capacity tracking
- **Team Directory**: Complete team member profiles with expertise and social links
- **Resource Library**: Categorized learning resources with view tracking
- **Media Gallery**: Image gallery with lightbox modal and category filtering
- **Contact & Support**: Form submission with ticket tracking system
- **Hall of Fame**: Achievement showcase for outstanding community members
- **Member Dashboard**: Personalized dashboard for registered users

### Technical Highlights
- **SPA Routing**: Client-side routing with React Router v6
- **Real-time Updates**: WebSocket integration for live announcements and event changes
- **Search & Analytics**: Global search across entities, engagement metrics, user activity tracking
- **Responsive Design**: Mobile-first UI with Tailwind CSS and design system colors
- **Dark Mode**: Toggle dark/light theme with localStorage persistence
- **Form Validation**: Input validation on all user-submitted forms
- **Error Handling**: Global error states and error boundaries
- **Zero Hardcoding**: All display data driven by APIs and database queries

## 🏗️ Architecture

### Technology Stack

**Frontend**
- React 18 with Hooks
- React Router v6 for SPA routing
- Tailwind CSS with custom design system
- Vite for build tooling
- Material Symbols for icons
- Google Fonts (Space Grotesk, DM Sans, JetBrains Mono)

**Backend - Primary API (Node.js)**
- Express.js server (port 5000)
- PostgreSQL with connection pooling
- JWT authentication with bcrypt
- WebSocket server for real-time updates
- CORS enabled for React frontend
- RESTful API architecture

**Backend - Analytics (Python)**
- FastAPI server (port 8000)
- SQLAlchemy ORM for database queries
- Specialized routes for search, analytics, notifications
- Pydantic for data validation
- CORS configured for React frontend

**Database**
- PostgreSQL with 11 tables
- Foreign key relationships with CASCADE delete
- Indexes on frequently queried columns
- JSONB support for flexible data structures

## 📁 Project Structure

```
gfg-chapter-platform/
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── context/
│   │   │   └── AppContext.jsx        # Global state & API functions
│   │   ├── components/
│   │   │   ├── Navigation.jsx        # Top navbar with search
│   │   │   ├── AnnouncementsList.jsx # Reusable announcements
│   │   │   └── EventsList.jsx        # Reusable events list
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── HallOfFame.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx                   # Router & AppProvider wrapper
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                          # Dev environment (local)
│   └── .env.example                  # Template
│
├── backend-express/                  # Primary API
│   ├── src/
│   │   ├── index.js                  # Server entry, WebSocket setup
│   │   ├── db.js                     # PostgreSQL pool
│   │   └── routes/
│   │       ├── auth.js               # /auth/register, /auth/login, /auth/verify
│   │       ├── announcements.js      # CRUD + filtering + real-time
│   │       ├── events.js             # CRUD + registration
│   │       ├── team.js               # Team directory
│   │       ├── gallery.js            # Image management
│   │       ├── resources.js          # Learning resources
│   │       ├── users.js              # User profiles
│   │       └── contact.js            # Support tickets
│   ├── package.json
│   ├── .env                          # Dev database credentials
│   └── .env.example                  # Template
│
├── backend-python/                   # Analytics & Search API
│   ├── app/
│   │   ├── main.py                   # FastAPI app factory
│   │   ├── db.py                     # SQLAlchemy setup
│   │   └── routes/
│   │       ├── search.py             # Global + entity search
│   │       ├── analytics.py          # Dashboard & metrics
│   │       └── notifications.py      # Real-time notifications
│   ├── requirements.txt
│   ├── .env                          # Database URL
│   └── .env.example                  # Template
│
├── database/
│   └── schema.sql                    # PostgreSQL DDL (11 tables)
│
└── docs/
    ├── README.md (this file)
    ├── ARCHITECTURE.md               # Detailed architecture
    └── API.md                        # Endpoint documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.9+ and pip
- PostgreSQL 12+
- Git

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb gfg_chapter

# Import schema
psql -U postgres -d gfg_chapter -f database/schema.sql
```

### 2. Express Backend Setup

```bash
cd backend-express

# Install dependencies
npm install

# Update .env with your database credentials
# DB_PASSWORD, JWT_SECRET, etc.

# Start development server
npm run dev
# Runs on http://localhost:5000
```

### 3. Python Backend Setup

```bash
cd backend-python

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Update .env with database URL
# DATABASE_URL=postgresql://...

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
# Runs on http://localhost:8000
```

### 4. React Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update .env with API URLs (should already match defaults)
# VITE_API_URL=http://localhost:5000
# VITE_PYTHON_API_URL=http://localhost:8000

# Start development server
npm run dev
# Runs on http://localhost:3000
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new account
- `POST /login` - Login with email/password
- `POST /verify` - Verify JWT token

### Announcements (`/api/announcements`)
- `GET /` - List announcements (paginated, filterable)
- `GET /:id` - Get single announcement
- `POST /` - Create announcement (auth required)
- `PUT /:id` - Update announcement (auth required)
- `DELETE /:id` - Delete announcement (auth required)

### Events (`/api/events`)
- `GET /` - List events (filtered, paginated)
- `GET /:id` - Get event details
- `POST /` - Create event (auth required)
- `POST /:id/register` - Register for event (auth required)
- `POST /:id/unregister` - Unregister from event (auth required)

### Team (`/api/team`)
- `GET /` - List team members (departmental filter)
- `GET /:id` - Get team member profile

### Resources (`/api/resources`)
- `GET /` - List resources (categorized, paginated)
- `GET /:id` - Get resource details
- `POST /` - Create resource (auth required)
- `POST /:id/view` - Increment view count

### Gallery (`/api/gallery`)
- `GET /` - List gallery images (categorized, paginated)
- `POST /` - Upload image (auth required)
- `DELETE /:id` - Delete image (auth required)

### Users (`/api/users`)
- `GET /me` - Get current user profile (auth required)
- `GET /:id` - Get user profile
- `PUT /me` - Update profile (auth required)

### Search (`/api/search`)
- `GET /global?q=term` - Global cross-entity search
- `GET /announcements?q=term` - Search announcements
- `GET /events?q=term` - Search events

### Analytics (`/api/analytics`)
- `GET /dashboard` - Dashboard metrics
- `GET /user-activity` - Daily activity stats
- `GET /engagement-metrics` - Resource engagement

## 🎨 Design System

### Color Palette
- **Primary**: #7ddb8a (mint green)
- **Accent Cyan**: #00D4FF
- **Accent Purple**: #d4a5ff
- **Background**: #10150f
- **Surface**: #1a1f1a
- **Text**: #e4e6e3 with opacity variants

### Typography
- **Display**: Space Grotesk (headings)
- **Body**: DM Sans (content)
- **Code**: JetBrains Mono

### Spacing (4px base)
- Small: 16px, Medium: 24px, Large: 48px, XL: 80px

### Components
- Glassmorphic cards with border opacity
- Rounded corners (0.25rem default, 0.5rem lg, 0.75rem xl)
- Material Symbols Outlined icons

## 🔐 Authentication Flow

1. User submits registration/login form on React frontend
2. AppContext calls `login(email, password)` or `register(...)`
3. Request sent to `/api/auth/login` or `/api/auth/register`
4. Express backend validates credentials, returns JWT token + user data
5. AppContext stores token in localStorage and updates `user` state
6. Token included in Authorization header for all subsequent requests
7. Protected routes check `isAuthenticated` before rendering

## 🔄 Real-time Updates

- **WebSocket Connection**: Client connects on app load
- **Channels**: `announcements`, `events`, `gallery`
- **Message Format**: `{type: 'new'|'update'|'delete', data: {...}}`
- **Broadcast**: Express backend pushes updates to all connected clients
- **AppContext Update**: Client-side handlers merge new data into state

## 📊 Data Flow

```
User Interaction (React)
    ↓
AppContext API Function
    ↓
Fetch Request to Express/FastAPI
    ↓
Database Query
    ↓
JSON Response
    ↓
AppContext State Update
    ↓
Component Re-render
```

## 🧪 Development Workflow

### Adding a New Page

1. Create page component in `frontend/src/pages/PageName.jsx`
2. Import page in `frontend/src/App.jsx`
3. Add route: `<Route path="/page-name" element={<PageName />} />`
4. Add navigation link in Navigation component
5. Use `useApp()` hook for data and functions

### Adding a New API Endpoint

1. Create route file in `backend-express/src/routes/resource.js`
2. Export router with Express route handlers
3. Import and use in `backend-express/src/index.js`:
   ```javascript
   const resourceRouter = require('./routes/resource');
   app.use('/api/resource', resourceRouter);
   ```
4. Add corresponding AppContext API function in `frontend/src/context/AppContext.jsx`

### Database Changes

1. Update `database/schema.sql`
2. Drop and recreate database:
   ```bash
   dropdb gfg_chapter
   createdb gfg_chapter
   psql -U postgres -d gfg_chapter -f database/schema.sql
   ```

## 🐛 Debugging

### Frontend
- React DevTools browser extension
- Vite debug info in console
- Check AppContext state via `useApp()` hook
- Network tab for API requests

### Backend
- Console logs in Express routes
- `nodemon` auto-restarts on changes
- Check database with `psql` CLI

### Database
```bash
# Connect to database
psql -U postgres -d gfg_chapter

# List tables
\dt

# View schema for specific table
\d announcements

# Query data
SELECT * FROM announcements LIMIT 5;
```

## 📦 Build & Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
# Output: dist/ folder
# Deploy to Vercel, Netlify, or static hosting
```

### Backend Production Build
```bash
# Use process manager like PM2
npm install -g pm2
pm2 start backend-express/src/index.js
pm2 start "python -m uvicorn app.main:app" --name fastapi
```

### Environment Variables (Production)
Update `.env` files with production values:
- Real database credentials
- Strong JWT_SECRET
- API URLs pointing to production servers

## 📝 Common Commands

```bash
# Frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build

# Backend Express
npm run dev      # Start with nodemon
npm start        # Start without auto-reload

# Backend Python
uvicorn app.main:app --reload  # Dev
uvicorn app.main:app           # Production
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is part of the GFG Chapter platform.

## 🆘 Support

For issues or questions:
- Email: contact@gfgchapter.com
- Open an issue on the repository
- Contact the team via the website's contact form

---

**Happy Coding! 🚀**
