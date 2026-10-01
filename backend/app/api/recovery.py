from fastapi import APIRouter
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.services.recovery_service import recovery_service

router = APIRouter(prefix="/api/recovery", tags=["Recovery Engine"])

class CompleteMissionRequest(BaseModel):
    mission_id: str
    obstacle_faced: Optional[str] = None

class LoopBreakerRequest(BaseModel):
    event: str
    thought: str
    emotion: str
    action: str
    next_outcome: str

class FeedbackRequest(BaseModel):
    interaction_type: str
    rating: str
    factor_helped: Optional[str] = None
    user_note: Optional[str] = None

class AddManualItemRequest(BaseModel):
    section: str
    content: str

class HelpMessageRequest(BaseModel):
    recipient: str
    topic: str
    tone: Optional[str] = "gentle"

class HandoffSummaryRequest(BaseModel):
    timeline: Optional[str] = ""
    primary_concerns: Optional[List[str]] = []
    what_helped: Optional[List[str]] = []
    what_did_not_help: Optional[List[str]] = []
    questions_to_ask: Optional[List[str]] = []

@router.get("/modes")
async def get_modes():
    return recovery_service.get_support_modes()

@router.get("/missions")
async def get_missions(category: Optional[str] = None):
    return recovery_service.get_missions(category)

@router.post("/missions/complete")
async def complete_mission(req: CompleteMissionRequest):
    return recovery_service.complete_mission(req.mission_id, req.obstacle_faced)

@router.post("/loop-breaker")
async def loop_breaker(req: LoopBreakerRequest):
    return recovery_service.evaluate_loop_breaker(
        event=req.event,
        thought=req.thought,
        emotion=req.emotion,
        action=req.action,
        next_outcome=req.next_outcome
    )

@router.post("/feedback")
async def record_feedback(req: FeedbackRequest):
    return recovery_service.record_feedback(
        interaction_type=req.interaction_type,
        rating=req.rating,
        factor_helped=req.factor_helped,
        user_note=req.user_note
    )

@router.get("/manual")
async def get_user_manual():
    return recovery_service.get_user_manual()

@router.post("/manual")
async def add_manual_item(req: AddManualItemRequest):
    return recovery_service.add_manual_item(req.section, req.content)

@router.post("/help-message")
async def generate_help_message(req: HelpMessageRequest):
    return recovery_service.generate_outreach_message(req.recipient, req.topic, req.tone or "gentle")

@router.post("/handoff-summary")
async def generate_handoff_summary(req: HandoffSummaryRequest):
    return recovery_service.generate_professional_handoff_summary(
        timeline=req.timeline or "",
        primary_concerns=req.primary_concerns or [],
        what_helped=req.what_helped or [],
        what_did_not_help=req.what_did_not_help or [],
        questions_to_ask=req.questions_to_ask or []
    )
