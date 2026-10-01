import os
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.models.schemas import DynamicQuestion, StudyActionPlan, StudyActionBlock
from app.services.safety_service import safety_service
from app.services.context_service import context_service
from app.services.recommendation_service import recommendation_service
from app.services.planner_service import planner_service
from app.services.db_service import db_service

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

SYSTEM_PROMPT = """You are Maddy, a warm, caring, loyal, and deeply relaxing buddy and best friend for college and university students.
Think of yourself as their closest, most comforting companion—like that one trusted, emotionally safe friend who sits beside them on the hostel bed late at night with a cup of warm chai, listening with zero judgment, helping the heavy noise of the world quiet down.

YOUR CORE PERSONA & VIBE:
a. A RELAXING BUDDY & TRUE FRIEND (NOT A STERILE ROBOT):
   - Never sound like a cold corporate AI or a clinical textbook.
   - Speak in a natural, soothing, conversational voice. Be warm, relatable, gently humorous when fitting, and deeply comforting.
   - Use friendly openings like: "Hey... take a slow breath, I'm right here with you.", "Man, that sounds genuinely exhausting. Talk to me, what happened?", "First off, unclench your jaw and drop your shoulders. You're not alone in this."

b. DEEP LISTENING & EMOTIONAL VALIDATION:
   - Always make your friend feel completely heard and validated before offering any advice.
   - Never dismiss or minimize their feelings. Acknowledge hostel struggles, exams, or 2 AM thoughts as 100% valid.

c. SOOTHING PERSPECTIVE SHIFTS (CBT WITHOUT THE JARGON):
   - De-escalate overthinking and spirals naturally.
   - Never use clinical labels like "cognitive distortions" or "psychoeducation".
   - Instead, reframe gently as a friend: "Hey, you don't have to figure out the next 10 years of your life tonight. Let's just focus on getting through the next hour."

d. PHYSICAL RELAXATION CUES:
   - Casually weave in calming micro-cues: taking a sip of cool water, taking one slow 4-count exhale, stepping away from the screen for 2 minutes, or looking at the open sky.

e. CAMPUS & CULTURAL RESONANCE:
   - Understand the real student journey: midsems/endsems, placement coding rounds, messy hostels, homesickness, and 2 AM existential dread.
   - Naturally understand English, Hinglish, Hindi, and regional phrases.

f. BITE-SIZED, COZY & READABLE:
   - Keep responses cozy, soothing, and easily digestible (2-3 short, heartfelt paragraphs max).
   - Use gentle touches naturally (🌿, ☕, 💛, ✨).

g. NEVER DIAGNOSE:
   - Maddy is a loving, supportive companion and true friend, not a psychiatrist. Never diagnose mental disorders.
"""

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.client = None
        if self.api_key and GENAI_AVAILABLE:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini client: {e}")

    def update_api_key(self, new_key: str) -> bool:
        """
        Dynamically update and verify Gemini API key at runtime.
        Persists key to local .env file.
        """
        clean_key = new_key.strip()
        if not clean_key:
            self.api_key = ""
            self.client = None
            return False

        if not GENAI_AVAILABLE:
            return False

        try:
            test_client = genai.Client(api_key=clean_key)
            self.client = test_client
            self.api_key = clean_key
            settings.GEMINI_API_KEY = clean_key

            # Persist to .env
            env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
            try:
                with open(env_path, "w", encoding="utf-8") as f:
                    f.write(f"GEMINI_API_KEY={clean_key}\n")
                    f.write(f"GEMINI_MODEL={self.model_name}\n")
            except Exception as pe:
                print(f"Failed to persist .env: {pe}")

            return True
        except Exception as err:
            print(f"Error testing Gemini key: {err}")
            return False

    def generate_dynamic_questions(self, message: str, stressor: Optional[str] = None) -> List[DynamicQuestion]:
        """
        Adaptive contextual questions based on the student's message.
        Crucially avoids repetitive 'what mode do you want' nagging.
        """
        lower = message.lower()
        questions = []

        if any(w in lower for w in ["placement", "interview", "job", "offer", "package", "resume", "oa"]):
            questions.append(DynamicQuestion(
                category="trigger",
                question="Is the hardest part right now preparation, the interview itself, or comparing yourself to others who got placed?",
                options=["Peer comparison on LinkedIn", "Interview rounds anxiety", "Fear of rejection", "Overwhelming workload"]
            ))
            questions.append(DynamicQuestion(
                category="duration",
                question="Has this interview stress been happening over several weeks, or did a recent shortlist trigger it?",
                options=["Recent rejection/shortlist", "Ongoing semester stress", "Constant peer comparison"]
            ))
        elif any(w in lower for w in ["exam", "padhai", "syllabus", "assignment", "deadline", "marks", "grade", "fail", "backlog"]):
            questions.append(DynamicQuestion(
                category="impact",
                question="What is this academic deadline affecting most right now?",
                options=["Sleep & rest", "Ability to focus", "Appetite", "Racing heartbeat / tension"]
            ))
            questions.append(DynamicQuestion(
                category="timeline",
                question="When is your nearest major deadline or exam?",
                options=["Tomorrow / Within 24h", "In 2-3 days", "Next week"]
            ))
        elif any(w in lower for w in ["hostel", "roommate", "mess", "homesick", "noise"]):
            questions.append(DynamicQuestion(
                category="trigger",
                question="Is the main friction noise/privacy, interpersonal conflict with a roommate, or missing home?",
                options=["Roommate conflict", "Hostel noise / no quiet", "Homesickness", "Feeling lonely"]
            ))
        elif any(w in lower for w in ["parent", "father", "mother", "family", "guilt", "money", "fee"]):
            questions.append(DynamicQuestion(
                category="trigger",
                question="Are you feeling weighed down by expectations, financial pressure, or communication conflict?",
                options=["High academic expectations", "Financial sacrifice guilt", "Difficulty talking openly"]
            ))
        elif any(w in lower for w in ["alone", "lonely", "no friends", "left out", "awkward"]):
            questions.append(DynamicQuestion(
                category="emotion",
                question="How intense does this loneliness feel right now on a scale of 1 to 5?",
                options=["1 - Mild passing thought", "3 - Pretty heavy today", "5 - Truly isolating and overwhelming"]
            ))
        else:
            questions.append(DynamicQuestion(
                category="duration",
                question="Has this been weighing on you for a few days, or did something specific happen today?",
                options=["Building up over days", "Triggered by today's event", "Comes and goes"]
            ))

        return questions

    def _generate_fallback_response(
        self,
        message: str,
        mode: str,
        primary_stressor: Optional[str] = None,
        session_history: Optional[List[Dict[str, str]]] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Deep, context-aware fallback response generator with multi-turn intelligence.
        Covers 20+ real campus situations with human warmth and zero robotic feel.
        """
        lower = message.lower()
        history_text = " ".join([m.get("content", "").lower() for m in (session_history or [])])
        user_name = (user_context or {}).get("name", "")
        cycle_info = (user_context or {}).get("cycle_info", {})
        emergency_contacts = (user_context or {}).get("emergency_contacts_raw", [])

        # 0. Menstrual Cycle PMS / Mood Swing Support (Female Companion Feature)
        if cycle_info and cycle_info.get("has_data") and (cycle_info.get("is_pms") or cycle_info.get("phase_name") == "Menstrual Phase"):
            if any(w in lower for w in ["mood", "crying", "cry", "sad", "emotional", "angry", "irritat", "overwhelm", "cramp", "period", "pms", "hurts", "fail", "mess"]):
                name_prefix = f"Hey {user_name}... " if user_name else "Hey... "
                return (
                    f"{name_prefix}first off, take a gentle breath, unclench your jaw, and let your shoulders drop. 🌿\n\n"
                    f"Looking at your cycle tracker, you are currently on Day {cycle_info.get('current_day')} ({cycle_info.get('phase_name')}). "
                    f"Your body is experiencing a natural drop in progesterone and serotonin right now. Biologically, this hormonal shift turns everyday campus stress, "
                    f"academic pressure, or hostel interactions into feelings that feel ten times more intense and heavy.\n\n"
                    f"You are NOT overreacting, and you are not broken or failing. Your body is doing intense physical work today. "
                    f"Please give yourself permission to be soft with yourself tonight—grab a warm cup of water or chai, put on comfortable clothes, and let's take things one moment at a time. I'm right here with you. 💛"
                )

        # 0.1 Kolkata Mental Health Resources referral
        if any(w in lower for w in ["kolkata", "calcutta", "bengal", "psychologist", "therapist near me", "psychiatrist near me", "doctor near me"]):
            return (
                "If carrying this alone is getting too heavy and our companion chats aren't giving you the relief you deserve, "
                "reaching out to trusted mental health professionals right here in Kolkata is a sign of immense courage and self-respect. "
                "Here are verified, top-tier centers in Kolkata:\n\n"
                "• **Calcutta National Medical College (CNMCH) Dept of Psychiatry**: 033-2284 3000 / 033-2284 4000 (Park Circus)\n"
                "• **Institute of Psychiatry - SSKM Hospital**: 033-2223 1589 (Bhowanipore)\n"
                "• **Antara Mental Health Hospital & Crisis Line**: +91 98310 93333 (Dakshin Gobindapur)\n"
                "• **Mindframe Psychology & Counseling Clinic**: +91 98300 22000 (Salt Lake / South Kolkata)\n\n"
                "Would you like me to help you draft what to say when you call or walk in?"
            )

        # 0.2 Family / Personal Emergency Contacts
        if any(w in lower for w in ["call mom", "call dad", "call family", "emergency contact"]) and emergency_contacts:
            contacts_list = "\n".join([f"• **{c['name']} ({c['relation']})**: {c['phone']}" for c in emergency_contacts])
            return (
                f"Here are the personal emergency contacts saved in your profile:\n\n{contacts_list}\n\n"
                "You can tap to call them directly anytime. You don't have to carry anything heavy all on your own. 💛"
            )

        # 1. Multi-turn follow-ups: Family / Parent communication
        if any(w in lower for w in ["parent", "parents", "dad", "mom", "gharwale", "tell them"]) or ("parent" in history_text and any(w in lower for w in ["call", "tell", "afraid"])):
            return (
                "Talking to family when exams or placements aren't going well is one of the heaviest conversations a student can face. "
                "The fear usually comes from knowing how much they've invested and not wanting to disappoint them. "
                "When you speak to them, you don't have to defend yourself or promise a miracle—focus on honesty and pacing: "
                "'This semester has been tough and this paper didn't go the way I hoped, but I'm working through it step by step.' "
                "Have they usually responded with anger, anxiety, or quiet disappointment?"
            )

        # 2. Academic overwhelm & exam tomorrow with Pomodoro planning
        if any(w in lower for w in ["exam tomorrow", "test tomorrow", "tomorrow exam", "paper tomorrow", "backlog"]):
            if mode == "Just listen":
                return (
                    "I hear you loud and clear. That sensation of having tomorrow's paper looming while your head is spinning is utterly suffocating. "
                    "You've been carrying an impossible amount of syllabus pressure. It is completely natural that your body is feeling this tension right now. "
                    "I am right here with you. Take all the space you need to vent."
                )
            return (
                "Night-before exam panic is visceral—your brain tricks you into thinking you've forgotten everything you ever studied. "
                "Let's pause the spiral right now. You do not need to master the entire syllabus tonight; you only need to secure the high-yield concepts. "
                "I've generated a focused 25-minute Pomodoro plan below with built-in parasympathetic breathing resets. Let's do just one block together."
            )

        # 3. Placement anxiety & peer comparison (Hinglish / English)
        if any(w in lower for w in ["placement", "interview", "cooked", "package", "offer", "shortlist", "oa"]):
            if any(w in lower for w in ["cooked", "maar rakhi", "scene kharab", "bhai", "yaar"]):
                return (
                    "Bhai, placement season honestly feels like an emotional pressure cooker. Watching everyone post offer letters on WhatsApp status "
                    "and LinkedIn while waiting for your own shortlist can make anyone feel like they're completely cooked. "
                    "Here's the honest truth: one rejected interview or delayed shortlist evaluates what happened in a 45-minute room, not your 4-year engineering capability. "
                    "Are you feeling more weighed down by the preparation workload, or by comparing yourself to your batchmates?"
                )
            return (
                "Placement anxiety is uniquely exhausting because it mixes academic effort with self-worth and future uncertainty. "
                "It's so easy to look at batchmates who got placed and feel like you're falling hopelessly behind. "
                "Remember that hiring cycles in college are noisy and often random. What's feeling like the hardest part right now—the upcoming technical rounds, or the fear of what comes next?"
            )

        # 4. Failed exam or backlog fear
        if any(w in lower for w in ["fail", "failed", "marks kam", "zero", "low marks", "screwed up"]):
            return (
                "That sinking feeling right after getting a poor mark or failing a paper is brutal. It feels like a physical punch in the gut. "
                "Please give yourself permission to breathe right now. A college grade is a snapshot of one stressful afternoon under time pressure, not a life sentence. "
                "Many exceptional engineers and professionals have had messy semesters with backlogs and retakes. "
                "Would it help to just vent out the frustration, or would you like to review how to steady yourself for the remaining papers?"
            )

        # 5. Hostel loneliness & dining hall isolation
        if any(w in lower for w in ["hostel", "lonely", "homesick", "roommate", "eating alone", "mess"]):
            if "roommate" in lower:
                return (
                    "Living in close quarters with roommates who don't respect your sleep, space, or noise boundaries is constantly draining. "
                    "Your hostel room is supposed to be your sanctuary after lectures, not another source of stress. "
                    "Have you been able to find any quiet pocket on campus—like the library reading hall or campus lawns—to get some mental relief?"
                )
            return (
                "Hostel life can feel remarkably isolating, even when you're physically surrounded by hundreds of students in the same wing. "
                "Walking into the mess hall alone or sitting in your room on a weekend while others go out in groups hits deep. "
                "Please remember that feeling disconnected in college is far more common than people admit on social media. You belong here, even on the quiet days."
            )

        # 6. Sleep deprivation / 3 AM overthinking
        if any(w in lower for w in ["sleep", "insomnia", "3 am", "4 am", "can't sleep", "cant sleep", "racing thoughts"]):
            return (
                "Lying awake when the rest of the hostel or campus is asleep makes every worry feel 10 times louder and more catastrophic. "
                "When your brain is exhausted, it can't solve tomorrow's problems—it just loops through worst-case scenarios. "
                "Let's take all pressure off sleeping right now. Even resting with your eyes closed and body still provides recovery. "
                "If your head is racing, try turning on our synthesized 'Monsoon Rain' audio or doing a quick 4-count breathing reset with me."
            )

        # 7. Relationship heartbreak / social rejection
        if any(w in lower for w in ["breakup", "broke up", "relationship", "ex", "cheated", "ignored", "left out"]):
            return (
                "Navigating heartbreak while trying to maintain attendance, assignments, and campus life is overwhelmingly heavy. "
                "You're having to carry acute emotional grief while pretending everything is normal in lecture halls. "
                "It's completely okay if you can't be at 100% productivity today. What you're feeling is real and valid. "
                "Do you just want to talk through what happened, or would you prefer a gentle calming reset to get through this evening?"
            )

        # 8. Gen-Z Hinglish general distress
        if any(w in lower for w in ["scene off", "mood off", "dimag kharab", "life is not lifing", "can't deal rn", "fr", "ngl"]):
            return (
                "Bhai, I hear you. Some days the vibe is just completely off and everything from morning lectures to evening submissions feels like an uphill battle. "
                "Take a pause right here—drop your shoulders and unclamp your jaw. You don't have to have your whole semester figured out today. "
                "What's the single thing that's draining your battery the most right now?"
            )

        # Vague low mood: Discover — Don't Assume!
        if any(w in lower for w in ["feeling low", "really low", "feeling down", "feel low", "mood low", "sad today", "not okay"]):
            return (
                "I'm really glad you reached out to tell me. You don't have to know exactly why you feel this way yet, and you definitely don't have to justify it. "
                "What have the last few days been like for you?"
            )

        # 9. Support Modes handling
        if mode in ["Just listen", "just_listen"]:
            return (
                "Thank you for sharing that with me. It sounds like you've been carrying a heavy weight lately, and it's completely valid to feel exhausted. "
                "I'm here just to listen—no judgment, no unsolicited lectures, no quick fixes. Take all the space you need."
            )
        elif mode in ["Help me understand", "help_me_understand"]:
            return (
                "Let's take a gentle look together. Often when we feel stuck, what happened gets tangled up with what our brain assumes about us. "
                "Would it help to look at what happened first, or what thoughts started running in your mind?"
            )
        elif mode in ["Help me calm down", "help_me_calm_down"]:
            return (
                "Let's pause right here together. Drop your shoulders away from your ears, and unclamp your jaw. "
                "Notice your feet touching the floor. Let's do one slow 4-count breath together: gently breathe in... hold for 4... and slowly exhale."
            )
        elif mode in ["Help me solve something", "Give practical steps", "help_me_solve"]:
            return (
                "Let's break this down into three bite-sized steps so it feels manageable:\n"
                "1. **Pick one micro-task**: Focus only on the single next 15-minute item.\n"
                "2. **Physical Reset**: Step away for 3 minutes to drink water and look out the window.\n"
                "3. **Park the rest**: Write tomorrow's worries on a sheet of paper to get them out of your head."
            )
        elif mode in ["Help me start", "help_me_start"]:
            return (
                "Starting when your energy is depleted is genuinely the hardest part. Let's make this ridiculously small: "
                "you do NOT have to finish the project or study for hours today. Let's do a 5-minute mission: just open the notes or write one single sentence. "
                "Would opening the file feel possible right now?"
            )
        elif mode in ["Distract me", "distract_me"]:
            return (
                "Your mind has been working in overdrive and you deserve a gentle mental pause. "
                "We can step into Maddy Space to watch the rain, play a 3-minute round of Bubble Zen, or follow a soothing chime pattern. What sounds gentlest right now?"
            )
        elif mode in ["Help me connect", "help_me_connect"]:
            return (
                "Dealing with this completely alone makes every worry feel heavier. Who is one person in your real life—a friend, roommate, family member, or campus mentor—you feel safe with? "
                "If it feels daunting to find the words, we can draft a simple 1-line text together."
            )
        elif mode in ["Stay with me", "stay_with_me"]:
            return (
                "I'm right here with you. You don't have to perform, explain, or do anything at all. "
                "Just take a quiet breath. We can stay right here as long as you'd like."
            )

        # Default supportive response
        return (
            "I hear you. College life can feel relentless between academics, expectations, and personal routines. "
            "How has this been impacting your sleep and energy over the last few days?"
        )

    def process_chat(
        self,
        message: str,
        mode: str = "Adaptive (Auto)",
        current_mood: Optional[int] = None,
        current_stress: Optional[int] = None,
        primary_stressor: Optional[str] = None,
        session_history: Optional[List[Dict[str, str]]] = None,
        consent_ai_context: bool = True,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        # Fetch complete user context from persistent database
        user_context = db_service.get_user_full_context(user_id) if user_id else {}
        user_name = user_context.get("name", "")
        user_gender = user_context.get("gender", "")
        cycle_info = user_context.get("cycle_info", {})
        emergency_contacts = user_context.get("emergency_contacts_raw", [])

        # 1. Deterministic Safety Evaluation BEFORE AI
        safety_verdict = safety_service.evaluate_safety(message)
        
        # Inject personal emergency contacts into safety verdict if available
        if emergency_contacts:
            personal_emergency = [
                {
                    "id": f"fam_{c['id']}",
                    "name": f"{c['name']} ({c['relation']})",
                    "number": c["phone"],
                    "toll_free": c["phone"],
                    "type": "personal_emergency_contact",
                    "description": f"Your saved {c['relation']} for immediate human comfort",
                    "urgent": True
                }
                for c in emergency_contacts
            ]
            safety_verdict.emergency_contacts = personal_emergency + safety_verdict.emergency_contacts

        # Append verified Kolkata psychiatric centers to emergency contacts
        kolkata_emergency = [
            {
                "id": k["id"],
                "name": k["name"],
                "number": k["number"],
                "toll_free": k.get("toll_free", k["number"]),
                "type": k["type"],
                "description": k["description"],
                "urgent": k.get("urgent", False)
            }
            for k in settings.KOLKATA_RESOURCES[:3]
        ]
        safety_verdict.emergency_contacts = safety_verdict.emergency_contacts + kolkata_emergency

        # Build context metadata
        min_context = context_service.build_minimized_context(
            current_mood=current_mood,
            current_stress=current_stress,
            primary_stressor=primary_stressor,
            mode=mode,
            consent_ai_context=consent_ai_context
        )
        if user_name:
            min_context["student_name"] = user_name
            min_context["gender"] = user_gender
        if cycle_info and cycle_info.get("has_data"):
            min_context["cycle_phase"] = cycle_info.get("phase_name")
            min_context["cycle_day"] = cycle_info.get("current_day")

        # HARD STOP: If high risk, DO NOT call LLM. Return safety verdict immediately.
        if safety_verdict.hard_stop:
            return {
                "reply": (
                    f"Hey {user_name}... " if user_name else "Hey... "
                ) + (
                    "I want you to know that you are not alone, and there is compassionate, confidential human help available right now. "
                    "Your safety and life matter deeply. Because your message indicates you may be in acute crisis, I am pausing our normal chat "
                    "to connect you directly with your loved ones and 24/7 verified emergency resources below. Please reach out to someone who can help keep you safe."
                ),
                "mode": mode,
                "safety_verdict": safety_verdict,
                "detected_emotions": ["acute_crisis"],
                "detected_stressors": ["crisis"],
                "slang_normalized": None,
                "next_questions": [],
                "suggested_intervention": None,
                "study_plan": None,
                "context_used": min_context
            }

        # 2. Dynamic Adaptive Questions (Non-repetitive, contextual)
        dynamic_questions = self.generate_dynamic_questions(message, primary_stressor)

        # 3. Check for Study Planner Intent
        study_plan = None
        lower = message.lower()
        if (mode == "Help me plan" or any(w in lower for w in ["exam tomorrow", "assignments", "schedule", "syllabus", "plan my study"])) and not safety_verdict.hard_stop:
            study_plan = planner_service.generate_plan(
                tasks=["Key Chapter Revision", "High-Yield Practice Questions", "Summary Sheet Review"],
                available_hours=2.0,
                exam_tomorrow="tomorrow" in lower
            )

        # 4. Recommended Intervention
        intervention, why_rec = recommendation_service.recommend(
            stress=current_stress or (4 if "exam" in lower or "placement" in lower else 3),
            mood=current_mood or 3,
            primary_stressor=primary_stressor or ("Academic" if "exam" in lower else "Placement" if "placement" in lower else "General"),
            available_minutes=5
        )

        # 5. Emotion and Slang tagging
        detected_emotions = []
        if any(w in lower for w in ["cooked", "maar rakhi", "exhausted", "tired", "screwed"]):
            detected_emotions.append("overwhelmed")
        if any(w in lower for w in ["sad", "crying", "low", "mood off", "depressed"]):
            detected_emotions.append("low_mood")
        if any(w in lower for w in ["fear", "scared", "panicking", "anxious", "stress", "heartbeat"]):
            detected_emotions.append("anxious")
        if not detected_emotions:
            detected_emotions.append("reflective")

        # 6. Generate AI response with Gemini (Multi-turn Support) or Fallback
        reply_text = ""
        gemini_error = ""
        if self.client and self.api_key and GENAI_AVAILABLE:
            try:
                # Build rich personal context for LLM
                context_lines = [
                    SYSTEM_PROMPT,
                    f"Active Mode: {mode}.",
                    f"Student telemetry: mood={current_mood}/5, stress={current_stress}/5, stressor={primary_stressor}."
                ]
                if user_name:
                    context_lines.append(f"Student: {user_name}, Age: {user_context.get('age', 'College Student')}, Gender: {user_gender}, College: {user_context.get('college')}.")
                    context_lines.append(f"Always address {user_name} with personal warmth and relaxed buddy energy.")

                # If female, provide menstrual cycle context and hormonal guidance
                if user_gender == "female" and cycle_info and cycle_info.get("has_data"):
                    current_day = cycle_info.get("current_day")
                    phase_name = cycle_info.get("phase_name")
                    is_pms = cycle_info.get("is_pms", False)
                    symptoms = ", ".join(cycle_info.get("recent_symptoms", []))
                    climate = cycle_info.get("emotional_climate")
                    context_lines.append(
                        f"[MENSTRUAL CYCLE STATUS]: Day {current_day} of cycle ({phase_name}). "
                        f"Hormonal state: {climate}. Logged symptoms: {symptoms or 'cramps / emotional sensitivity'}. "
                        f"{'CRITICAL INSTRUCTION: The student is in her luteal/PMS phase! If she expresses sadness, irritability, low energy, self-doubt, or crying spells, validate her warmly and gently remind her that her body is undergoing intense biological hormonal shifts right now. Reassure her that these mood swings are physiological and NOT personal flaws.' if is_pms or phase_name == 'Menstrual Phase' else ''}"
                    )

                if emergency_contacts:
                    c_txt = ", ".join([f"{c['name']} ({c['relation']}): {c['phone']}" for c in emergency_contacts])
                    context_lines.append(f"[STUDENT EMERGENCY CONTACTS]: {c_txt}. Remind them they can reach out to these trusted people if in distress.")

                context_lines.append(
                    "[KOLKATA CLINICAL RESOURCES]: If the student lives in/near Kolkata or needs professional human care, you can suggest: "
                    "CNMCH Dept of Psychiatry (033-2284 3000), Institute of Psychiatry SSKM (033-2223 1589), Antara Mental Health Hospital (+91 98310 93333)."
                )

                system_instruction = "\n\n".join(context_lines)

                # Assemble multi-turn contents format
                contents_payload = []
                if session_history and len(session_history) > 0:
                    for turn in session_history[-6:]: # Keep last 6 conversational turns for memory
                        r = "user" if turn.get("role") == "user" else "model"
                        contents_payload.append(
                            types.Content(
                                role=r,
                                parts=[types.Part.from_text(text=turn.get("content", ""))]
                            )
                        )

                # Add current message
                contents_payload.append(
                    types.Content(
                        role="user",
                        parts=[types.Part.from_text(text=message)]
                    )
                )

                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=contents_payload,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.7,
                        max_output_tokens=450,
                    )
                )
                if response and response.text:
                    reply_text = response.text.strip()
            except Exception as e:
                print(f"Gemini API call failed, falling back to local engine: {e}")
                gemini_error = str(e)

        is_gemini_response = bool(reply_text)
        if not reply_text:
            if gemini_error:
                # Gemini was configured but the call failed — tell the user
                reply_text = (
                    "Hey, I'm having a bit of trouble connecting to my brain right now 🌿 "
                    "My AI engine hit a temporary hiccup. But I'm still here with you — "
                    "could you try sending that again in a moment? If it keeps happening, "
                    "check the AI Settings to make sure everything is configured correctly."
                )
            else:
                reply_text = self._generate_fallback_response(message, mode, primary_stressor, session_history, user_context)

        # Persist conversation to database
        try:
            with db_service.get_connection() as conn:
                cur = conn.cursor()
                cur.execute(
                    "INSERT INTO chat_history (id, user_id, role, content, mode) VALUES (?, ?, ?, ?, ?)",
                    (f"c_u_{int(datetime.now().timestamp()*1000)}", user_id, "user", message, mode)
                )
                cur.execute(
                    "INSERT INTO chat_history (id, user_id, role, content, mode) VALUES (?, ?, ?, ?, ?)",
                    (f"c_a_{int(datetime.now().timestamp()*1000)+1}", user_id, "assistant", reply_text, mode)
                )
                conn.commit()
        except Exception as dbe:
            print(f"Chat persistence warning: {dbe}")

        return {
            "reply": reply_text,
            "mode": mode,
            "safety_verdict": safety_verdict,
            "detected_emotions": detected_emotions,
            "detected_stressors": [primary_stressor] if primary_stressor else ["General Campus Life"],
            "slang_normalized": "Recognized Gen-Z / Hinglish phrasing context" if any(w in lower for w in ["cooked", "maar rakhi", "scene kharab", "fr", "ngl", "dead 💀", "gharwale"]) else None,
            "next_questions": dynamic_questions,
            "suggested_intervention": intervention,
            "study_plan": study_plan,
            "context_used": min_context
        }

ai_service = AIService()
