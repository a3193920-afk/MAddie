from typing import Dict, Any, Optional

class ContextService:
    """
    Data Minimization & Context Builder.
    Ensures that only the absolute minimum necessary information is passed
    to AI models. Prevents leaking full journal entries, personal identifiers,
    or extraneous history.
    """

    @staticmethod
    def build_minimized_context(
        current_mood: Optional[int] = None,
        current_stress: Optional[int] = None,
        primary_stressor: Optional[str] = None,
        mode: str = "Help me understand",
        consent_ai_context: bool = True
    ) -> Dict[str, Any]:
        if not consent_ai_context:
            return {
                "active_mode": mode,
                "data_minimization_note": "User opted out of context sharing. Zero telemetry sent to AI."
            }

        context = {
            "active_mode": mode,
            "mood_level_1_to_5": current_mood,
            "stress_level_1_to_5": current_stress,
            "primary_stressor": primary_stressor or "General Campus Life",
            "personal_identifiers_included": False,
            "journal_content_included": False
        }
        return context

context_service = ContextService()
