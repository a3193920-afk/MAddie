# CampusCalm - Product & Architectural Plan

## 1. Problem Statement
College students regularly encounter acute academic pressure, placement anxiety, hostel loneliness, relationship tensions, and fear of failure. Campus counselling centres often suffer from stigma, low staffing, and long queues. Traditional consumer chatbots either offer generic superficial advice or risk unsafe hallucinations during acute distress.

## 2. Solution & Core Loop
**CampusCalm** is a private, compassionate digital wellness companion with deterministic safety architecture and personalized learning loops.

```
Student Daily Check-in / Chat
  ↓
Language Normalization (Gen-Z & Hinglish)
  ↓
Deterministic Safety Filter (Pre-LLM Interceptor)
  ├── HIGH RISK → Hard Stop → 24/7 Hotlines (Tele-MANAS, KIRAN, 112)
  └── NORMAL / DISTRESS → Empathetic AI (Non-diagnostic)
        ↓
Compare with 14-day Personal Baseline
  ↓
Recommend Intervention (Breathing, Grounding, Focus, Audio, Games)
  ↓
"What Worked for Me?" Outcome Learning Loop
```

## 3. Technology Stack Decisions
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide icons, Recharts.
- **Backend**: Python 3.14, FastAPI, Pydantic v2, Uvicorn, Pytest.
- **AI & Reasoning**: Google Gemini via `google-genai` SDK with strict data minimization context builder.
- **Client-Side Cryptography**: Web Crypto API (PBKDF2 key derivation + AES-256-GCM authenticated encryption).
- **Audio Synthesizer**: Web Audio API biquad filters and noise oscillators (no external CDN dependencies).

## 4. Key Differentiators
1. **Deterministic Safety Guardrail**: A pure software gatekeeper executing before LLM inference, preventing AI hallucination during psychiatric crises.
2. **Contextual Hinglish & Slang Disambiguation**: Differentiates colloquial hyperbole (*"I'm dead 💀"*, *"padhai ne maar rakhi hai"*) from genuine emergency (*"marne ka man kar raha hai"*).
3. **Personal Baseline vs. Diagnostic Labelling**: Flags deviations (*"Your recent pattern differs from your usual routine"*) without pathologizing normal human responses.
4. **"What Worked For Me?" Continuous Feedback**: Measures pre- and post-intervention stress and calibrates personalized recommendations over time.
