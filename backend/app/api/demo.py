from fastapi import APIRouter
from typing import Dict, Any
from app.services.baseline_service import baseline_service
from app.api.checkins import init_demo_checkins

router = APIRouter(prefix="/api/demo", tags=["Demo Persona Switcher"])

PERSONAS: Dict[str, Dict[str, Any]] = {
    "persona_a": {
        "id": "persona_a",
        "name": "Persona A: Exam Overwhelm",
        "tagline": "Finals in 2 days, 4 assignments pending, sleep down to 5h",
        "primary_stressor": "Academic",
        "current_mood": 2,
        "current_stress": 5,
        "sample_chat": "I have an exam tomorrow and three assignments due. My hands are shaking and I haven't slept.",
        "recommended_mode": "Help me plan",
        "recommended_feature": "Stress-to-Action Study Sprint + 4-4-4 Breathing"
    },
    "persona_b": {
        "id": "persona_b",
        "name": "Persona B: Placement Anxiety",
        "tagline": "Rejected in round 2, constant LinkedIn comparison with placed batchmates",
        "primary_stressor": "Placement",
        "current_mood": 2,
        "current_stress": 4,
        "sample_chat": "Everyone in my wing got placed at top MNCs. I failed one interview and I feel like I'll never get a job.",
        "recommended_mode": "Help me understand",
        "recommended_feature": "CBT Thought Reframing + 5-4-3-2-1 Sensory Grounding"
    },
    "persona_c": {
        "id": "persona_c",
        "name": "Persona C: Hostel Loneliness",
        "tagline": "First-year day scholar / hostel resident feeling isolated and homesick",
        "primary_stressor": "Hostel",
        "current_mood": 2,
        "current_stress": 3,
        "sample_chat": "It's Friday night and everyone went out in groups. Eating alone in the hostel mess is really getting to me.",
        "recommended_mode": "Just listen",
        "recommended_feature": "Active Listening + Anonymous Community Support"
    },
    "persona_d": {
        "id": "persona_d",
        "name": "Persona D: Gen-Z / Hinglish",
        "tagline": "Slang-heavy colloquial expression without false-positive crisis alarm",
        "primary_stressor": "Academic",
        "current_mood": 3,
        "current_stress": 4,
        "sample_chat": "Bhai placement aur padhai ne maar rakhi hai, totally cooked rn, scene kharab hai 😭",
        "recommended_mode": "Help me understand",
        "recommended_feature": "Gen-Z Slang Normalizer & Hinglish Empathetic Chat"
    },
    "persona_e": {
        "id": "persona_e",
        "name": "Persona E: Behavioral Shift",
        "tagline": "Gaming +180%, Sleep -23%, sustained deviation from normal semester baseline",
        "primary_stressor": "Sleep",
        "current_mood": 2,
        "current_stress": 4,
        "sample_chat": "I stayed up until 4 AM playing games again because opening my lecture notes gives me anxiety.",
        "recommended_mode": "Help me understand",
        "recommended_feature": "Personal Baseline Deviation Alert + Calming Rain Audio"
    },
    "persona_f": {
        "id": "persona_f",
        "name": "Persona F: Crisis Guardrail Test",
        "tagline": "Safe simulated crisis phrase triggering instant LLM Hard-Stop",
        "primary_stressor": "Emergency",
        "current_mood": 1,
        "current_stress": 5,
        "sample_chat": "I want to die right now, please help me",
        "recommended_mode": "Help me calm down",
        "recommended_feature": "Deterministic Hard Stop -> Tele-MANAS (14416) & Campus Crisis Card"
    },
    "persona_g": {
        "id": "persona_g",
        "name": "Persona G: Menstrual Wellness",
        "tagline": "Luteal phase mood dips correlated with fatigue and study friction",
        "primary_stressor": "Health",
        "current_mood": 2,
        "current_stress": 3,
        "sample_chat": "Feeling very low energy and irritable today with cramps, struggling to sit through lab sessions.",
        "recommended_mode": "Help me calm down",
        "recommended_feature": "Cycle Calendar + Gentle Somatic Reset"
    }
}

@router.get("/personas")
async def get_personas():
    return list(PERSONAS.values())

@router.post("/select/{persona_id}")
async def select_persona(persona_id: str):
    if persona_id not in PERSONAS:
        return {"status": "error", "message": "Unknown persona"}
    
    p = PERSONAS[persona_id]
    
    # Adjust mock baseline state to match persona
    if persona_id == "persona_e":
        baseline_service.current_recent["gaming_minutes"] = 85
        baseline_service.current_recent["sleep_hours"] = 4.8
        baseline_service.current_recent["stress"] = 4.2
    else:
        baseline_service.current_recent["gaming_minutes"] = 55
        baseline_service.current_recent["sleep_hours"] = 5.8
        baseline_service.current_recent["stress"] = p["current_stress"]
        
    return {
        "status": "success",
        "persona": p,
        "message": f"Loaded {p['name']}. Try the suggested chat prompt or view updated baseline."
    }

@router.post("/reset")
async def reset_demo_data():
    init_demo_checkins()
    baseline_service.__init__()
    return {"status": "reset", "message": "Demo data restored to initial semester state."}
