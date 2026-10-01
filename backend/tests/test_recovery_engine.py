import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.ai_service import ai_service

client = TestClient(app)

def test_get_support_modes():
    res = client.get("/api/recovery/modes")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 8
    ids = [m["id"] for m in data]
    assert "just_listen" in ids
    assert "help_me_understand" in ids
    assert "help_me_start" in ids
    assert "distract_me" in ids
    assert "help_me_connect" in ids
    assert "stay_with_me" in ids

def test_get_missions():
    res = client.get("/api/recovery/missions")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    categories = set(m["category"] for m in data)
    assert "Pleasure" in categories
    assert "Mastery" in categories
    assert "Connection" in categories

def test_complete_mission_with_obstacle():
    res = client.post("/api/recovery/missions/complete", json={
        "mission_id": "mastery_open_notes",
        "obstacle_faced": "perfectionism"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "perfection" in data["reflection_insight"].lower()

def test_loop_breaker():
    res = client.post("/api/recovery/loop-breaker", json={
        "event": "Got a poor score in Quiz 1",
        "thought": "I'm not smart enough for this branch",
        "emotion": "Shame and dread",
        "action": "Avoided opening textbooks for 3 days",
        "next_outcome": "Falling further behind"
    })
    assert res.status_code == 200
    data = res.json()
    assert "interventions" in data
    assert len(data["interventions"]) >= 4
    levers = [i["lever"] for i in data["interventions"]]
    assert "Change the Thought" in levers
    assert "Change the Next Action" in levers

def test_feedback_and_user_manual():
    # Record feedback
    res = client.post("/api/recovery/feedback", json={
        "interaction_type": "5-minute start mission",
        "rating": "helped a lot",
        "factor_helped": "taking action",
        "user_note": "Starting with just 5 mins helped me open the notes"
    })
    assert res.status_code == 200
    
    # Get manual
    man_res = client.get("/api/recovery/manual")
    assert man_res.status_code == 200
    manual = man_res.json()
    assert "overwhelmed" in manual
    assert "cannot_start" in manual
    assert "makes_it_worse" in manual

def test_help_message_generation():
    # Friend
    f_res = client.post("/api/recovery/help-message", json={
        "recipient": "Friend",
        "topic": "Feeling lonely and stressed"
    })
    assert f_res.status_code == 200
    assert "chai" in f_res.json()["message"].lower() or "talk" in f_res.json()["message"].lower()

    # Counselor
    c_res = client.post("/api/recovery/help-message", json={
        "recipient": "Counselor",
        "topic": "Academic burnout"
    })
    assert c_res.status_code == 200
    assert "appointment" in c_res.json()["message"].lower()

def test_professional_handoff_summary():
    res = client.post("/api/recovery/handoff-summary", json={
        "timeline": "Last 3 weeks since mid-terms",
        "primary_concerns": ["Academic burnout", "Sleep disruption"],
        "what_helped": ["Monsoon rain audio", "5-minute study intervals"],
        "what_did_not_help": ["Late-night cramming"],
        "questions_to_ask": ["How can I pace my study week?"]
    })
    assert res.status_code == 200
    data = res.json()
    assert "Personal Wellness Summary" in data["title"]
    assert "NOT a clinical diagnosis" in data["disclaimer"]

def test_discover_dont_assume_chat():
    res = client.post("/api/chat", json={
        "message": "I've been feeling really low.",
        "mode": "Adaptive (Auto)"
    })
    assert res.status_code == 200
    data = res.json()
    reply = data["reply"]
    # Check that Maddy does NOT assume exams or placement, but asks with curiosity
    assert "what have the last few days been like" in reply.lower() or "glad you told me" in reply.lower() or "glad you reached out" in reply.lower()
