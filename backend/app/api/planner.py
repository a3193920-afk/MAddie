from fastapi import APIRouter
from app.models.schemas import PlannerRequest, StudyActionPlan
from app.services.planner_service import planner_service

router = APIRouter(prefix="/api/planner", tags=["Stress-to-Action Planner"])

@router.post("/generate", response_model=StudyActionPlan)
async def generate_study_plan(req: PlannerRequest):
    return planner_service.generate_plan(
        tasks=req.academic_tasks,
        available_hours=req.available_hours,
        exam_tomorrow=req.exam_tomorrow
    )
