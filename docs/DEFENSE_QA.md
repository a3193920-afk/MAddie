# CampusCalm - Hackathon Judge Defense & Technical Q&A

### Q1: Why not rely on the LLM itself to detect safety and crisis emergencies?
**Answer:**
LLMs are probabilistic systems prone to sycophancy, tone-drift, prompt injections, and latency spikes. In an acute psychiatric crisis, allowing an LLM to decide whether to provide emergency resources is dangerous and irresponsible.
**CampusCalm uses a deterministic pre-LLM safety interceptor**:
1. Input is screened by regex-driven, multi-tier safety rules in Python before reaching any model API.
2. If acute self-harm or suicide intent is detected, LLM generation is **hard-stopped**.
3. The interface immediately renders verified 24/7 emergency hotlines (Tele-MANAS `14416`, KIRAN `1800-599-0019`, Emergency `112`, and campus counselors).

### Q2: How do you prevent false-positive crisis alerts on Gen-Z and Hinglish slang?
**Answer:**
College students frequently use hyperbolic idioms like *"I'm dead 💀"*, *"I'm totally cooked"*, or *"padhai ne maar rakhi hai"* (studies are beating/killing me).
A naive keyword search for words like "dead" or "maar" would trigger annoying false-alarm crisis popups, destroying user trust.
**Our Solution**:
The safety service applies an exception-layer that parses contextual Gen-Z slang and Hindi academic idioms first. Hyperboles are correctly classified as `NORMAL` or `EMOTIONAL_DISTRESS`, allowing empathetic conversational venting without triggering false emergency locks.

### Q3: How do you ensure the digital companion does not make illegal medical diagnoses?
**Answer:**
We strictly enforce a non-diagnostic boundary across prompts, algorithms, and UI copies:
- The system detects **signals, symptoms, and behavioral shifts**, never psychiatric disorders.
- Phrases like *"You have major depressive disorder"* or *"You have ADHD"* are forbidden.
- Instead, the app uses explainable, respectful language: *"Your recent pattern differs from your usual routine."*
- Screening tools categorize results as *"Low concern"* or *"Elevated symptoms"*, encouraging consultation with human counselors if distress persists.

### Q4: Is the Journal Vault actually encrypted, or is that just marketing copy?
**Answer:**
It is 100% genuine client-side authenticated cryptography using the browser's native **Web Crypto API**:
- **Key Derivation**: PBKDF2 with 100,000 iterations of SHA-256 derived from the student's local passphrase and a cryptographic salt.
- **Cipher**: AES-256-GCM with a 12-byte random Initialization Vector (IV).
- The cleartext never touches our backend server or the AI. When a student chooses "Reframe this thought with CBT", only the single isolated sentence is sent for cognitive reframing, keeping the rest of their journal vault zero-knowledge.

### Q5: What happens if Gemini API has network issues, rate limits, or is offline?
**Answer:**
The app is engineered with **graceful degradation**:
- The deterministic safety guardrails run locally on the server without needing external APIs.
- All somatic grounding exercises (4-4-4 Box Breathing, 5-4-3-2-1 Sensory Grounding) run 100% client-side.
- The 3 games and Web Audio synthesizer run directly in the browser.
- The AI service incorporates a high-fidelity contextual fallback engine that validates student feelings and builds study plans even during network drops.

### Q6: How does the "What Worked For Me?" engine operate?
**Answer:**
Every time a student completes an exercise (breathing, grounding, game, audio), the system asks: *"Did this help? Worse / Same / A little / A lot"*.
The backend updates historical outcome weights. If box breathing consistently achieves higher relief during exam panic compared to games, future recommendations for that student automatically prioritize breathing exercises.
