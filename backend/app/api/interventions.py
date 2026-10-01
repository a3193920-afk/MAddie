from typing import List, Dict, Any
from fastapi import APIRouter
from app.models.schemas import InterventionFeedbackRequest, InterventionFeedbackResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/api/interventions", tags=["Interventions"])

@router.get("")
async def list_interventions():
    return list(recommendation_service.INTERVENTIONS.values())

@router.get("/efficacy-stats")
async def get_efficacy_stats():
    return recommendation_service.get_outcome_stats()

@router.post("/feedback", response_model=InterventionFeedbackResponse)
async def submit_intervention_feedback(feedback: InterventionFeedbackRequest):
    recommendation_service.record_feedback(feedback.intervention_id, feedback.rating)
    
    label_map = {
        "a_lot": "reported strong relief",
        "a_little": "felt a noticeable improvement",
        "same": "found it neutral",
        "worse": "needed a different modality"
    }
    
    stat_msg = (
        f"Updated your personal model: You {label_map.get(feedback.rating, 'provided feedback')} "
        f"after {feedback.intervention_name}. Future recommendations will calibrate accordingly."
    )
    
    return InterventionFeedbackResponse(
        status="success",
        message="Thank you for logging your outcome. This directly teaches Maddy what works best for you.",
        user_learning_stat=stat_msg
    )
