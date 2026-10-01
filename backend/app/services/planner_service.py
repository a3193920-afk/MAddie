from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.models.schemas import StudyActionPlan, StudyActionBlock

class PlannerService:
    """
    Stress-to-Action Academic Planner.
    Converts academic overwhelm into structured, bite-sized Pomodoro sessions
    with mandatory breathing and physical reset intervals.
    """

    @staticmethod
    def generate_plan(
        tasks: List[str],
        available_hours: float = 2.0,
        exam_tomorrow: bool = False
    ) -> StudyActionPlan:
        if not tasks:
            tasks = ["Core Revision Chapter", "High-Priority Assignment", "Concept Flashcards"]

        total_minutes = int(available_hours * 60)
        blocks: List[StudyActionBlock] = []

        now = datetime.now()
        # Round up to nearest 5 minutes
        current_time = now + timedelta(minutes=(5 - now.minute % 5) % 5)

        remaining_time = total_minutes
        task_idx = 0

        # We schedule in 25m work + 5m breathing reset cadence
        while remaining_time >= 30 and task_idx < len(tasks):
            task_label = tasks[task_idx]
            
            # Work block: 25 mins
            work_duration = min(25, remaining_time - 5)
            end_work_time = current_time + timedelta(minutes=work_duration)
            blocks.append(StudyActionBlock(
                time_window=f"{current_time.strftime('%I:%M')} - {end_work_time.strftime('%I:%M %p')}",
                task_name=f"Focus Sprint: {task_label}",
                category="work",
                duration_minutes=work_duration,
                tip="Turn off notifications, pick one sub-topic only, no multitasking."
            ))
            current_time = end_work_time
            remaining_time -= work_duration

            # Reset block: 5 mins
            if remaining_time >= 5:
                end_reset_time = current_time + timedelta(minutes=5)
                blocks.append(StudyActionBlock(
                    time_window=f"{current_time.strftime('%I:%M')} - {end_reset_time.strftime('%I:%M %p')}",
                    task_name="Parasympathetic Reset (4-4-4 Breathing)",
                    category="breathing_reset",
                    duration_minutes=5,
                    tip="Step away from screen, drink half a glass of water, exhale slowly."
                ))
                current_time = end_reset_time
                remaining_time -= 5

            task_idx += 1

        # Final wind-down or buffer
        if remaining_time > 0:
            end_wind_down = current_time + timedelta(minutes=remaining_time)
            blocks.append(StudyActionBlock(
                time_window=f"{current_time.strftime('%I:%M')} - {end_wind_down.strftime('%I:%M %p')}",
                task_name="Study Shutdown & Desk Clear",
                category="active_break",
                duration_minutes=remaining_time,
                tip="Close all open browser tabs, write tomorrow's first task on a sticky note, protect your sleep."
            ))

        encouragement = (
            "One step at a time. An exam or assignment evaluates what you wrote today, not your worth as a human being."
            if exam_tomorrow
            else "You don't have to finish everything today—just making progress on this one block is enough."
        )

        return StudyActionPlan(
            title="Calm & Focused Academic Sprint",
            total_time_minutes=total_minutes,
            blocks=blocks,
            encouragement=encouragement
        )

planner_service = PlannerService()
