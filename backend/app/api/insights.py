from fastapi import APIRouter
from app.services.baseline_service import baseline_service
from app.services.insight_service import insight_service
from app.models.schemas import WeeklyResilienceReport

router = APIRouter(prefix="/api/insights", tags=["Insights & Baseline"])

@router.get("/baseline")
async def get_baseline_comparison():
    return baseline_service.get_baseline_comparison()

@router.get("/behavioral-signals")
async def get_behavioral_signals():
    return baseline_service.get_behavioral_signal_summary()

@router.get("/weekly-report", response_model=WeeklyResilienceReport)
async def get_weekly_report():
    return insight_service.get_weekly_report()
