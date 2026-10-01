from typing import Dict, Any, List, Optional, Tuple

class RecommendationService:
    """
    Deterministic Intervention Recommendation Engine.
    Combines rule-based clinical wellness logic with student historical outcome data
    ("What worked for me?").
    """

    # Intervention library
    INTERVENTIONS = {
        "box_breathing": {
            "id": "box_breathing",
            "title": "4-4-4 Box Breathing Reset",
            "duration": "3 mins",
            "category": "Breathing",
            "description": "Slow, regulated breathing cycle to down-regulate the sympathetic nervous system and reduce acute exam panic.",
            "type": "breathing",
            "target_stress_min": 3
        },
        "grounding_54321": {
            "id": "grounding_54321",
            "title": "5-4-3-2-1 Sensory Grounding",
            "duration": "4 mins",
            "category": "Grounding",
            "description": "Engage all five senses to anchor your attention away from racing thoughts and back into your physical room.",
            "type": "grounding",
            "target_stress_min": 3
        },
        "bubble_zen": {
            "id": "bubble_zen",
            "title": "Bubble Zen Calming Game",
            "duration": "3 mins",
            "category": "Calming Game",
            "description": "Gentle, rhythmic bubble popping synchronized with calming tones to redirect tense focus.",
            "type": "game",
            "target_stress_min": 1
        },
        "study_planner_reset": {
            "id": "study_planner_reset",
            "title": "Stress-to-Action Study Sprint",
            "duration": "5 mins",
            "category": "Planning",
            "description": "Deconstruct overwhelming syllabi into 25-minute manageable chunks with guaranteed rest buffers.",
            "type": "planning",
            "target_stress_min": 3
        },
        "mind_match": {
            "id": "mind_match",
            "title": "Mind Match Memory Focus",
            "duration": "3 mins",
            "category": "Focus Game",
            "description": "Gentle memory pairing to gently restore working memory without pressure.",
            "type": "game",
            "target_stress_min": 1
        },
        "rain_soundscape": {
            "id": "rain_soundscape",
            "title": "Soothing Monsoon Rain Audio",
            "duration": "10 mins",
            "category": "Audio",
            "description": "Continuous synthesized rain soundscape designed to mask noisy hostel corridors and aid relaxation.",
            "type": "audio",
            "target_stress_min": 2
        }
    }

    def __init__(self):
        # In-memory store for outcome feedback ("What worked for me")
        # Structure: intervention_id -> {"total": int, "helpful_count": int}
        self.outcome_history = {
            "box_breathing": {"total": 8, "helpful_count": 7},
            "grounding_54321": {"total": 5, "helpful_count": 4},
            "bubble_zen": {"total": 6, "helpful_count": 5},
            "study_planner_reset": {"total": 4, "helpful_count": 4},
            "mind_match": {"total": 3, "helpful_count": 2},
            "rain_soundscape": {"total": 7, "helpful_count": 6}
        }

    def record_feedback(self, intervention_id: str, rating: str):
        """Record outcome rating: worse, same, a_little, a_lot"""
        if intervention_id not in self.outcome_history:
            self.outcome_history[intervention_id] = {"total": 0, "helpful_count": 0}
        
        self.outcome_history[intervention_id]["total"] += 1
        if rating in ["a_little", "a_lot"]:
            self.outcome_history[intervention_id]["helpful_count"] += 1

    def get_outcome_stats(self) -> List[Dict[str, Any]]:
        stats = []
        for i_id, data in self.outcome_history.items():
            if data["total"] > 0:
                pct = int((data["helpful_count"] / data["total"]) * 100)
                stats.append({
                    "id": i_id,
                    "name": self.INTERVENTIONS.get(i_id, {}).get("title", i_id),
                    "efficacy_percent": pct,
                    "sessions_count": data["total"]
                })
        return sorted(stats, key=lambda x: x["efficacy_percent"], reverse=True)

    def recommend(
        self,
        stress: int,
        mood: int,
        primary_stressor: Optional[str] = None,
        available_minutes: int = 5,
        user_preference: Optional[str] = None
    ) -> Tuple[Dict[str, Any], str]:
        """
        Deterministic rule-based recommendation with explainable reasoning.
        """
        # Rule 1: High stress + Academic overwhelm + time >= 5 min -> Study Planner or Breathing
        if stress >= 4 and primary_stressor in ["Academic", "Exams", "Assignments"]:
            if available_minutes >= 5:
                item = self.INTERVENTIONS["study_planner_reset"]
                reason = "Based on your high academic stress rating (4/5) and need to overcome exam overwhelm with small concrete steps."
                return item, reason
            else:
                item = self.INTERVENTIONS["box_breathing"]
                reason = "Based on elevated academic tension and short available time to calm nervous system."
                return item, reason

        # Rule 2: Acute physical stress / anxiety (stress >= 4)
        if stress >= 4:
            item = self.INTERVENTIONS["box_breathing"]
            reason = "Recommended because your stress level is high (4/5). 4-4-4 box breathing activates the parasympathetic relaxation response."
            return item, reason

        # Rule 3: Hostel noise / sleep / fatigue
        if primary_stressor in ["Hostel", "Sleep", "Homesickness"]:
            item = self.INTERVENTIONS["rain_soundscape"]
            reason = "Recommended to provide ambient noise masking for hostel environments and ease sleep or resting transitions."
            return item, reason

        # Rule 4: Overthinking / racing thoughts / placement anxiety
        if primary_stressor in ["Placement", "Career", "Fear of failure"] or stress == 3:
            item = self.INTERVENTIONS["grounding_54321"]
            reason = "Recommended because placement worry often causes future-tripping; 5-4-3-2-1 sensory grounding re-anchors you to the present moment."
            return item, reason

        # Rule 5: User preference for gentle gaming or low energy
        if user_preference == "game" or mood <= 2:
            item = self.INTERVENTIONS["bubble_zen"]
            reason = "Recommended for a low-demand, gentle redirection of attention when mood is low."
            return item, reason

        # Default fallback
        item = self.INTERVENTIONS["box_breathing"]
        reason = "A gentle 3-minute breath cycle to reset your baseline between classes or study sessions."
        return item, reason

recommendation_service = RecommendationService()
