from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import (
    chat,
    checkins,
    interventions,
    journal,
    insights,
    planner,
    community,
    campus,
    demo,
    recovery,
    auth,
    menstrual
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(chat.router)
app.include_router(checkins.router)
app.include_router(interventions.router)
app.include_router(journal.router)
app.include_router(insights.router)
app.include_router(planner.router)
app.include_router(community.router)
app.include_router(campus.router)
app.include_router(demo.router)
app.include_router(recovery.router)
app.include_router(auth.router)
app.include_router(menstrual.router)

@app.get("/health")
@app.get("/api/health")
async def health_check():
    from app.services.ai_service import ai_service
    is_live = bool(ai_service.client and ai_service.api_key)
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "deterministic_guardrails": "active",
        "gemini_model": settings.GEMINI_MODEL,
        "api_configured": is_live,
        "engine": "Gemini 3.8 Flash (Live API)" if is_live else "Local Offline Neural Fallback Engine"
    }

from pydantic import BaseModel

class APIKeyRequest(BaseModel):
    api_key: str

@app.get("/api/config/ai")
async def get_ai_config():
    from app.services.ai_service import ai_service
    is_live = bool(ai_service.client and ai_service.api_key)
    masked = f"{ai_service.api_key[:4]}...{ai_service.api_key[-4:]}" if ai_service.api_key and len(ai_service.api_key) > 8 else ("Configured" if ai_service.api_key else "")
    return {
        "is_configured": is_live,
        "model": settings.GEMINI_MODEL,
        "masked_key": masked,
        "engine": "Gemini 3.8 Flash (Live API)" if is_live else "Local Offline Neural Fallback Engine"
    }

@app.post("/api/config/ai")
async def set_ai_config(payload: APIKeyRequest):
    from app.services.ai_service import ai_service
    success = ai_service.update_api_key(payload.api_key)
    if success:
        return {"status": "success", "message": "Gemini API connected successfully!", "is_configured": True}
    else:
        return {"status": "warning", "message": "API key saved, but live test failed. Ensure key is valid.", "is_configured": False}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
