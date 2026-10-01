from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="/api/campus", tags=["Campus & Crisis Resources"])

@router.get("/resources")
async def get_campus_resources():
    return {
        "emergency_hotlines": settings.CRISIS_RESOURCES,
        "campus_contacts": settings.CAMPUS_RESOURCES,
        "location": "National Campus Network (Verified Helplines)"
    }
