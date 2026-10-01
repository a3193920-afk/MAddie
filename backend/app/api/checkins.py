import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter
from app.models.schemas import DailyCheckInRequest, DailyCheckInResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/api/checkins", tags=["Check-ins"])

# In-memory store initialized with 14 days of realistic student demo check-ins
CHECKIN_HISTORY: List[Dict[str, Any]] = []

def init_demo_checkins():
    global CHECKIN_HISTORY
    CHECKIN_HISTORY.clear()
    now = datetime.now()
    # 14 days pattern: stable at first, then elevated academic/placement stress leading into exam week
    patterns = [
        {"mood": 4, "stress": 2, "energy": 4, "sleep": "Very good", "stressors": ["General"]},
        {"mood": 4, "stress": 2, "energy": 4, "sleep": "Very good", "stressors": ["Friends"]},
        {"mood": 3, "stress": 2, "energy": 3, "sleep": "Okay", "stressors": ["Assignments"]},
        {"mood": 4, "stress": 3, "energy": 4, "sleep": "Okay", "stressors": ["Sports"]},
        {"mood": 3, "stress": 3, "energy": 3, "sleep": "Okay", "stressors": ["Hostel", "Noise"]},
        {"mood": 3, "stress": 3, "energy": 3, "sleep": "Okay", "stressors": ["Placement"]},
        {"mood": 4, "stress": 2, "energy": 4, "sleep": "Very good", "stressors": ["Family"]},
        {"mood": 3, "stress": 3, "energy": 3, "sleep": "Okay", "stressors": ["Academic"]},
        {"mood": 2, "stress": 4, "energy": 2, "sleep": "Poor", "stressors": ["Academic", "Exams"]},
        {"mood": 2, "stress": 4, "energy": 2, "sleep": "Poor", "stressors": ["Placement", "Interview"]},
        {"mood": 3, "stress": 4, "energy": 3, "sleep": "Poor", "stressors": ["Academic", "Assignments"]},
        {"mood": 2, "stress": 5, "energy": 2, "sleep": "Very poor", "stressors": ["Exams", "Fear of failure"]},
        {"mood": 3, "stress": 4, "energy": 3, "sleep": "Poor", "stressors": ["Exams", "Sleep"]},
        {"mood": 3, "stress": 3, "energy": 3, "sleep": "Okay", "stressors": ["Academic"]}
    ]
    for i, p in enumerate(patterns):
        date_str = (now - timedelta(days=13 - i)).strftime("%b %d")
        CHECKIN_HISTORY.append({
            "id": f"chk_{i+1}",
            "date": date_str,
            "mood": p["mood"],
            "stress": p["stress"],
            "energy": p["energy"],
            "sleep": p["sleep"],
            "stressors": p["stressors"],
            "notes": "Mid-sem prep and placement interviews." if i >= 8 else "Regular semester rhythm."
        })

init_demo_checkins()

@router.post("", response_model=DailyCheckInResponse)
async def submit_checkin(checkin: DailyCheckInRequest):
    primary_stressor = checkin.stressors[0] if checkin.stressors else "Academic"
    intervention, why_see = recommendation_service.recommend(
        stress=checkin.stress,
        mood=checkin.mood,
        primary_stressor=primary_stressor,
        available_minutes=5
    )
    
    today_str = datetime.now().strftime("%b %d")
    new_entry = {
        "id": str(uuid.uuid4())[:8],
        "date": today_str,
        "mood": checkin.mood,
        "stress": checkin.stress,
        "energy": checkin.energy,
        "sleep": checkin.sleep,
        "stressors": checkin.stressors,
        "notes": checkin.notes
    }
    CHECKIN_HISTORY.append(new_entry)

    return DailyCheckInResponse(
        id=new_entry["id"],
        date=new_entry["date"],
        mood=new_entry["mood"],
        stress=new_entry["stress"],
        energy=new_entry["energy"],
        sleep=new_entry["sleep"],
        stressors=new_entry["stressors"],
        intervention_recommendation=intervention,
        why_am_i_seeing_this=why_see
    )

@router.get("/history")
async def get_checkin_history():
    return CHECKIN_HISTORY

@router.get("/today")
async def get_today_checkin():
    today_str = datetime.now().strftime("%b %d")
    today_entry = next((c for c in reversed(CHECKIN_HISTORY) if c["date"] == today_str), None)
    return {"checked_in_today": today_entry is not None, "latest": today_entry or CHECKIN_HISTORY[-1]}
