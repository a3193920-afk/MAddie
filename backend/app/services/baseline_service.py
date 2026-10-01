from typing import List, Dict, Any
from app.models.schemas import BaselineMetric

class BaselineService:
    """
    Personal Baseline & Behavioral Deviation Engine.
    Tracks user's own 14-day rolling norm and detects deviations without diagnostic pathologizing.
    """

    def __init__(self):
        # Baseline reference for demo user
        self.personal_baseline = {
            "mood": 3.8, # scale 1-5
            "stress": 2.2, # scale 1-5
            "sleep_hours": 7.2, # hours
            "energy": 3.6, # scale 1-5
            "gaming_minutes": 25 # minutes/day
        }

        # Current recent 3-day average
        self.current_recent = {
            "mood": 2.9,
            "stress": 3.8,
            "sleep_hours": 5.4,
            "energy": 2.3,
            "gaming_minutes": 70
        }

    def get_baseline_comparison(self) -> List[BaselineMetric]:
        metrics = []

        # 1. Stress
        stress_base = self.personal_baseline["stress"]
        stress_curr = self.current_recent["stress"]
        stress_dev = round(((stress_curr - stress_base) / stress_base) * 100, 1)
        metrics.append(BaselineMetric(
            metric="Stress Level",
            baseline_value=stress_base,
            current_value=stress_curr,
            unit="/5",
            deviation_percent=stress_dev,
            status_tone="attention" if stress_dev > 25 else "neutral",
            message=f"Elevated by +{stress_dev}% compared to your normal semester baseline."
        ))

        # 2. Sleep
        sleep_base = self.personal_baseline["sleep_hours"]
        sleep_curr = self.current_recent["sleep_hours"]
        sleep_dev = round(((sleep_curr - sleep_base) / sleep_base) * 100, 1)
        metrics.append(BaselineMetric(
            metric="Sleep Duration",
            baseline_value=sleep_base,
            current_value=sleep_curr,
            unit="h/night",
            deviation_percent=sleep_dev,
            status_tone="attention" if sleep_dev < -15 else "neutral",
            message=f"Down by {abs(sleep_dev)}% compared to your usual 7+ hours."
        ))

        # 3. Mood
        mood_base = self.personal_baseline["mood"]
        mood_curr = self.current_recent["mood"]
        mood_dev = round(((mood_curr - mood_base) / mood_base) * 100, 1)
        metrics.append(BaselineMetric(
            metric="Mood Average",
            baseline_value=mood_base,
            current_value=mood_curr,
            unit="/5",
            deviation_percent=mood_dev,
            status_tone="attention" if mood_dev < -15 else "neutral",
            message=f"Recent mood scores average {mood_curr}/5 compared to your usual {mood_base}/5."
        ))

        # 4. Gaming / Digital Downtime
        game_base = self.personal_baseline["gaming_minutes"]
        game_curr = self.current_recent["gaming_minutes"]
        game_dev = round(((game_curr - game_base) / game_base) * 100, 1)
        metrics.append(BaselineMetric(
            metric="Gaming / Screen Escape",
            baseline_value=game_base,
            current_value=game_curr,
            unit="mins/day",
            deviation_percent=game_dev,
            status_tone="attention" if game_dev > 50 else "neutral",
            message=f"Late evening gaming has increased by +{game_dev}%."
        ))

        return metrics

    def get_behavioral_signal_summary(self) -> Dict[str, Any]:
        """
        Non-diagnostic early signal summary.
        """
        metrics = self.get_baseline_comparison()
        has_significant_deviation = any(m.status_tone == "attention" for m in metrics)

        return {
            "has_deviation": has_significant_deviation,
            "headline": "Your recent pattern differs from your usual routine." if has_significant_deviation else "Your patterns are aligned with your personal baseline.",
            "metrics": metrics,
            "contextual_prompt": (
                "You've been gaming more and sleeping less this week. "
                "Does gaming feel like relaxation, escape, procrastination, or just something you're enjoying?"
            ) if has_significant_deviation else None,
            "non_diagnostic_disclaimer": "This is an early wellness signal reflecting lifestyle changes, not a clinical diagnosis."
        }

baseline_service = BaselineService()
