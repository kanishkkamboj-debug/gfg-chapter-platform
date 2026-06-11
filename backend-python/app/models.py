from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default='member')
    
    # Relationships
    events_organized = relationship("Event", back_populates="organizer", lazy="selectin")
    announcements_authored = relationship("Announcement", back_populates="author", lazy="selectin")
    resources_uploaded = relationship("Resource", back_populates="creator", lazy="selectin")
    team_member_profile = relationship("TeamMember", back_populates="user", uselist=False, lazy="selectin")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text)
    category = Column(String(100))
    priority = Column(String(50), default='normal')
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(Text)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    author = relationship("User", back_populates="announcements_authored", lazy="selectin")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String(100))
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    location = Column(String(255))
    capacity = Column(Integer)
    registered_count = Column(Integer, default=0)
    organizer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    organizer = relationship("User", back_populates="events_organized", lazy="selectin")

class EventRegistration(Base):
    __tablename__ = "event_registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    registered_at = Column(DateTime, default=datetime.utcnow)

class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    designation = Column(String(255))
    department = Column(String(100))
    
    user = relationship("User", back_populates="team_member_profile", lazy="selectin")

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), nullable=False)
    views = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    creator = relationship("User", back_populates="resources_uploaded", lazy="selectin")
