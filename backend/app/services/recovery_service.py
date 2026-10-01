import os
import json
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SupportMode(BaseModel):
    id: str
    label: str
    icon: str
    description: str
    user_need: str
    recommended_action: str

class RecoveryMission(BaseModel):
    id: str
    title: str
    duration_minutes: int
    category: str  # Pleasure | Mastery | Connection | Meaning | Care
    category_label: str
    prompt: str
    why_it_helps: str
    difficulty: str  # "micro" | "easy"
    is_completed: bool = False

class LoopBreakerStep(BaseModel):
    id: str
    title: str
    event: str
    thought: str
    emotion: str
    action: str
    outcome: str
    interruption_options: List[Dict[str, str]]

class WhatHelpsMeItem(BaseModel):
    id: str
    section: str  # overwhelmed | cannot_start | lonely | cannot_sleep | makes_it_worse | words_to_remember
    content: str
    added_date: str
    user_confirmed: bool = True

class RecoveryService:
    def __init__(self):
        self.support_modes: List[SupportMode] = [
            SupportMode(
                id="just_listen",
                label="Just listen",
                icon="🫂",
                description="I don't want solutions right now.",
                user_need="Empathetic presence and emotional validation without advice.",
                recommended_action="Active empathetic reflection with zero unsolicited fixing."
            ),
            SupportMode(
                id="help_me_understand",
                label="Help me understand",
                icon="🧠",
                description="I don't know why I feel like this.",
                user_need="Gentle cognitive exploration to separate facts from conclusions.",
                recommended_action="Open-ended curiosity, personal emotional mapping."
            ),
            SupportMode(
                id="help_me_calm_down",
                label="Help me calm down",
                icon="🌿",
                description="Everything feels too intense.",
                user_need="Physiological de-escalation and somatic grounding.",
                recommended_action="Parasympathetic box breathing or 5-4-3-2-1 sensory grounding."
            ),
            SupportMode(
                id="help_me_solve",
                label="Help me solve something",
                icon="🧩",
                description="I need practical help.",
                user_need="Actionable problem deconstruction and sequencing.",
                recommended_action="Break the problem into bite-sized Pomodoro sprints."
            ),
            SupportMode(
                id="help_me_start",
                label="Help me start",
                icon="🎯",
                description="I know what I need to do but can't begin.",
                user_need="Removing friction, executive dysfunction bypass.",
                recommended_action="5-minute micro-mission: 'Just open the document'."
            ),
            SupportMode(
                id="distract_me",
                label="Distract me",
                icon="🎮",
                description="I need a break from my thoughts.",
                user_need="Attentional diversion away from repetitive rumination.",
                recommended_action="Non-competitive mindful game (Bubble Zen, Mind Match, Pattern Flow)."
            ),
            SupportMode(
                id="help_me_connect",
                label="Help me connect",
                icon="🤝",
                description="I don't want to deal with this alone.",
                user_need="Bridging isolation, reaching trusted humans.",
                recommended_action="Draft low-friction message to friend, family, or mentor."
            ),
            SupportMode(
                id="stay_with_me",
                label="Stay with me",
                icon="🌙",
                description="I don't want to do anything. Just stay here.",
                user_need="Quiet, non-demanding companionship without expectation.",
                recommended_action="Walk With Me peaceful story or Maddy Space ambient room."
            )
        ]

        self.missions_catalog: List[RecoveryMission] = [
            # 1. Pleasure
            RecoveryMission(
                id="pleasure_music",
                title="Play One Comfort Song",
                duration_minutes=3,
                category="Pleasure",
                category_label="Pleasure & Comfort",
                prompt="Put on headphones and play one track that brings you quiet comfort. You don't have to feel happy—just listen.",
                why_it_helps="Gentle auditory stimulation shifts neural activity away from repetitive catastrophic loops.",
                difficulty="micro"
            ),
            RecoveryMission(
                id="pleasure_warmth",
                title="Savor Warm Chai or Water",
                duration_minutes=3,
                category="Pleasure",
                category_label="Pleasure & Comfort",
                prompt="Get a warm mug of chai, tea, or water. Feel the warmth in your hands and take three slow sips.",
                why_it_helps="Direct thermoreception signals safety to the autonomic nervous system.",
                difficulty="micro"
            ),
            # 2. Mastery
            RecoveryMission(
                id="mastery_open_notes",
                title="Open the Notes (5-Minute Start)",
                duration_minutes=5,
                category="Mastery",
                category_label="Sense of Capability",
                prompt="Just open the syllabus or textbook to the first page. You do NOT have to study the whole chapter—just look at one paragraph for 5 minutes.",
                why_it_helps="Bypasses executive dysfunction by setting an initiation threshold so low your brain stops perceiving it as a threat.",
                difficulty="micro"
            ),
            RecoveryMission(
                id="mastery_clear_space",
                title="Clear One Foot of Desk",
                duration_minutes=3,
                category="Mastery",
                category_label="Sense of Capability",
                prompt="Tidy just one small corner of your desk or bed. Move one cup or stack two papers. That's the whole mission.",
                why_it_helps="Micro-environmental control restores perceived agency when larger life circumstances feel uncontrollable.",
                difficulty="micro"
            ),
            # 3. Connection
            RecoveryMission(
                id="connection_ping",
                title="Send a 1-Line Text",
                duration_minutes=2,
                category="Connection",
                category_label="Human Connection",
                prompt="Send a short message: 'Hey, thinking of you, hope your day is going okay' or 'Hey, what are you up to?' to one friend.",
                why_it_helps="Reduces acute isolation without demanding vulnerable emotional disclosure before you're ready.",
                difficulty="micro"
            ),
            RecoveryMission(
                id="connection_step_out",
                title="Step Outside for Fresh Air",
                duration_minutes=5,
                category="Connection",
                category_label="Human Connection",
                prompt="Walk down the hostel stairs or step out onto the balcony/campus lawn for 5 minutes. Notice the sky and life moving.",
                why_it_helps="Expands your visual horizon from phone screen to natural scenery, easing claustrophobic rumination.",
                difficulty="easy"
            ),
            # 4. Meaning
            RecoveryMission(
                id="meaning_quote",
                title="Write One True Thing",
                duration_minutes=3,
                category="Meaning",
                category_label="Personal Meaning",
                prompt="In the encrypted journal, write one thing you genuinely care about that has nothing to do with grades or placements.",
                why_it_helps="Re-anchors identity in your human values rather than short-term academic evaluation.",
                difficulty="micro"
            ),
            # 5. Care
            RecoveryMission(
                id="care_hydrate",
                title="Hydrate & Shoulder Drop",
                duration_minutes=2,
                category="Care",
                category_label="Body Care",
                prompt="Drink one full glass of water, roll your shoulders backward three times, and unclamp your jaw.",
                why_it_helps="Releases the physical holding patterns of prolonged campus stress.",
                difficulty="micro"
            )
        ]

        # In-memory user manual & feedback store (simulating private profile)
        self.user_manual: Dict[str, List[WhatHelpsMeItem]] = {
            "overwhelmed": [
                WhatHelpsMeItem(id="m_1", section="overwhelmed", content="5-minute micro tasks work better than long schedules.", added_date="Sep 28", user_confirmed=True),
                WhatHelpsMeItem(id="m_2", section="overwhelmed", content="Monsoon Rain soundscape with eyes closed for 3 minutes.", added_date="Sep 29", user_confirmed=True)
            ],
            "cannot_start": [
                WhatHelpsMeItem(id="m_3", section="cannot_start", content="Just opening the notes without promising to finish helps unlock paralysis.", added_date="Sep 27", user_confirmed=True)
            ],
            "lonely": [
                WhatHelpsMeItem(id="m_4", section="lonely", content="Walking around the campus quad or texting one close friend.", added_date="Sep 26", user_confirmed=True)
            ],
            "cannot_sleep": [
                WhatHelpsMeItem(id="m_5", section="cannot_sleep", content="Screen off 20 mins before bed + 4-count breathing.", added_date="Sep 25", user_confirmed=True)
            ],
            "makes_it_worse": [
                WhatHelpsMeItem(id="m_6", section="makes_it_worse", content="Scrolling LinkedIn placement updates at 2 AM.", added_date="Sep 28", user_confirmed=True),
                WhatHelpsMeItem(id="m_7", section="makes_it_worse", content="Motivational quotes that say 'just work harder'.", added_date="Sep 29", user_confirmed=True)
            ],
            "words_to_remember": [
                WhatHelpsMeItem(id="m_8", section="words_to_remember", content="An exam measures what I wrote today, not my human worth.", added_date="Sep 27", user_confirmed=True)
            ]
        }

        self.feedback_log: List[Dict[str, Any]] = []

    def get_support_modes(self) -> List[SupportMode]:
        return self.support_modes

    def get_missions(self, category: Optional[str] = None) -> List[RecoveryMission]:
        if category and category.lower() != "all":
            return [m for m in self.missions_catalog if m.category.lower() == category.lower()]
        return self.missions_catalog

    def complete_mission(self, mission_id: str, obstacle_faced: Optional[str] = None) -> Dict[str, Any]:
        mission = next((m for m in self.missions_catalog if m.id == mission_id), None)
        title = mission.title if mission else "Micro-Mission"
        
        reflection_insight = ""
        if obstacle_faced:
            obstacle_map = {
                "perfectionism": "Recognizing that 'good enough' is better than waiting for perfection is a major recovery milestone.",
                "exhaustion": "When physical or emotional energy is depleted, resting without guilt is the most productive choice.",
                "fear": "Facing the start when fear is present takes real courage. Taking one small breath before starting can steady you.",
                "confusion": "When tasks are fuzzy, breaking them down into a 1-sentence prompt removes cognitive friction.",
                "environment": "Hostel noise or clutter can silently drain focus. Even putting on headphones creates a portable quiet boundary."
            }
            reflection_insight = obstacle_map.get(obstacle_faced.lower(), "Learning what creates resistance helps tailor smaller, gentler steps.")

        return {
            "status": "success",
            "mission_id": mission_id,
            "title": title,
            "message": f"Completed '{title}'. One small step of agency taken.",
            "reflection_insight": reflection_insight
        }

    def evaluate_loop_breaker(self, event: str, thought: str, emotion: str, action: str, next_outcome: str) -> Dict[str, Any]:
        """
        Takes the user's mapped cycle and generates compassionate, practical interruption levers.
        """
        interventions = [
            {
                "lever": "Change the Thought",
                "icon": "🧠",
                "title": "Cognitive Re-anchor",
                "suggestion": f"Challenge the automatic thought: '{thought}'. Ask: 'Is this 100% a confirmed fact, or is it my stress talking?'"
            },
            {
                "lever": "Change the Next Action",
                "icon": "🎯",
                "title": "5-Minute Micro-Action",
                "suggestion": "Instead of complete avoidance, try just 5 minutes of low-stakes contact with the task. You are free to stop right after."
            },
            {
                "lever": "Ask for Support",
                "icon": "🤝",
                "title": "Reach a Human",
                "suggestion": "Send a low-pressure message to a trusted friend or mentor. You don't have to carry this cycle in isolation."
            },
            {
                "lever": "Take a Physiological Reset",
                "icon": "🌿",
                "title": "Somatic Down-Regulation",
                "suggestion": "Step away for 4 minutes of 4-4-4 Box Breathing or splash cold water on your face to break the acute nervous arousal."
            },
            {
                "lever": "Do Something Meaningful",
                "icon": "✨",
                "title": "Values Reconnection",
                "suggestion": "Pause the stressful loop and spend 5 minutes on something that connects with who you are beyond academics."
            }
        ]

        return {
            "mapped_cycle": {
                "event": event,
                "thought": thought,
                "emotion": emotion,
                "action": action,
                "next_outcome": next_outcome
            },
            "interventions": interventions,
            "reflection": "Cycles feel permanent while we are inside them, but interrupting just one link changes the trajectory."
        }

    def record_feedback(self, interaction_type: str, rating: str, factor_helped: Optional[str] = None, user_note: Optional[str] = None) -> Dict[str, Any]:
        entry = {
            "timestamp": "Just now",
            "interaction_type": interaction_type,
            "rating": rating,
            "factor_helped": factor_helped,
            "user_note": user_note
        }
        self.feedback_log.append(entry)

        # If user found it helpful and gave a note or factor, offer to save to their manual
        saved_to_manual = False
        if rating in ["helped a lot", "helped a little"] and (factor_helped or user_note):
            section = "overwhelmed"
            if "music" in (factor_helped or "").lower():
                section = "cannot_sleep"
            elif "action" in (factor_helped or "").lower():
                section = "cannot_start"
            elif "talk" in (factor_helped or "").lower() or "connect" in (factor_helped or "").lower():
                section = "lonely"

            content = user_note if user_note else f"Found helpful: {factor_helped}"
            new_item = WhatHelpsMeItem(
                id=f"item_{len(self.feedback_log)}",
                section=section,
                content=content,
                added_date="Today",
                user_confirmed=True
            )
            if section in self.user_manual:
                self.user_manual[section].append(new_item)
                saved_to_manual = True

        return {
            "status": "success",
            "saved_to_manual": saved_to_manual,
            "message": "Thank you. Maddy has noted what resonates best for your personal support."
        }

    def get_user_manual(self) -> Dict[str, List[Dict[str, Any]]]:
        res = {}
        for sec, items in self.user_manual.items():
            res[sec] = [i.model_dump() for i in items]
        return res

    def add_manual_item(self, section: str, content: str) -> Dict[str, Any]:
        if section not in self.user_manual:
            self.user_manual[section] = []
        new_item = WhatHelpsMeItem(
            id=f"custom_{os.urandom(3).hex()}",
            section=section,
            content=content.strip(),
            added_date="Today",
            user_confirmed=True
        )
        self.user_manual[section].append(new_item)
        return {"status": "success", "item": new_item.model_dump()}

    def generate_outreach_message(self, recipient: str, topic: str, tone: str = "gentle") -> Dict[str, str]:
        """
        'I don't know how to ask for help' template generator.
        Reduces friction of reaching out to a real human.
        """
        recipient_lower = recipient.lower()
        topic_lower = topic.lower()

        if "friend" in recipient_lower:
            return {
                "recipient": "Friend",
                "subject": "Quick check-in",
                "message": (
                    "Hey, I don't really know how to put this into words, but I've been having a bit of a rough time lately. "
                    "Are you free sometime today or tomorrow to just grab a chai or talk for 10 minutes? No pressure at all, just wanted to reach out."
                ),
                "tip": "Friends usually want to be there for you, but they can't know you're struggling unless you let them in."
            }
        elif "family" in recipient_lower or "parent" in recipient_lower:
            return {
                "recipient": "Family / Parents",
                "subject": "Catching up",
                "message": (
                    "Hi, hope you're doing well. Things have felt pretty overwhelming at college lately with coursework and routines. "
                    "I wanted to share that I'm feeling a bit burnt out right now and could really use a calm chat when you have a quiet moment."
                ),
                "tip": "Setting the boundary for a 'calm chat' helps guide parents toward support rather than immediate problem-solving."
            }
        elif "prof" in recipient_lower or "teacher" in recipient_lower:
            return {
                "recipient": "Professor / Teacher",
                "subject": "Request for guidance regarding coursework",
                "message": (
                    "Dear Professor,\n\n"
                    "I am writing to respectfully request a brief 5-minute meeting during your office hours. "
                    "I have been experiencing personal challenges recently that have impacted my coursework pacing, and I would appreciate your guidance on how to best navigate the remaining syllabus requirements.\n\n"
                    "Thank you for your time and understanding."
                ),
                "tip": "You don't need to over-explain your private struggles; requesting guidance on academic pacing is standard and respected."
            }
        elif "counselor" in recipient_lower or "counselling" in recipient_lower:
            return {
                "recipient": "Campus Psychological Counselor",
                "subject": "Appointment Request - Student Support",
                "message": (
                    "Dear Student Wellness Wing,\n\n"
                    "I would like to schedule an initial consultation appointment. I have been navigating persistent low mood and academic stress over recent weeks and would appreciate speaking with a counselor.\n\n"
                    "Please let me know available slots this week."
                ),
                "tip": "Campus counseling is strictly confidential and is a standard part of student health resources."
            }
        else:
            return {
                "recipient": "Campus Support / Mentor",
                "subject": "Student support query",
                "message": (
                    "Hello, I am reaching out to inquire about student academic and wellness support options available this semester. "
                    "Things have been challenging and I want to proactively seek support."
                ),
                "tip": "Proactive outreach is a sign of self-advocacy and strength."
            }

    def generate_professional_handoff_summary(self, timeline: str, primary_concerns: List[str], what_helped: List[str], what_did_not_help: List[str], questions_to_ask: List[str]) -> Dict[str, Any]:
        """
        'Take This With You' non-diagnostic summary for a doctor or counselor.
        """
        return {
            "title": "Personal Wellness Summary for Student Consultation",
            "disclaimer": "This document is a private self-report summary compiled by the student to facilitate an initial consultation. It is NOT a clinical diagnosis or medical assessment.",
            "date_prepared": "Today",
            "timeline": timeline or "Past 2 to 4 weeks",
            "primary_concerns": primary_concerns if primary_concerns else ["Academic fatigue and concentration difficulty", "Fluctuating mood and low daytime energy", "Sleep onset disruption"],
            "strategies_attempted": {
                "what_provided_some_relief": what_helped if what_helped else ["4-count breathing exercises", "Short 5-minute study intervals", "Ambient soundscapes"],
                "what_proved_unhelpful": what_did_not_help if what_did_not_help else ["Long unstructured study hours", "Late-night screen use", "Vague motivational content"]
            },
            "student_questions_for_professional": questions_to_ask if questions_to_ask else [
                "How can I rebuild my sleep schedule without waking up anxious?",
                "What strategies can help me handle mid-semester exam panics?",
                "Are there campus accommodations or wellness workshops you recommend?"
            ]
        }

recovery_service = RecoveryService()
