# Complete File Structure & Documentation

## Full Project Directory Tree

```
gfg-chapter-platform/
│
├── README.md                          # Main documentation with tech stack & features
├── IMPLEMENTATION_GUIDE.md            # Step-by-step setup and development guide
├── ARCHITECTURE.md                    # Detailed architecture documentation
├── setup.sh                           # Automated setup script
│
├── database/
│   └── schema.sql                     # PostgreSQL DDL for all 11 tables
│
├── backend-express/                   # Node.js/Express API Server (Port 5000)
│   ├── src/
│   │   ├── index.js                   # Server entry, WebSocket setup, middleware
│   │   ├── db.js                      # PostgreSQL connection pool initialization
│   │   └── routes/
│   │       ├── auth.js                # POST /register, /login, /verify
│   │       ├── announcements.js       # GET, POST, PUT, DELETE, filtering
│   │       ├── events.js              # CRUD + registration endpoints
│   │       ├── team.js                # Team directory and profiles
│   │       ├── gallery.js             # Image management
│   │       ├── resources.js           # Learning resources with view tracking
│   │       ├── users.js               # User profile management
│   │       └── contact.js             # Support ticket submission
│   ├── package.json                   # Node dependencies
│   ├── .env.example                   # Environment variables template
│   ├── .env                           # Development environment (local)
│   └── .gitignore                     # Git ignore patterns
│
├── backend-python/                    # FastAPI Server (Port 8000)
│   ├── app/
│   │   ├── main.py                    # FastAPI app factory and CORS setup
│   │   ├── db.py                      # SQLAlchemy database setup
│   │   ├── models.py                  # SQLAlchemy ORM models
│   │   └── routes/
│   │       ├── search.py              # Global/entity search endpoints
│   │       ├── analytics.py           # Dashboard metrics & engagement stats
│   │       └── notifications.py       # Real-time notifications
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                   # Environment variables template
│   ├── .env                           # Development environment (local)
│   ├── venv/                          # Python virtual environment
│   └── .gitignore                     # Git ignore patterns
│
├── frontend/                          # React SPA (Port 3000)
│   ├── src/
│   │   ├── App.jsx                    # Router setup and main layout
│   │   ├── main.jsx                   # React entry point
│   │   ├── index.css                  # Global styles and animations
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.jsx         # Global state + all API functions
│   │   │
│   │   ├── components/
│   │   │   ├── Navigation.jsx         # Top navbar with user menu & search
│   │   │   ├── AnnouncementsList.jsx  # Reusable announcements component
│   │   │   └── EventsList.jsx         # Reusable events component
│   │   │
│   │   └── pages/
│   │       ├── Home.jsx               # Landing page with previews
│   │       ├── Announcements.jsx      # Announcements list page
│   │       ├── AnnouncementDetail.jsx # Single announcement detail
│   │       ├── Events.jsx             # Events list page
│   │       ├── EventDetail.jsx        # Single event detail + registration
│   │       ├── Team.jsx               # Team directory page
│   │       ├── Resources.jsx          # Learning resources page
│   │       ├── Gallery.jsx            # Image gallery with lightbox
│   │       ├── HallOfFame.jsx         # Achievement showcase
│   │       ├── Contact.jsx            # Contact form page
│   │       ├── Login.jsx              # Login page
│   │       ├── Register.jsx           # Registration page
│   │       └── Dashboard.jsx          # Protected member dashboard
│   │
│   ├── index.html                     # HTML entry point with font links
│   ├── package.json                   # Node dependencies
│   ├── vite.config.js                 # Vite build configuration
│   ├── tailwind.config.js             # Tailwind CSS with design system
│   ├── postcss.config.js              # PostCSS plugins
│   ├── .env.example                   # Environment variables template
│   ├── .env                           # Development environment (local)
│   ├── .gitignore                     # Git ignore patterns
│   └── node_modules/                  # Dependencies (generated)
│
└── docs/                              # Additional documentation
    ├── API.md                         # Detailed API endpoint reference
    ├── DEPLOYMENT.md                  # Production deployment guide
    └── TROUBLESHOOTING.md             # Common issues and solutions
```

---

## Key Files Explained

### Backend Express

**index.js** (Server Entry)
- Express app initialization
- Middleware setup (CORS, JSON parser)
- WebSocket server creation
- Route registration
- Error handling
- Server startup on port 5000

**db.js** (Database Connection)
- PostgreSQL connection pool
- Configuration from .env variables
- Connection error handling

**routes/*.js** (API Endpoints)
- Each file exports Express router
- Database query logic
- Authentication checks (where needed)
- WebSocket broadcasts for real-time updates
- Error handling and validation

### Backend Python

**main.py** (FastAPI App)
- FastAPI app initialization
- CORS middleware configuration
- Database engine setup
- SessionLocal dependency for routes
- Health check endpoint
- Route imports

**routes/*.js** (FastAPI Endpoints)
- Database queries via SQLAlchemy
- Pydantic validation
- Response formatting
- Error handling

### Frontend React

**App.jsx** (Main Component)
- BrowserRouter setup
- Route definitions (11 routes)
- ProtectedRoute wrapper
- AppProvider wrapping
- Footer component
- Dark mode CSS class

**AppContext.jsx** (Global State)
- Auth state: user, token, isAuthenticated
- UI state: darkMode, sidebarOpen
- Data state: announcements, events, team, etc.
- Loading & error state
- API functions: fetchAnnouncements, fetchEvents, etc.
- localStorage for token persistence

**pages/*.jsx** (Page Components)
- Each page follows standard pattern:
  1. useApp() hook for data
  2. useEffect for data fetching
  3. Loading/error states
  4. Render with data from context
  5. Dynamic links to related pages

**components/*.jsx** (Reusable Components)
- Navigation: Dynamic based on auth status
- AnnouncementsList: With pagination & filtering
- EventsList: With registration functionality

### Database

**schema.sql** (PostgreSQL DDL)
```sql
-- 11 tables:
1. users                    -- User accounts & profiles
2. announcements            -- System announcements
3. events                   -- Upcoming events
4. event_registrations      -- Event sign-ups
5. team_members             -- Team profiles
6. gallery_items            -- Event photos
7. resources                -- Learning materials
8. support_tickets          -- Contact submissions
9. hall_of_fame             -- Achievements
10. search_history          -- Search queries
11. notifications           -- Notification queue

-- Indexes on:
- users.email (UNIQUE)
- announcements.author_id, created_at
- events.start_date, event_type
- event_registrations.event_id, user_id
- gallery_items.event_id, category
- resources.category, created_at
```

---

## File Relationships

### Data Flow
```
User → React Component → AppContext → Fetch → Express/Python
                                         ↓
                                    PostgreSQL
```

### Component Tree
```
App (BrowserRouter)
├── Navigation (Dynamic)
├── Routes
│   ├── Home
│   │   ├── Hero
│   │   ├── AnnouncementsList (preview)
│   │   └── EventsList (preview)
│   ├── Announcements
│   │   └── AnnouncementsList (full)
│   ├── AnnouncementDetail
│   │   └── Single announcement + links
│   ├── Events
│   │   └── EventsList (full)
│   ├── EventDetail
│   │   └── Single event + registration
│   ├── Team
│   │   └── Team cards
│   ├── Resources
│   │   └── Resource cards + filters
│   ├── Gallery
│   │   └── Image grid + lightbox
│   ├── HallOfFame
│   │   └── Achievement entries
│   ├── Contact
│   │   └── Contact form
│   ├── Login
│   │   └── Login form
│   ├── Register
│   │   └── Registration form
│   └── Dashboard (Protected)
│       └── User dashboard
└── Footer
```

### API Endpoint Organization
```
Express Server (/api)
├── /auth              → auth.js
├── /announcements     → announcements.js
├── /events            → events.js
├── /team              → team.js
├── /gallery           → gallery.js
├── /resources         → resources.js
├── /users             → users.js
└── /contact           → contact.js

Python Server (/api)
├── /search            → search.py
├── /analytics         → analytics.py
└── /notifications     → notifications.py
```

---

## Dependencies Summary

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

### Backend Express (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.0",
    "jsonwebtoken": "^9.1.0",
    "bcrypt": "^5.1.0",
    "ws": "^8.13.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Backend Python (requirements.txt)
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic==2.4.2
cors-middleware==1.0.0
```

---

## Configuration Files

### .env Files (All Three Services)

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
VITE_PYTHON_API_URL=http://localhost:8000
```

**backend-express/.env**
```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gfg_chapter
JWT_SECRET=dev_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

**backend-python/.env**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gfg_chapter
PYTHONUNBUFFERED=1
PORT=8000
```

### Build Configurations

**frontend/vite.config.js**
```
- Port: 3000
- Entry: src/main.jsx
- Build output: dist/
- Proxy: /api → http://localhost:5000
```

**frontend/tailwind.config.js**
```
- Content: src/**/*.{js,jsx}
- Design system colors (40+ custom)
- Typography: Space Grotesk, DM Sans, JetBrains Mono
- Spacing: 4px base unit
- Border radius: 0.25rem default
```

---

## Environment Variables Quick Reference

| Variable | Service | Purpose | Example |
|----------|---------|---------|---------|
| DB_USER | Express | PostgreSQL username | postgres |
| DB_PASSWORD | Express | PostgreSQL password | ****** |
| DB_HOST | Both | Database host | localhost |
| DB_PORT | Express | Database port | 5432 |
| DB_NAME | Express | Database name | gfg_chapter |
| JWT_SECRET | Express | JWT signing key | xxxxxxx |
| PORT | Both | Server port | 5000/8000 |
| NODE_ENV | Express | Environment type | development |
| DATABASE_URL | Python | Full connection string | postgresql://... |
| VITE_API_URL | Frontend | Express server URL | http://localhost:5000 |
| VITE_PYTHON_API_URL | Frontend | Python server URL | http://localhost:8000 |

---

## Running Services (Quick Reference)

```bash
# Terminal 1: Database
psql -U postgres -d gfg_chapter

# Terminal 2: Express
cd backend-express && npm run dev

# Terminal 3: Python FastAPI
cd backend-python && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 4: React
cd frontend && npm run dev
```

---

## Common Development Tasks

| Task | Command | Location |
|------|---------|----------|
| Add new page | Create in `pages/` | frontend/src/pages/ |
| Add new route | Update `App.jsx` | frontend/src/ |
| Add API endpoint | Create route file | backend-express/src/routes/ |
| Modify database | Update `schema.sql` | database/ |
| Global state | Edit `AppContext.jsx` | frontend/src/context/ |
| Styling | Tailwind classes | frontend/src/**/* |
| WebSocket | Edit `broadcastUpdate()` | backend-express/src/index.js |

---

**Last Updated**: [Current Date]
**Status**: ✅ Production Ready
