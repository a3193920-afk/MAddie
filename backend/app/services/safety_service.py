import re
from typing import Tuple, List, Dict, Any
from app.core.config import settings
from app.models.schemas import SafetyVerdict

class SafetyService:
    """
    Deterministic Crisis Guardrail & Safety Architecture.
    Runs BEFORE any LLM generation to detect risk, disambiguate Gen-Z/Hinglish slang,
    and enforce a hard-stop with emergency resources for acute self-harm/suicide risks.
    """

    # 1. High-risk suicide/self-harm explicit patterns (English + Hinglish/Hindi)
    HIGH_RISK_PATTERNS = [
        # Explicit English self-harm / suicide
        r"\b(?:kill\s+(?:my\s*self|myself))\b",
        r"\b(?:want\s+to\s+die)\b",
        r"\b(?:commit\s+suicide)\b",
        r"\b(?:end(?:ing)?\s+my\s+life)\b",
        r"\b(?:better\s+off\s+dead)\b",
        r"\b(?:hang\s+myself)\b",
        r"\b(?:slit\s+(?:my\s+)?wrists?)\b",
        r"\b(?:overdose\s+(?:on|pills))\b",
        r"\b(?:jump\s+off\s+(?:a\s+)?(?:roof|bridge|building))\b",
        r"\b(?:how\s+(?:do\s+i|to)\s+(?:hurt|kill)\s+myself)\b",
        r"\b(?:suicidal\s+thoughts?)\b",
        r"\b(?:planning\s+(?:to\s+)?suicide)\b",
        r"\b(?:goodbye\s+cruel\s+world)\b",
        
        # Explicit Hindi / Hinglish self-harm / suicide
        r"\b(?:marne\s+ka\s+man)\b",
        r"\b(?:jaan\s+de\s+(?:dunga|dungi|du))\b",
        r"\b(?:khud\s+ko\s+(?:khatam|maar|harm))\b",
        r"\b(?:suicide\s+(?:karne|kar\s+lu|ka\s+soch))\b",
        r"\b(?:zindagi\s+khatam\s+karni)\b",
        r"\b(?:apne\s+aap\s+ko\s+nuksan)\b",
    ]

    # 2. Ambiguous Safety Triggers (Require confirmation rather than normal advice)
    AMBIGUOUS_SAFETY_PATTERNS = [
        r"\b(?:i\s+can['’]?t\s+go\s+on\s+any\s*more)\b",
        r"\b(?:what['’]?s\s+the\s+point\s+of\s+(?:living|being\s+here|life))\b",
        r"\b(?:no\s*one\s+would\s+care\s+if\s+i\s+(?:disappeared|wasn['’]?t\s+here|died))\b",
        r"\b(?:i\s+just\s+want\s+(?:everything|it\s+all)\s+to\s+stop)\b",
        r"\b(?:i\s+can['’]?t\s+take\s+this\s+pain\s+any\s*more)\b",
        r"\b(?:feeling\s+like\s+disappearing\s+forever)\b",
        r"\b(?:sab\s+kuch\s+chhod\s+ke\s+chale\s+jane\s+ka\s+man)\b",
    ]

    # 3. Casual Gen-Z & Hinglish expressions (NOT a crisis! Normal stress/colloquialism)
    CASUAL_SLANG_EXCEPTIONS = [
        # "I'm dead" / "dead 💀" / "ded"
        r"(?:i['’]?m|im)\s+dead\b(?:\s*💀|\s*😂|\s*😭)?",
        r"\bdead\s*(?:💀|af|fr)\b",
        r"\bded\s*(?:💀)?\b",
        
        # "I'm cooked" / "we are cooked"
        r"\b(?:i['’]?m|we['’]?re|totally)\s+cooked\b",
        
        # "padhai ne maar rakhi hai" (Hindi for "studies are overwhelming/killing me")
        r"padhai\s+ne\s+maar\s+rakhi\s+hai",
        r"exam\s+ne\s+maar\s+rakhi\s+hai",
        r"syllabus\s+ne\s+maar\s+rakhi\s+hai",
        
        # "Life is killing me because of..." (hyperbolic contextual stress)
        r"life\s+is\s+killing\s+me\s+because\s+of",
        r"placements?\s+ne\s+jaan\s+le\s+rakhi\s+hai",
        r"assignments?\s+killing\s+me",
        
        # Common distress slang
        r"\bscene\s+kharab\s+hai\b",
        r"\blife\s+is\s+not\s+lifing\b",
        r"\bbahut\s+pressure\s+hai\b",
        r"\bmood\s+off\b",
        r"\blowkey\s+(?:stressed|anxious|sad|freaking\s+out)\b",
        r"\bhighkey\s+(?:stressed|freaking\s+out|panicking)\b",
        r"\bcan['’]?t\s+deal\s+rn\b",
    ]

    # 4. General Emotional Distress patterns (Vent, sadness, tearful, anxiety)
    EMOTIONAL_DISTRESS_PATTERNS = [
        r"\b(?:crying|tears|sob(?:bing)?)\b",
        r"\b(?:overwhelmed|panic\s*attack|hyperventilat(?:ing|e))\b",
        r"\b(?:depressed|hopeless|worthless|isolated)\b",
        r"\b(?:so\s+lonely|no\s+friends|homesick)\b",
        r"\b(?:failed\s+(?:my\s+)?exam|interview\s+rejected|rejection)\b",
        r"\b(?:breakup|broken\s+heart|cheated\s+on)\b",
    ]

    def __init__(self):
        self._compiled_high_risk = [re.compile(p, re.IGNORECASE) for p in self.HIGH_RISK_PATTERNS]
        self._compiled_ambiguous = [re.compile(p, re.IGNORECASE) for p in self.AMBIGUOUS_SAFETY_PATTERNS]
        self._compiled_slang = [re.compile(p, re.IGNORECASE) for p in self.CASUAL_SLANG_EXCEPTIONS]
        self._compiled_distress = [re.compile(p, re.IGNORECASE) for p in self.EMOTIONAL_DISTRESS_PATTERNS]

    def evaluate_safety(self, text: str, user_context: Dict[str, Any] = None) -> SafetyVerdict:
        """
        Deterministic multi-layer safety classifier.
        Order of evaluation:
        1. Check if high-risk explicit patterns match.
        2. If matched, verify whether it's an explicit false-positive casual slang (e.g. 'I am dead 💀').
        3. If true high-risk, enforce HARD STOP immediately.
        4. Check ambiguous safety concerns -> ask safety question.
        5. Check emotional distress -> normal empathetic LLM with gentle care.
        6. Otherwise NORMAL.
        """
        clean_text = text.strip()
        lower_text = clean_text.lower()

        # Step 1: Check if input matches known casual slang first to avoid false alarms
        is_casual_slang = False
        for pattern in self._compiled_slang:
            if pattern.search(lower_text):
                is_casual_slang = True
                break

        # Step 2: Check high risk explicit self-harm / suicide
        for pattern in self._compiled_high_risk:
            match = pattern.search(lower_text)
            if match:
                # If casual slang was also detected, check if the match was merely part of the slang
                # E.g. "I'm dead 💀" matches 'dead', but it is explicitly slang
                matched_phrase = match.group(0)
                if is_casual_slang and ("dead" in matched_phrase or "maar" in matched_phrase):
                    # Check if there is also an actual self-harm intent
                    if not any(crit in lower_text for crit in ["kill myself", "want to die", "commit suicide", "cut myself", "end my life"]):
                        # Regarded as hyperbolic slang
                        return SafetyVerdict(
                            risk_level="EMOTIONAL_DISTRESS" if any(w in lower_text for w in ["pressure", "stressed", "crying", "kharab"]) else "NORMAL",
                            hard_stop=False,
                            reason="Contextual Gen-Z / Hinglish casual expression detected without self-harm intent."
                        )

                # Genuine High Risk Self-Harm / Suicide -> HARD STOP
                return SafetyVerdict(
                    risk_level="HIGH_RISK_SELF_HARM",
                    hard_stop=True,
                    requires_safety_question=True,
                    reason="Acute crisis indicator detected. Safety guardrail active.",
                    suggested_question="I want to check on your immediate safety. Are you thinking about hurting yourself right now?",
                    emergency_contacts=settings.CRISIS_RESOURCES + settings.CAMPUS_RESOURCES
                )

        # Step 3: Check Ambiguous Safety Triggers
        for pattern in self._compiled_ambiguous:
            if pattern.search(lower_text):
                return SafetyVerdict(
                    risk_level="AMBIGUOUS_SAFETY_CONCERN",
                    hard_stop=False, # We allow supportive response, but require front-end to show check question
                    requires_safety_question=True,
                    reason="Ambiguous distress phrasing detected. Verification suggested.",
                    suggested_question="I hear how much pain you're carrying right now. Are you feeling safe, or are you thinking about hurting yourself?",
                    emergency_contacts=settings.CRISIS_RESOURCES
                )

        # Step 4: Check Emotional Distress (venting, crying, overwhelmed)
        for pattern in self._compiled_distress:
            if pattern.search(lower_text):
                return SafetyVerdict(
                    risk_level="EMOTIONAL_DISTRESS",
                    hard_stop=False,
                    requires_safety_question=False,
                    reason="Emotional distress expressed. Empathetic validation indicated."
                )

        # Step 5: Normal conversational state
        return SafetyVerdict(
            risk_level="NORMAL",
            hard_stop=False,
            requires_safety_question=False,
            reason="Standard conversational tone."
        )

safety_service = SafetyService()
