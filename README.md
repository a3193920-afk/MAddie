# CampusCalm 🌿
> **Campus Mental Wellness Companion with Deterministic Crisis Guardrails**  
> *Built for a 32-hour College Hackathon*

---

## 🎯 Overview

College students experience intense academic pressure, placement anxiety, hostel loneliness, relationship tensions, and fear of failure. Campus counselling centres are often overloaded or underutilized due to social friction.

**CampusCalm** is a compassionate, privacy-first digital wellness companion. It is strictly designed to **support mental wellness—never diagnosing mental disorders or replacing qualified human professionals.**

---

## 💡 Key Architectural Innovations

### 1. Deterministic Crisis Safety Architecture (Pre-LLM Interceptor)
```
User Message
    ↓
Deterministic Safety Filter (Regex & Slang Exception Layer)
    ├── HIGH RISK (Suicide / Self-Harm) → HARD STOP
    │       ↓
    │   Crisis Overlay (Direct Click-to-Call: Tele-MANAS 14416, KIRAN 1800-599-0019, 112)
    │
    └── NORMAL / DISTRESS → Empathetic Conversational AI
```
General-purpose LLMs are never allowed to decide crisis responses alone. Acute risks trigger an immediate deterministic hard-stop with verified 24/7 human emergency hotlines.

### 2. Gen-Z & Hinglish Semantic Disambiguation
Understands colloquial campus slang without triggering false alarms:
- *"I'm dead 💀"* / *"I am totally cooked"* → Contextualized as non-crisis emotional venting.
- *"padhai ne maar rakhi hai"* / *"scene kharab hai"* → Contextualized as common academic pressure expressions.
- Genuine distress in Hindi/Hinglish (*"marne ka man kar raha hai"*) correctly triggers the crisis protocol.

### 3. Personal Baseline & Behavioral Pattern Engine
Establishes rolling 14-day norms (mood, stress, sleep, digital screen time) and detects shifts (e.g. Gaming +180%, Sleep -25%). Wording is strictly non-diagnostic:
> *"Your recent pattern differs from your usual routine."*

### 4. "What Worked For Me?" Continuous Feedback Loop
After every exercise (4-4-4 Breathing, 5-4-3-2-1 Grounding, Games, Audio), students log:
> *Did this help? Worse / Same / A little / A lot*  
The recommendation engine prioritizes modalities with proven personal relief.

### 5. Client-Side Cryptography (Web Crypto API)
- **Key Derivation**: PBKDF2 (100,000 iterations, SHA-256)
- **Encryption**: AES-256-GCM with 12-byte random IV
- Cleartext never reaches the server or AI. CBT thought reframing operates with single-thought data minimization.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Python 3.14, FastAPI, Pydantic v2, Uvicorn, Pytest |
| **AI Layer** | Google Gemini (`gemini-2.5-flash`) via `google-genai` + Resilient Fallback Engine |
| **Audio** | Client-side synthesized soundscapes via Web Audio API (Rain, Waves, Pink Noise) |
| **Database** | Supabase / PostgreSQL Schema with Row Level Security (RLS) policies |
| **Security** | Web Crypto API (PBKDF2 + AES-256-GCM), Data Minimization Context Builder |

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/test_safety.py -v   # Run 9/9 safety unit tests
python -m uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000` (Swagger UI at `/docs`).

### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 🎭 7 Judge Demo Personas (One-Touch Switcher)

Use the **Judge Demo Bar** at the top of the app to test any of the 7 pre-seeded scenarios:

| Persona | Scenario | Verified Capability |
|---|---|---|
| **Persona A** | Exam Overwhelm | Empathetic chat + Stress-to-Action Pomodoro study planner |
| **Persona B** | Placement Anxiety | CBT thought reframing + 5-4-3-2-1 Sensory Grounding |
| **Persona C** | Hostel Loneliness | Active listening mode + Anonymous peer community |
| **Persona D** | Gen-Z / Hinglish | *"Bhai padhai ne maar rakhi hai, I'm cooked"* slang context parsing |
| **Persona E** | Behavioral Shift | Baseline alert (*Gaming +180%, Sleep -25%*) with non-diagnostic framing |
| **Persona F** | Crisis Guardrail | Safe test phrase triggers deterministic hard-stop & Tele-MANAS (14416) |
| **Persona G** | Menstrual Wellness | Optional cycle phase pattern correlation with study fatigue |

---

## 📁 Repository Structure

```
campus-calm/
├── backend/
│   ├── app/
│   │   ├── api/        # chat, checkins, interventions, journal, insights, planner, community, campus, demo
│   │   ├── core/       # config & verified emergency hotlines
│   │   ├── models/     # Pydantic schemas
│   │   ├── services/   # safety_service, ai_service, context_service, baseline_service, recommendation_service
│   │   └── main.py     # FastAPI entrypoint
│   └── tests/          # test_safety.py (unit tests)
├── frontend/
│   ├── src/
│   │   ├── components/ # home, chat, relax, games (3), track, journal, help, privacy, onboarding, demo
│   │   ├── lib/        # crypto.ts (Web Crypto), webAudio.ts (synthesizer), api.ts
│   │   ├── types.ts    # TypeScript definitions
│   │   ├── App.tsx     # Root app orchestration
│   │   └── main.tsx    # React mount
│   └── package.json
├── supabase/
│   ├── migrations/     # 001_initial_schema.sql (PostgreSQL + RLS)
│   └── seed/           # demo_seed.sql
├── docs/
│   ├── PLANNING.md
│   ├── PROGRESS.md
│   ├── DEPLOYMENT.md
│   └── DEFENSE_QA.md
├── README.md
└── .env.example
```

---

## 🛡️ Responsible AI Disclaimers

1. **Non-Diagnostic Policy**: CampusCalm tracks self-reported stress, sleep, and lifestyle patterns. It does not diagnose clinical depression, anxiety disorders, bipolar disorder, ADHD, or psychiatric conditions.
2. **Emergency Protocol**: For acute self-harm, suicidal ideation, or medical emergencies, users are immediately directed to **Tele-MANAS (14416)**, **KIRAN (1800-599-0019)**, or **112**.
