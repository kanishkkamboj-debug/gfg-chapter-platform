from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta

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
    """
    Get analytics dashboard data - all from database, no hardcoding
    """
    # Total users
    total_users = db.execute(text("SELECT COUNT(*) as count FROM users")).scalar()
    
    # Total events
    total_events = db.execute(text("SELECT COUNT(*) as count FROM events")).scalar()
    
    # Total announcements
    total_announcements = db.execute(text("SELECT COUNT(*) as count FROM announcements")).scalar()
    
    # Events this month
    this_month = datetime.now().replace(day=1)
    events_this_month = db.execute(
        text("SELECT COUNT(*) as count FROM events WHERE start_date >= :start_date"),
        {"start_date": this_month}
    ).scalar()
    
    # Recent registrations
    recent_registrations = db.execute(
        text("SELECT COUNT(*) as count FROM event_registrations WHERE registered_at >= NOW() - INTERVAL '7 days'")
    ).scalar()
    
    # Top events by registration
    top_events = db.execute(
        text("""
            SELECT e.id, e.title, e.registered_count 
            FROM events e 
            ORDER BY e.registered_count DESC 
            LIMIT 5
        """)
    ).fetchall()
    
    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_announcements": total_announcements,
        "events_this_month": events_this_month,
        "recent_registrations": recent_registrations,
        "top_events": [dict(row._mapping) for row in top_events]
    }

@router.get("/user-activity")
async def user_activity(days: int = 30, db: Session = Depends(get_db)):
    """Get user activity analytics"""
    activity = db.execute(
        text("""
            SELECT 
                DATE(registered_at) as date,
                COUNT(*) as registrations
            FROM event_registrations
            WHERE registered_at >= NOW() - make_interval(days => :days)
            GROUP BY DATE(registered_at)
            ORDER BY date DESC
        """),
        {"days": days}
    ).fetchall()
    
    return [dict(row._mapping) for row in activity]

@router.get("/engagement-metrics")
async def engagement_metrics(db: Session = Depends(get_db)):
    """Get engagement metrics from database"""
    # Most viewed resources
    most_viewed = db.execute(
        text("SELECT id, title, views FROM resources ORDER BY views DESC LIMIT 10")
    ).fetchall()
    
    # Resource categories distribution
    categories = db.execute(
        text("SELECT category, COUNT(*) as count FROM resources GROUP BY category")
    ).fetchall()
    
    return {
        "most_viewed_resources": [dict(row._mapping) for row in most_viewed],
        "resource_categories": [dict(row._mapping) for row in categories]
    }
