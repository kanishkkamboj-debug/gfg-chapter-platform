from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models import User, Event, Announcement, EventRegistration, Resource

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

def get_db():
    from app.main import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/dashboard")
async def analytics_dashboard(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_events = db.query(func.count(Event.id)).scalar()
    total_announcements = db.query(func.count(Announcement.id)).scalar()
    
    this_month = datetime.now().replace(day=1)
    events_this_month = db.query(func.count(Event.id)).filter(Event.start_date >= this_month).scalar()
    
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_registrations = db.query(func.count(EventRegistration.id)).filter(EventRegistration.registered_at >= seven_days_ago).scalar()
    
    top_events = db.query(Event.id, Event.title, Event.registered_count).order_by(Event.registered_count.desc()).limit(5).all()
    
    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_announcements": total_announcements,
        "events_this_month": events_this_month,
        "recent_registrations": recent_registrations,
        "top_events": [{"id": e.id, "title": e.title, "registered_count": e.registered_count} for e in top_events]
    }

@router.get("/user-activity")
async def user_activity(days: int = 30, db: Session = Depends(get_db)):
    cutoff = datetime.now() - timedelta(days=days)
    
    activity = db.query(
        func.date(EventRegistration.registered_at).label("date"),
        func.count(EventRegistration.id).label("registrations")
    ).filter(
        EventRegistration.registered_at >= cutoff
    ).group_by(
        func.date(EventRegistration.registered_at)
    ).order_by(
        func.date(EventRegistration.registered_at).desc()
    ).all()
    
    return [{"date": str(a.date), "registrations": a.registrations} for a in activity]

@router.get("/engagement-metrics")
async def engagement_metrics(db: Session = Depends(get_db)):
    most_viewed = db.query(Resource.id, Resource.title, Resource.views).order_by(Resource.views.desc()).limit(10).all()
    
    categories = db.query(
        Resource.category, 
        func.count(Resource.id).label("count")
    ).group_by(Resource.category).all()
    
    return {
        "most_viewed_resources": [{"id": r.id, "title": r.title, "views": r.views} for r in most_viewed],
        "resource_categories": [{"category": c.category, "count": c.count} for c in categories]
    }
