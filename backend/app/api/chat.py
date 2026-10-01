from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    result = ai_service.process_chat(
        message=request.message,
        mode=request.mode,
        current_mood=request.current_mood,
        current_stress=request.current_stress,
        primary_stressor=request.primary_stressor,
        session_history=[m.model_dump() for m in (request.session_history or [])],
        consent_ai_context=request.consent_ai_context,
        user_id=request.user_id
    )
    return ChatResponse(**result)
