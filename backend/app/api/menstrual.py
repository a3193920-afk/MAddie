from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any, Optional
from app.models.schemas import MenstrualLogRequest, MenstrualCycleResponse
from app.services.db_service import db_service

router = APIRouter(prefix="/api/menstrual", tags=["Menstrual Cycle Tracking"])

@router.get("/current/{user_id}", response_model=MenstrualCycleResponse)
async def get_current_cycle(user_id: str):
    user = db_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("gender") != "female":
        return MenstrualCycleResponse(
            has_data=False,
            message="Menstrual cycle tracking is designed for female biology. Switch profile gender in settings to activate."
        )

    prediction = db_service.predict_cycle_phase(user_id)
    return MenstrualCycleResponse(**prediction)

@router.post("/log/{user_id}", response_model=MenstrualCycleResponse)
async def log_period_cycle(user_id: str, payload: MenstrualLogRequest):
    user = db_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    res = db_service.log_menstrual_cycle(
        user_id=user_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        cycle_length=payload.cycle_length,
        period_duration=payload.period_duration,
        symptoms=payload.symptoms,
        flow_intensity=payload.flow_intensity,
        notes=payload.notes
    )
    return MenstrualCycleResponse(**res)

@router.get("/history/{user_id}")
async def get_cycle_history(user_id: str):
    return db_service.get_menstrual_history(user_id)
