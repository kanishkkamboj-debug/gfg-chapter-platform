from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.models import Event, EventRegistration, Announcement

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str
    type: str

def get_db():
    from app.main import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/upcoming-events")
async def get_upcoming_events(days: int = 7, db: Session = Depends(get_db)):
    days = min(max(days, 0), 365)
    future_date = datetime.now() + timedelta(days=days)
    
    events = db.query(Event.id, Event.title, Event.start_date, Event.description).filter(
        Event.start_date >= datetime.now(),
        Event.start_date <= future_date
    ).order_by(Event.start_date.asc()).all()
    
    return [{"id": e.id, "title": e.title, "start_date": e.start_date, "description": e.description} for e in events]

@router.get("/event-reminders/{user_id}")
async def get_event_reminders(user_id: int, db: Session = Depends(get_db)):
    reminders = db.query(Event.id, Event.title, Event.start_date, Event.location).join(
        EventRegistration, Event.id == EventRegistration.event_id
    ).filter(
        EventRegistration.user_id == user_id,
        Event.start_date > datetime.now(),
        Event.start_date <= datetime.now() + timedelta(days=7)
    ).order_by(Event.start_date.asc()).all()
    
    return [{"id": r.id, "title": r.title, "start_date": r.start_date, "location": r.location} for r in reminders]

@router.get("/new-announcements/{user_id}")
async def get_new_announcements(user_id: int, db: Session = Depends(get_db)):
    one_day_ago = datetime.now() - timedelta(hours=24)
    announcements = db.query(Announcement.id, Announcement.title, Announcement.description, Announcement.created_at, Announcement.priority).filter(
        Announcement.created_at >= one_day_ago,
        (Announcement.category == 'important') | (Announcement.priority == 'high')
    ).order_by(Announcement.created_at.desc()).limit(5).all()
    
    return [{"id": a.id, "title": a.title, "description": a.description, "created_at": a.created_at, "priority": a.priority} for a in announcements]
