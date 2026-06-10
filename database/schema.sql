-- GFG Chapter Platform Database Schema

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  avatar_url TEXT,
  bio TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  category VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'normal',
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_type VARCHAR(100),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  registration_link TEXT,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  image_url TEXT,
  organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Team members table
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_title VARCHAR(255),
  designation VARCHAR(255),
  expertise TEXT,
  social_links JSONB,
  bio TEXT,
  profile_image TEXT,
  department VARCHAR(100),
  year_of_study VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE gallery_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  link TEXT,
  file_url TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts/Support tickets
CREATE TABLE support_tickets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'open',
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hall of Fame
CREATE TABLE hall_of_fame (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_title VARCHAR(255) NOT NULL,
  achievement_type VARCHAR(100),
  company VARCHAR(255),
  description TEXT,
  achievement_date DATE,
  badge_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search history for analytics
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  search_term VARCHAR(255),
  search_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_announcements_author_id ON announcements(author_id);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_gallery_items_event_id ON gallery_items(event_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_hall_of_fame_user_id ON hall_of_fame(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
