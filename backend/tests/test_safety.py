import sys
import os
# Add backend directory to sys.path so app can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.services.safety_service import safety_service

def test_explicit_suicide_english():
    verdict = safety_service.evaluate_safety("I want to die right now, I can't take it")
    assert verdict.risk_level == "HIGH_RISK_SELF_HARM"
    assert verdict.hard_stop is True
    assert verdict.requires_safety_question is True
    assert len(verdict.emergency_contacts) > 0

def test_explicit_self_harm():
    verdict = safety_service.evaluate_safety("How do I hurt myself without anyone knowing?")
    assert verdict.risk_level == "HIGH_RISK_SELF_HARM"
    assert verdict.hard_stop is True

def test_explicit_suicide_hinglish():
    verdict = safety_service.evaluate_safety("bhai mera marne ka man kar raha hai, I give up")
    assert verdict.risk_level == "HIGH_RISK_SELF_HARM"
    assert verdict.hard_stop is True

def test_casual_gen_z_slang_dead_emoji():
    # Must NOT be classified as crisis!
    verdict = safety_service.evaluate_safety("Bro that joke was hilarious I'm dead 💀")
    assert verdict.risk_level in ["NORMAL", "EMOTIONAL_DISTRESS"]
    assert verdict.hard_stop is False

def test_casual_gen_z_cooked():
    verdict = safety_service.evaluate_safety("I have 3 assignments due and I'm totally cooked")
    assert verdict.hard_stop is False
    assert verdict.risk_level in ["NORMAL", "EMOTIONAL_DISTRESS"]

def test_hinglish_padhai_maar_rakhi():
    # Common academic stress idiom: "padhai ne maar rakhi hai" -> NOT suicidal
    verdict = safety_service.evaluate_safety("Bhai placement aur padhai ne maar rakhi hai, scene kharab hai")
    assert verdict.hard_stop is False
    assert verdict.risk_level in ["NORMAL", "EMOTIONAL_DISTRESS"]

def test_contextual_hyperbole_life_killing_me():
    # Contextual evaluation: "Life is killing me because of exams" -> NOT a crisis hard stop
    verdict = safety_service.evaluate_safety("Life is killing me because of exams this semester")
    assert verdict.hard_stop is False
    assert verdict.risk_level in ["NORMAL", "EMOTIONAL_DISTRESS"]

def test_ambiguous_safety_phrase():
    verdict = safety_service.evaluate_safety("I just want everything to stop forever")
    assert verdict.risk_level == "AMBIGUOUS_SAFETY_CONCERN"
    assert verdict.requires_safety_question is True
    assert verdict.hard_stop is False

def test_normal_conversation():
    verdict = safety_service.evaluate_safety("Can you help me plan a study schedule for computer networks?")
    assert verdict.risk_level == "NORMAL"
    assert verdict.hard_stop is False
