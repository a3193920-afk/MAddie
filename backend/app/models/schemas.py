from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# ----------------- Safety & Risk Schemas -----------------
class SafetyVerdict(BaseModel):
    risk_level: str = Field(..., description="NORMAL, EMOTIONAL_DISTRESS, AMBIGUOUS_SAFETY_CONCERN, HIGH_RISK_SELF_HARM, IMMEDIATE_EMERGENCY")
    hard_stop: bool = Field(False, description="Whether to immediately prevent normal LLM response")
    requires_safety_question: bool = Field(False, description="Whether to ask: Are you thinking about hurting yourself right now?")
    reason: str = ""
    suggested_question: Optional[str] = None
    emergency_contacts: List[Dict[str, Any]] = []

class SafetyCheckRequest(BaseModel):
    text: str
    user_context: Optional[Dict[str, Any]] = None

# ----------------- Chat & Context Schemas -----------------
class ChatMessage(BaseModel):
    role: str # "user" or "assistant" or "system"
    content: str
    timestamp: Optional[str] = None

class DynamicQuestion(BaseModel):
    category: str # "emotion", "intensity", "trigger", "duration", "impact", "preference", "coping"
    question: str
    options: Optional[List[str]] = None

class StudyActionBlock(BaseModel):
    time_window: str # e.g. "6:00 - 6:25 PM"
    task_name: str
    category: str # "work", "breathing_reset", "active_break"
    duration_minutes: int
    tip: Optional[str] = None

class StudyActionPlan(BaseModel):
    title: str
    total_time_minutes: int
    blocks: List[StudyActionBlock]
    encouragement: str

class ChatRequest(BaseModel):
    message: str
    mode: str = Field("Help me understand", description="Just listen, Help me understand, Give practical steps, Help me calm down, Help me plan")
    current_mood: Optional[int] = Field(None, ge=1, le=5)
    current_stress: Optional[int] = Field(None, ge=1, le=5)
    primary_stressor: Optional[str] = None
    session_history: Optional[List[ChatMessage]] = []
    consent_ai_context: bool = True
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    mode: str
    safety_verdict: SafetyVerdict
    detected_emotions: List[str] = []
    detected_stressors: List[str] = []
    slang_normalized: Optional[str] = None
    next_questions: List[DynamicQuestion] = []
    suggested_intervention: Optional[Dict[str, Any]] = None
    study_plan: Optional[StudyActionPlan] = None
    context_used: Dict[str, Any] = {}

# ----------------- Auth & User Profile Schemas -----------------
class UserSignupRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=4)
    age: int = Field(..., ge=14, le=100)
    gender: str = Field(..., description="female, male, non-binary, prefer_not_to_say")
    college: Optional[str] = "Campus Scholar"
    emergency_contact_name: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    age: int
    gender: str
    college: Optional[str] = None
    created_at: Optional[str] = None

class UserProfileUpdateRequest(BaseModel):
    name: str
    age: int
    gender: str
    college: Optional[str] = None

class EmergencyContactRequest(BaseModel):
    name: str
    relation: str
    phone: str
    is_primary: bool = False

class EmergencyContactResponse(BaseModel):
    id: str
    user_id: str
    name: str
    relation: str
    phone: str
    is_primary: bool

# ----------------- Menstrual Cycle Schemas -----------------
class MenstrualLogRequest(BaseModel):
    start_date: str # YYYY-MM-DD
    end_date: Optional[str] = None
    cycle_length: int = 28
    period_duration: int = 5
    symptoms: Optional[List[str]] = []
    flow_intensity: str = "medium" # light, medium, heavy
    notes: Optional[str] = None

class MenstrualCycleResponse(BaseModel):
    has_data: bool
    current_day: Optional[int] = None
    cycle_length: Optional[int] = None
    period_duration: Optional[int] = None
    phase_key: Optional[str] = None
    phase_name: Optional[str] = None
    is_pms: Optional[bool] = None
    days_until_next_period: Optional[int] = None
    predicted_next_date: Optional[str] = None
    emotional_climate: Optional[str] = None
    mood_swing_risk: Optional[str] = None
    self_care_tip: Optional[str] = None
    recent_symptoms: Optional[List[str]] = []
    message: Optional[str] = None


# ----------------- Check-in Schemas -----------------
class DailyCheckInRequest(BaseModel):
    mood: int = Field(..., ge=1, le=5) # 1: Very Low to 5: Very Good
    stress: int = Field(..., ge=1, le=5) # 1: Very Low to 5: Overwhelmed
    energy: int = Field(3, ge=1, le=5) # 1: Drained to 5: Energetic
    sleep: str = Field("Okay", description="Very good, Okay, Poor, Very poor")
    stressors: List[str] = []
    notes: Optional[str] = None

class DailyCheckInResponse(BaseModel):
    id: str
    date: str
    mood: int
    stress: int
    energy: int
    sleep: str
    stressors: List[str]
    intervention_recommendation: Optional[Dict[str, Any]] = None
    why_am_i_seeing_this: str

# ----------------- Intervention & Outcome ("What worked for me?") -----------------
class InterventionFeedbackRequest(BaseModel):
    intervention_id: str
    intervention_name: str
    rating: str = Field(..., description="worse, same, a_little, a_lot")
    stress_before: Optional[int] = None
    stress_after: Optional[int] = None
    mood_before: Optional[int] = None
    mood_after: Optional[int] = None
    notes: Optional[str] = None

class InterventionFeedbackResponse(BaseModel):
    status: str
    message: str
    user_learning_stat: str

# ----------------- Planner Schemas -----------------
class PlannerRequest(BaseModel):
    academic_tasks: List[str]
    available_hours: float = 2.0
    stress_level: int = 4
    exam_tomorrow: bool = False

# ----------------- Insights & Baseline Schemas -----------------
class BaselineMetric(BaseModel):
    metric: str
    baseline_value: float
    current_value: float
    unit: str
    deviation_percent: float
    status_tone: str # "neutral", "attention", "positive"
    message: str

class WeeklyResilienceReport(BaseModel):
    period: str
    average_mood: float
    average_stress: float
    average_sleep_hours: float
    top_stressors: List[Dict[str, Any]]
    positive_factors: List[str]
    behavior_signals: List[BaselineMetric]
    effective_interventions: List[str]
    personalized_insight: str
    recommendation: str
    why_am_i_seeing_this: List[str]

# ----------------- Community Post Schemas -----------------
class CommunityPost(BaseModel):
    id: str
    category: str # "Exam stress", "Placement pressure", "Hostel life", etc.
    author_avatar: str
    author_alias: str
    timestamp: str
    content: str
    reactions: Dict[str, int] = {}
    support_replies: int = 0
