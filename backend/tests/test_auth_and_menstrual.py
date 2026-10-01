import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.db_service import db_service

client = TestClient(app)

def test_user_signup_and_login():
    email = f"test_{uuid.uuid4().hex[:10]}@campus.edu"
    signup_data = {
        "name": "Priya Sharma",
        "email": email,
        "password": "securepassword123",
        "age": 20,
        "gender": "female",
        "college": "IIT Kharagpur",
        "emergency_contact_name": "Mrs. Sharma (Mom)",
        "emergency_contact_relation": "Mother",
        "emergency_contact_phone": "+91 98300 11111"
    }
    
    # 1. Signup
    res = client.post("/api/auth/signup", json=signup_data)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["name"] == "Priya Sharma"
    assert data["gender"] == "female"
    user_id = data["id"]

    # 2. Login
    login_res = client.post("/api/auth/login", json={"email": email, "password": "securepassword123"})
    assert login_res.status_code == 200
    assert login_res.json()["id"] == user_id

    # 3. Check emergency contact created during signup
    contacts_res = client.get(f"/api/auth/contacts/{user_id}")
    assert contacts_res.status_code == 200
    contacts = contacts_res.json()
    assert len(contacts) >= 1
    assert contacts[0]["name"] == "Mrs. Sharma (Mom)"

def test_menstrual_cycle_tracking_and_prediction():
    # Ananya is seeded by default as female with cycle data
    res = client.get("/api/menstrual/current/usr_ananya")
    assert res.status_code == 200
    data = res.json()
    assert data["has_data"] is True
    assert data["phase_name"] in ["Luteal / Premenstrual Phase", "Menstrual Phase", "Follicular Phase", "Ovulatory Phase"]
    assert "self_care_tip" in data

    # Log a new period start
    log_res = client.post("/api/menstrual/log/usr_ananya", json={
        "start_date": "2026-09-20",
        "cycle_length": 28,
        "period_duration": 5,
        "symptoms": ["Cramps", "Mood Swings", "Bloating"],
        "flow_intensity": "medium",
        "notes": "Feeling slightly anxious before lab exam"
    })
    assert log_res.status_code == 200
    pred = log_res.json()
    assert pred["has_data"] is True
    assert pred["current_day"] > 0

def test_male_profile_menstrual_gate():
    # Rohan is seeded as male
    res = client.get("/api/menstrual/current/usr_rohan")
    assert res.status_code == 200
    data = res.json()
    assert data["has_data"] is False
    assert "female" in data["message"].lower()

def test_chat_with_user_context_and_menstrual_telemetry():
    # Chat as Ananya who is in Luteal/Premenstrual phase
    chat_res = client.post("/api/chat", json={
        "message": "I don't know why I keep crying today, I feel like such a failure with my studies and mood swings.",
        "mode": "Just listen",
        "current_mood": 2,
        "current_stress": 4,
        "primary_stressor": "Academic",
        "user_id": "usr_ananya"
    })
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    reply = chat_data["reply"].lower()
    # The response should be empathetic and validate either cycle, hormones, or personal care
    assert any(w in reply for w in ["cycle", "hormon", "body", "progesterone", "gentle", "breath", "failing", "valid", "chai", "maddy"])

def test_kolkata_psychologist_referral_in_chat():
    chat_res = client.post("/api/chat", json={
        "message": "I am in Kolkata and feeling overwhelmed, can you recommend a good psychologist or doctor near me?",
        "mode": "Help me solve something",
        "current_mood": 2,
        "current_stress": 5,
        "primary_stressor": "Mental health",
        "user_id": "usr_rohan"
    })
    assert chat_res.status_code == 200
    reply = chat_res.json()["reply"]
    # Should include Kolkata psychiatric references
    assert any(k in reply for k in ["Kolkata", "CNMCH", "SSKM", "Antara", "Psychiatry", "033"])

def test_crisis_with_user_emergency_family_contact():
    # Explicit distress triggers hard-stop with family contact at the top
    chat_res = client.post("/api/chat", json={
        "message": "I want to end my life, I want to kill myself",
        "mode": "Adaptive (Auto)",
        "user_id": "usr_ananya"
    })
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert data["safety_verdict"]["hard_stop"] is True
    contacts = data["safety_verdict"]["emergency_contacts"]
    # First contact should be Ananya's saved family contact (Maa / Mom)
    assert any("Maa" in c["name"] or "Mom" in c["name"] for c in contacts)
