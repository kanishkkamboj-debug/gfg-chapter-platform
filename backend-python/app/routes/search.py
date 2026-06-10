from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

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
    """
    Global search across announcements, events, resources, and team members
    Returns dynamic results from database
    """
    search_term = f"%{q}%"
    
    # Search announcements
    announcements = db.execute(
        text("SELECT 'announcement' as type, id, title, description FROM announcements WHERE title ILIKE :q OR description ILIKE :q LIMIT 5"),
        {"q": search_term}
    ).fetchall()
    
    # Search events
    events = db.execute(
        text("SELECT 'event' as type, id, title, description FROM events WHERE title ILIKE :q OR description ILIKE :q LIMIT 5"),
        {"q": search_term}
    ).fetchall()
    
    # Search resources
    resources = db.execute(
        text("SELECT 'resource' as type, id, title, description FROM resources WHERE title ILIKE :q OR description ILIKE :q LIMIT 5"),
        {"q": search_term}
    ).fetchall()
    
    # Search team members
    team = db.execute(
        text("""
            SELECT 'team' as type, tm.id, u.full_name as title, tm.designation as description 
            FROM team_members tm 
            JOIN users u ON tm.user_id = u.id 
            WHERE u.full_name ILIKE :q OR tm.designation ILIKE :q 
            LIMIT 5
        """),
        {"q": search_term}
    ).fetchall()
    
    results = {
        "announcements": [dict(row._mapping) for row in announcements],
        "events": [dict(row._mapping) for row in events],
        "resources": [dict(row._mapping) for row in resources],
        "team": [dict(row._mapping) for row in team]
    }
    
    return results

@router.get("/announcements")
async def search_announcements(q: str = Query(...), db: Session = Depends(get_db)):
    """Search announcements by title or description"""
    search_term = f"%{q}%"
    results = db.execute(
        text("""
            SELECT a.*, u.full_name, u.username 
            FROM announcements a 
            JOIN users u ON a.author_id = u.id 
            WHERE a.title ILIKE :q OR a.description ILIKE :q 
            ORDER BY a.created_at DESC
        """),
        {"q": search_term}
    ).fetchall()
    
    return [dict(row._mapping) for row in results]

@router.get("/events")
async def search_events(q: str = Query(...), db: Session = Depends(get_db)):
    """Search events by title or description"""
    search_term = f"%{q}%"
    results = db.execute(
        text("""
            SELECT e.*, u.full_name, u.username 
            FROM events e 
            JOIN users u ON e.organizer_id = u.id 
            WHERE e.title ILIKE :q OR e.description ILIKE :q 
            ORDER BY e.start_date ASC
        """),
        {"q": search_term}
    ).fetchall()
    
    return [dict(row._mapping) for row in results]
