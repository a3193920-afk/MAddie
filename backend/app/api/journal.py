import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/journal", tags=["Journal Vault"])

class EncryptedJournalEntry(BaseModel):
    id: Optional[str] = None
    title: str
    ciphertext: str # Base64 encoded AES-GCM ciphertext
    iv: str # Base64 encoded Initialization Vector
    salt: str # Base64 encoded PBKDF2 salt
    mood_tag: int
    stress_tag: int
    tags: List[str] = []
    created_at: Optional[str] = None

class ThoughtReframeRequest(BaseModel):
    automatic_thought: str
    situation: Optional[str] = None

# In-memory store for encrypted entries
ENCRYPTED_VAULT: List[Dict[str, Any]] = []

@router.post("")
async def save_journal_entry(entry: EncryptedJournalEntry):
    entry_id = entry.id or str(uuid.uuid4())[:8]
    timestamp = entry.created_at or datetime.now().strftime("%b %d, %Y - %I:%M %p")
    record = {
        "id": entry_id,
        "title": entry.title,
        "ciphertext": entry.ciphertext,
        "iv": entry.iv,
        "salt": entry.salt,
        "mood_tag": entry.mood_tag,
        "stress_tag": entry.stress_tag,
        "tags": entry.tags,
        "created_at": timestamp
    }
    ENCRYPTED_VAULT.insert(0, record)
    return {"status": "saved", "id": entry_id, "timestamp": timestamp}

@router.get("")
async def get_journal_entries():
    return ENCRYPTED_VAULT

@router.post("/reframe-thought")
async def reframe_thought(request: ThoughtReframeRequest):
    """
    Data-minimized CBT Thought Reframing.
    Receives ONLY the single target thought, not the full journal.
    """
    thought = request.automatic_thought.strip()
    
    # Cognitive distortions identification & reframing
    distortion = "All-or-Nothing Thinking / Catastrophizing"
    balanced_perspective = (
        "While this situation feels intense right now, one single exam, interview, or interaction "
        "does not dictate your worth or your entire future trajectory. You have overcome difficult academic "
        "hurdles before, and you can take this one step at a time."
    )
    
    if "never" in thought.lower() or "always" in thought.lower():
        distortion = "Overgeneralization"
        balanced_perspective = (
            "Notice words like 'always' or 'never'. They make setbacks feel permanent. "
            "A more balanced view: 'This specific instance was challenging, but it does not mean every future attempt will be the same.'"
        )
    elif "fail" in thought.lower() or "rejected" in thought.lower():
        distortion = "Catastrophizing"
        balanced_perspective = (
            "A rejection or low score is uncomfortable feedback on a specific task, not a final verdict on your intelligence or capacity to learn."
        )

    return {
        "original_thought": thought,
        "situation": request.situation or "Campus Stress Event",
        "identified_cognitive_trap": distortion,
        "evidence_check_question": "Is there concrete proof that this single event completely decides what will happen next month or next year?",
        "balanced_reframing": balanced_perspective,
        "action_step": "Write down this balanced thought on paper and focus solely on your next 15-minute task."
    }
