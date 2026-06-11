from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.models import User, Event, Announcement, Resource, TeamMember

router = APIRouter(prefix="/api/search", tags=["search"])

def get_db():
    from app.main import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/global")
async def global_search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    search_term = f"%{q}%"
    
    announcements = db.query(Announcement.id, Announcement.title, Announcement.description).filter(
        Announcement.title.ilike(search_term) | Announcement.description.ilike(search_term)
    ).limit(5).all()
    
    events = db.query(Event.id, Event.title, Event.description).filter(
        Event.title.ilike(search_term) | Event.description.ilike(search_term)
    ).limit(5).all()
    
    resources = db.query(Resource.id, Resource.title, Resource.description).filter(
        Resource.title.ilike(search_term) | Resource.description.ilike(search_term)
    ).limit(5).all()
    
    team = db.query(TeamMember.id, User.full_name.label('title'), TeamMember.designation.label('description')).join(User).filter(
        User.full_name.ilike(search_term) | TeamMember.designation.ilike(search_term)
    ).limit(5).all()
    
    return {
        "announcements": [{"type": "announcement", "id": a.id, "title": a.title, "description": a.description} for a in announcements],
        "events": [{"type": "event", "id": e.id, "title": e.title, "description": e.description} for e in events],
        "resources": [{"type": "resource", "id": r.id, "title": r.title, "description": r.description} for r in resources],
        "team": [{"type": "team", "id": t.id, "title": t.title, "description": t.description} for t in team]
    }

@router.get("/announcements")
async def search_announcements(q: str = Query(...), db: Session = Depends(get_db)):
    search_term = f"%{q}%"
    results = db.query(
        Announcement.id, Announcement.title, Announcement.description, Announcement.created_at,
        User.full_name, User.username
    ).join(User, Announcement.author_id == User.id).filter(
        Announcement.title.ilike(search_term) | Announcement.description.ilike(search_term)
    ).order_by(Announcement.created_at.desc()).all()
    
    return [{"id": r.id, "title": r.title, "description": r.description, "created_at": r.created_at, "full_name": r.full_name, "username": r.username} for r in results]

@router.get("/events")
async def search_events(q: str = Query(...), db: Session = Depends(get_db)):
    search_term = f"%{q}%"
    results = db.query(
        Event.id, Event.title, Event.description, Event.start_date,
        User.full_name, User.username
    ).join(User, Event.organizer_id == User.id).filter(
        Event.title.ilike(search_term) | Event.description.ilike(search_term)
    ).order_by(Event.start_date.asc()).all()
    
    return [{"id": r.id, "title": r.title, "description": r.description, "start_date": r.start_date, "full_name": r.full_name, "username": r.username} for r in results]
