from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from pydantic import BaseModel

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
    """Get upcoming events for notification purposes"""
    future_date = datetime.now() + timedelta(days=days)
    
    events = db.execute(
        text("""
            SELECT id, title, start_date, description 
            FROM events 
            WHERE start_date BETWEEN NOW() AND :future_date
            ORDER BY start_date ASC
        """),
        {"future_date": future_date}
    ).fetchall()
    
    return [dict(row._mapping) for row in events]

@router.get("/event-reminders/{user_id}")
async def get_event_reminders(user_id: int, db: Session = Depends(get_db)):
    """Get event reminders for a specific user"""
    reminders = db.execute(
        text("""
            SELECT e.id, e.title, e.start_date, e.location
            FROM events e
            JOIN event_registrations er ON e.id = er.event_id
            WHERE er.user_id = :user_id
            AND e.start_date > NOW()
            AND e.start_date <= NOW() + INTERVAL '7 days'
            ORDER BY e.start_date ASC
        """),
        {"user_id": user_id}
    ).fetchall()
    
    return [dict(row._mapping) for row in reminders]

@router.get("/new-announcements/{user_id}")
async def get_new_announcements(user_id: int, db: Session = Depends(get_db)):
    """Get recent announcements for user notification"""
    announcements = db.execute(
        text("""
            SELECT id, title, description, created_at, priority
            FROM announcements
            WHERE created_at >= NOW() - INTERVAL '24 hours'
            AND (category = 'important' OR priority = 'high')
            ORDER BY created_at DESC
            LIMIT 5
        """)
    ).fetchall()
    
    return [dict(row._mapping) for row in announcements]

