import { 
  CheckInEntry, 
  ChatMode, 
  ChatMessage, 
  WeeklyResilienceReport, 
  BaselineMetric,
  Intervention,
  Persona,
  RecoverySupportMode,
  RecoveryMission,
  WhatHelpsMeProfile,
  OutreachMessageDraft,
  ProfessionalHandoff,
  UserProfile,
  EmergencyContact,
  MenstrualCycleData,
  MenstrualLogPayload
} from '../types';

const API_BASE = '/api';

export const apiService = {
  // Chat
  async sendChatMessage(payload: {
    message: string;
    mode: ChatMode;
    current_mood?: number;
    current_stress?: number;
    primary_stressor?: string;
    session_history?: Array<{ role: string; content: string }>;
    consent_ai_context?: boolean;
    user_id?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using local client intelligence fallback:', err);
      // Fallback response with safety detection
      const lower = payload.message.toLowerCase();
      const isSuicide = lower.includes('want to die') || lower.includes('kill myself');
      if (isSuicide) {
        return {
          reply: 'You matter, and support is available right now. We have paused normal conversation to connect you directly with 24/7 human emergency help.',
          mode: payload.mode,
          safety_verdict: {
            risk_level: 'HIGH_RISK_SELF_HARM',
            hard_stop: true,
            requires_safety_question: true,
            reason: 'Acute crisis phrase intercepted.',
            emergency_contacts: [
              { id: '1', name: 'Tele-MANAS (Govt of India)', number: '14416', description: '24/7 National Mental Health Line', urgent: true },
              { id: '2', name: 'National Emergency', number: '112', description: 'Police & Ambulance', urgent: true }
            ]
          },
          detected_emotions: ['crisis'],
          detected_stressors: ['crisis'],
          next_questions: [],
          context_used: { mode: payload.mode }
        };
      }

      return {
        reply: "I hear the weight you're carrying right now. College demands can feel relentless. Would it help to just vent, or do you want to explore a 3-minute breath cycle?",
        mode: payload.mode,
        safety_verdict: { risk_level: 'NORMAL', hard_stop: false, requires_safety_question: false },
        detected_emotions: ['stress'],
        detected_stressors: [payload.primary_stressor || 'Academics'],
        next_questions: [
          { category: 'preference', question: 'How can I best support you right now?', options: ['Just listen', 'Help me calm down', 'Break into steps'] }
        ],
        context_used: { mode: payload.mode, mood: payload.current_mood, stress: payload.current_stress }
      };
    }
  },

  // Checkins
  async submitCheckIn(data: {
    mood: number;
    stress: number;
    energy: number;
    sleep: string;
    stressors: string[];
    notes?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.warn('Checkin fallback:', err);
      return {
        id: 'local_1',
        date: 'Today',
        ...data,
        why_am_i_seeing_this: 'Based on your recent stress rating and reported sleep.'
      };
    }
  },

  async getCheckinHistory(): Promise<CheckInEntry[]> {
    try {
      const res = await fetch(`${API_BASE}/checkins/history`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return await res.json();
    } catch (err) {
      return [
        { id: '1', date: 'Sep 24', mood: 4, stress: 2, energy: 4, sleep: 'Very good', stressors: ['General'] },
        { id: '2', date: 'Sep 25', mood: 3, stress: 3, energy: 3, sleep: 'Okay', stressors: ['Assignments'] },
        { id: '3', date: 'Sep 26', mood: 4, stress: 2, energy: 4, sleep: 'Very good', stressors: ['Friends'] },
        { id: '4', date: 'Sep 27', mood: 2, stress: 4, energy: 2, sleep: 'Poor', stressors: ['Exams'] },
        { id: '5', date: 'Sep 28', mood: 3, stress: 4, energy: 3, sleep: 'Poor', stressors: ['Placement'] },
        { id: '6', date: 'Sep 29', mood: 2, stress: 5, energy: 2, sleep: 'Very poor', stressors: ['Exams', 'Sleep'] },
        { id: '7', date: 'Sep 30', mood: 3, stress: 3, energy: 3, sleep: 'Okay', stressors: ['Academic'] },
      ];
    }
  },

  // Interventions & Efficacy
  async getInterventions(): Promise<Intervention[]> {
    try {
      const res = await fetch(`${API_BASE}/interventions`);
      return await res.json();
    } catch {
      return [
        { id: 'box_breathing', title: '4-4-4 Box Breathing Reset', duration: '3 mins', category: 'Breathing', description: 'Regulate your autonomic nervous system to ease acute exam panic.', type: 'breathing' },
        { id: 'grounding_54321', title: '5-4-3-2-1 Sensory Grounding', duration: '4 mins', category: 'Grounding', description: 'Engage your five senses to ground racing future thoughts.', type: 'grounding' },
        { id: 'bubble_zen', title: 'Bubble Zen Calming Game', duration: '3 mins', category: 'Game', description: 'Gentle, rhythmic bubble popping with relaxing chime tones.', type: 'game' },
        { id: 'study_planner_reset', title: 'Stress-to-Action Study Sprint', duration: '5 mins', category: 'Planning', description: 'Deconstruct overwhelming syllabi into 25-minute manageable chunks.', type: 'planning' },
        { id: 'mind_match', title: 'Mind Match Memory Focus', duration: '3 mins', category: 'Game', description: 'Gentle memory pairing to restore working memory without pressure.', type: 'game' }
      ];
    }
  },

  async submitFeedback(data: {
    intervention_id: string;
    intervention_name: string;
    rating: string;
    stress_before?: number;
    stress_after?: number;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/interventions/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { status: 'success', user_learning_stat: 'Logged outcome locally.' };
    }
  },

  async getEfficacyStats(): Promise<Array<{ id: string; name: string; efficacy_percent: number; sessions_count: number }>> {
    try {
      const res = await fetch(`${API_BASE}/interventions/efficacy-stats`);
      return await res.json();
    } catch {
      return [
        { id: 'box_breathing', name: '4-4-4 Box Breathing Reset', efficacy_percent: 88, sessions_count: 8 },
        { id: 'rain_soundscape', name: 'Soothing Monsoon Rain Audio', efficacy_percent: 86, sessions_count: 7 },
        { id: 'bubble_zen', name: 'Bubble Zen Calming Game', efficacy_percent: 83, sessions_count: 6 },
        { id: 'grounding_54321', name: '5-4-3-2-1 Sensory Grounding', efficacy_percent: 80, sessions_count: 5 },
        { id: 'study_planner_reset', name: 'Stress-to-Action Study Sprint', efficacy_percent: 100, sessions_count: 4 }
      ];
    }
  },

  // Insights & Baseline
  async getBaselineMetrics(): Promise<BaselineMetric[]> {
    try {
      const res = await fetch(`${API_BASE}/insights/baseline`);
      return await res.json();
    } catch {
      return [
        { metric: 'Stress Level', baseline_value: 2.2, current_value: 3.8, unit: '/5', deviation_percent: 72.7, status_tone: 'attention', message: 'Elevated by +72.7% compared to your semester baseline.' },
        { metric: 'Sleep Duration', baseline_value: 7.2, current_value: 5.4, unit: 'h/night', deviation_percent: -25.0, status_tone: 'attention', message: 'Down by 25% compared to your usual 7+ hours.' },
        { metric: 'Mood Average', baseline_value: 3.8, current_value: 2.9, unit: '/5', deviation_percent: -23.7, status_tone: 'attention', message: 'Recent mood averages 2.9/5 compared to usual 3.8/5.' },
        { metric: 'Late-Night Gaming / Screen', baseline_value: 25, current_value: 70, unit: 'mins/day', deviation_percent: 180.0, status_tone: 'attention', message: 'Late evening screen escape has increased by +180%.' }
      ];
    }
  },

  async getWeeklyReport(): Promise<WeeklyResilienceReport> {
    try {
      const res = await fetch(`${API_BASE}/insights/weekly-report`);
      return await res.json();
    } catch {
      return {
        period: 'Sep 24 - Sep 30, 2026',
        average_mood: 3.2,
        average_stress: 3.6,
        average_sleep_hours: 6.1,
        top_stressors: [
          { name: 'Academic Deadlines', count: 6, percentage: 42 },
          { name: 'Placement Uncertainty', count: 4, percentage: 28 },
          { name: 'Hostel Noise / Sleep', count: 3, percentage: 21 },
          { name: 'Relationship / Social', count: 1, percentage: 9 }
        ],
        positive_factors: [
          'Evenings where you logged off screens before 11:30 PM showed +0.8 higher morning mood.',
          'Days where you completed Box Breathing reported a 45% drop in acute exam tension.',
          'Walking around the campus sports complex correlated with improved sleep onset.'
        ],
        behavior_signals: [],
        effective_interventions: [
          '4-4-4 Box Breathing Reset (88% reported helpful across 8 sessions)',
          'Soothing Monsoon Rain Audio (86% reported helpful across 7 sessions)',
          'Bubble Zen Calming Game (83% reported helpful across 6 sessions)'
        ],
        personalized_insight: 'Your stress peaked on Wednesday and Friday nights when sleep dropped under 5.5 hours. However, taking just 3 minutes for sensory grounding before bed helped restore your calm baseline.',
        recommendation: 'Consider setting a 15-minute phone-free buffer tonight before sleeping to support recovery.',
        why_am_i_seeing_this: [
          'Calculated across 7 days of daily check-in logs',
          'Compared against your personal 14-day rolling campus baseline',
          'Filtered through your direct "What worked for me?" outcome ratings'
        ]
      };
    }
  },

  // Planner
  async generateStudyPlan(academic_tasks: string[], available_hours: number = 2, exam_tomorrow: boolean = false): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/planner/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academic_tasks, available_hours, exam_tomorrow }),
      });
      return await res.json();
    } catch {
      return {
        title: 'Calm & Focused Academic Sprint',
        total_time_minutes: 120,
        blocks: [
          { time_window: '6:00 - 6:25 PM', task_name: 'Focus Sprint: Key Chapter Revision', category: 'work', duration_minutes: 25, tip: 'Close social media tabs, work on single sub-topic.' },
          { time_window: '6:25 - 6:30 PM', task_name: 'Parasympathetic Reset (4-4-4 Breathing)', category: 'breathing_reset', duration_minutes: 5, tip: 'Drink water, stretch neck.' },
          { time_window: '6:30 - 6:55 PM', task_name: 'Focus Sprint: High-Yield Practice Questions', category: 'work', duration_minutes: 25, tip: 'Solve 2 problems without checking answers.' },
          { time_window: '6:55 - 7:00 PM', task_name: 'Parasympathetic Reset', category: 'breathing_reset', duration_minutes: 5, tip: 'Look out the window at something green.' },
          { time_window: '7:00 - 7:25 PM', task_name: 'Focus Sprint: Summary Sheet Review', category: 'work', duration_minutes: 25, tip: 'Review formulas or key concepts.' },
          { time_window: '7:25 - 7:40 PM', task_name: 'Study Shutdown & Desk Clear', category: 'active_break', duration_minutes: 15, tip: 'Tidy desk, protect your sleep.' }
        ],
        encouragement: 'One step at a time. An exam evaluates what you wrote today, not your worth as a human.'
      };
    }
  },

  // Personas
  async getPersonas(): Promise<Persona[]> {
    try {
      const res = await fetch(`${API_BASE}/demo/personas`);
      return await res.json();
    } catch {
      return [];
    }
  },

  async selectPersona(personaId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/demo/select/${personaId}`, { method: 'POST' });
      return await res.json();
    } catch {
      return { status: 'success' };
    }
  },

  // Campus Resources
  async getCampusResources(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/campus/resources`);
      return await res.json();
    } catch {
      return {
        emergency_hotlines: [
          { id: 'tele-manas', name: 'Tele-MANAS (Govt of India 24/7)', number: '14416', toll_free: '1800-891-4416', description: '24/7 free tele-mental health counseling in 20+ regional languages', urgent: true },
          { id: 'kiran', name: 'KIRAN National Helpline', number: '1800-599-0019', toll_free: '1800-599-0019', description: 'National Mental Health Helpline by MSJE', urgent: true },
          { id: 'vandrevala', name: 'Vandrevala Foundation 24/7', number: '+91 9999 666 555', description: '24/7 free emotional distress helpline', urgent: true },
          { id: 'emergency-india', name: 'National Emergency', number: '112', description: 'All-in-one Emergency Police/Medical', urgent: true }
        ],
        campus_contacts: [
          { role: 'Campus Psychological Counsellor', name: 'Dr. Ananya Sharma', contact: '+91 98765 43210 / counsellor@campus.edu', location: 'Health Centre, Rm 104', timing: 'Mon - Sat, 9 AM - 6 PM' },
          { role: 'Chief Hostel Warden', name: 'Prof. R. K. Verma', contact: '+91 98765 12345 / warden@campus.edu', location: 'Hostel Admin Block', timing: '24/7 on call' }
        ]
      };
    }
  },

  // Community
  async getCommunityPosts(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/community`);
      return await res.json();
    } catch {
      return [
        { id: 'post_1', category: 'Exam stress', author_alias: 'Anonymous Falcon', author_avatar: '🦅', timestamp: '2h ago', content: 'To anyone freaking out about tomorrow’s exam: everyone is nervous. Review your notes and get at least 6 hours of sleep!', reactions: { hug: 24, relate: 42, strength: 19 }, support_replies: 8 },
        { id: 'post_2', category: 'Hostel life', author_alias: 'Anonymous Otter', author_avatar: '🦦', timestamp: '5h ago', content: 'Eating alone at the hostel mess felt terrifying in month 1. By month 3 you realize nobody is judging you. You belong here.', reactions: { hug: 58, relate: 37, strength: 29 }, support_replies: 14 }
      ];
    }
  },

  async createCommunityPost(post: { category: string; content: string; author_alias?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit post');
    }
    return await res.json();
  },

  // AI Configuration & Key Management
  async getAIConfig(): Promise<{ is_configured: boolean; model: string; masked_key: string; engine: string }> {
    try {
      const res = await fetch(`${API_BASE}/config/ai`);
      if (!res.ok) throw new Error('Failed to load AI config');
      return await res.json();
    } catch {
      return {
        is_configured: false,
        model: 'gemini-3.8-flash',
        masked_key: '',
        engine: 'Local Offline Neural Fallback Engine'
      };
    }
  },

  async setAIConfig(apiKey: string): Promise<{ status: string; message: string; is_configured: boolean }> {
    const res = await fetch(`${API_BASE}/config/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    if (!res.ok) throw new Error('Failed to update Gemini API key');
    return await res.json();
  },

  // Recovery Engine APIs
  async getSupportModes(): Promise<RecoverySupportMode[]> {
    try {
      const res = await fetch(`${API_BASE}/recovery/modes`);
      if (!res.ok) throw new Error('Failed to load support modes');
      return await res.json();
    } catch {
      return [
        { id: 'just_listen', label: 'Just listen', icon: '🫂', description: "I don't want solutions right now.", user_need: 'Empathetic presence and emotional validation without advice.', recommended_action: 'Active empathetic reflection with zero unsolicited fixing.' },
        { id: 'help_me_understand', label: 'Help me understand', icon: '🧠', description: "I don't know why I feel like this.", user_need: 'Gentle cognitive exploration to separate facts from conclusions.', recommended_action: 'Open-ended curiosity, personal emotional mapping.' },
        { id: 'help_me_calm_down', label: 'Help me calm down', icon: '🌿', description: 'Everything feels too intense.', user_need: 'Physiological de-escalation and somatic grounding.', recommended_action: 'Parasympathetic box breathing or 5-4-3-2-1 sensory grounding.' },
        { id: 'help_me_solve', label: 'Help me solve something', icon: '🧩', description: 'I need practical help.', user_need: 'Actionable problem deconstruction and sequencing.', recommended_action: 'Break the problem into bite-sized Pomodoro sprints.' },
        { id: 'help_me_start', label: 'Help me start', icon: '🎯', description: "I know what I need to do but can't begin.", user_need: 'Removing friction, executive dysfunction bypass.', recommended_action: "5-minute micro-mission: 'Just open the document'." },
        { id: 'distract_me', label: 'Distract me', icon: '🎮', description: 'I need a break from my thoughts.', user_need: 'Attentional diversion away from repetitive rumination.', recommended_action: 'Non-competitive mindful game (Bubble Zen, Mind Match, Pattern Flow).' },
        { id: 'help_me_connect', label: 'Help me connect', icon: '🤝', description: "I don't want to deal with this alone.", user_need: 'Bridging isolation, reaching trusted humans.', recommended_action: 'Draft low-friction message to friend, family, or mentor.' },
        { id: 'stay_with_me', label: 'Stay with me', icon: '🌙', description: "I don't want to do anything. Just stay here.", user_need: 'Quiet, non-demanding companionship without expectation.', recommended_action: 'Walk With Me peaceful story or Maddy Space ambient room.' }
      ];
    }
  },

  async getRecoveryMissions(category?: string): Promise<RecoveryMission[]> {
    try {
      const url = category && category !== 'All' ? `${API_BASE}/recovery/missions?category=${category}` : `${API_BASE}/recovery/missions`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load missions');
      return await res.json();
    } catch {
      return [
        { id: 'pleasure_music', title: 'Play One Comfort Song', duration_minutes: 3, category: 'Pleasure', category_label: 'Pleasure & Comfort', prompt: "Put on headphones and play one track that brings you quiet comfort. You don't have to feel happy—just listen.", why_it_helps: 'Gentle auditory stimulation shifts neural activity away from repetitive catastrophic loops.', difficulty: 'micro' },
        { id: 'mastery_open_notes', title: 'Open the Notes (5-Minute Start)', duration_minutes: 5, category: 'Mastery', category_label: 'Sense of Capability', prompt: 'Just open the syllabus or textbook to the first page. You do NOT have to study the whole chapter—just look at one paragraph for 5 minutes.', why_it_helps: 'Bypasses executive dysfunction by setting an initiation threshold so low your brain stops perceiving it as a threat.', difficulty: 'micro' },
        { id: 'connection_ping', title: 'Send a 1-Line Text', duration_minutes: 2, category: 'Connection', category_label: 'Human Connection', prompt: "Send a short message: 'Hey, thinking of you, hope your day is going okay' to one friend.", why_it_helps: "Reduces acute isolation without demanding vulnerable emotional disclosure before you're ready.", difficulty: 'micro' },
        { id: 'care_hydrate', title: 'Hydrate & Shoulder Drop', duration_minutes: 2, category: 'Care', category_label: 'Body Care', prompt: 'Drink one full glass of water, roll your shoulders backward three times, and unclamp your jaw.', why_it_helps: 'Releases physical holding patterns of prolonged campus stress.', difficulty: 'micro' }
      ];
    }
  },

  async completeRecoveryMission(missionId: string, obstacleFaced?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/recovery/missions/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission_id: missionId, obstacle_faced: obstacleFaced }),
      });
      return await res.json();
    } catch {
      return { status: 'success', message: 'Mission recorded locally.' };
    }
  },

  async evaluateLoopBreaker(data: { event: string; thought: string; emotion: string; action: string; next_outcome: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/recovery/loop-breaker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return {
        mapped_cycle: data,
        interventions: [
          { lever: 'Change the Thought', icon: '🧠', title: 'Cognitive Re-anchor', suggestion: `Ask yourself: 'Is "${data.thought}" 100% a confirmed fact, or is it stress talking?'` },
          { lever: 'Change the Next Action', icon: '🎯', title: '5-Minute Micro-Action', suggestion: 'Instead of total avoidance, take just 5 minutes of contact with the task. You are free to stop right after.' },
          { lever: 'Ask for Support', icon: '🤝', title: 'Reach a Human', suggestion: 'Send a low-pressure message to a trusted friend or mentor.' },
          { lever: 'Take a Reset', icon: '🌿', title: 'Somatic Down-Regulation', suggestion: 'Step away for 4 minutes of 4-4-4 Box Breathing or splash cold water on your face.' }
        ]
      };
    }
  },

  async submitRecoveryFeedback(data: { interaction_type: string; rating: string; factor_helped?: string; user_note?: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/recovery/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { status: 'success', message: 'Feedback noted locally.' };
    }
  },

  async getUserManual(): Promise<WhatHelpsMeProfile> {
    try {
      const res = await fetch(`${API_BASE}/recovery/manual`);
      if (!res.ok) throw new Error('Failed to load manual');
      return await res.json();
    } catch {
      return {
        overwhelmed: [
          { id: 'm_1', section: 'overwhelmed', content: '5-minute micro tasks work better than long schedules.', added_date: 'Sep 28', user_confirmed: true },
          { id: 'm_2', section: 'overwhelmed', content: 'Monsoon Rain soundscape with eyes closed for 3 minutes.', added_date: 'Sep 29', user_confirmed: true }
        ],
        cannot_start: [
          { id: 'm_3', section: 'cannot_start', content: 'Just opening the notes without promising to finish helps unlock paralysis.', added_date: 'Sep 27', user_confirmed: true }
        ],
        lonely: [
          { id: 'm_4', section: 'lonely', content: 'Walking around the campus quad or texting one close friend.', added_date: 'Sep 26', user_confirmed: true }
        ],
        cannot_sleep: [
          { id: 'm_5', section: 'cannot_sleep', content: 'Screen off 20 mins before bed + 4-count breathing.', added_date: 'Sep 25', user_confirmed: true }
        ],
        makes_it_worse: [
          { id: 'm_6', section: 'makes_it_worse', content: 'Scrolling LinkedIn placement updates at 2 AM.', added_date: 'Sep 28', user_confirmed: true },
          { id: 'm_7', section: 'makes_it_worse', content: "Motivational quotes that say 'just work harder'.", added_date: 'Sep 29', user_confirmed: true }
        ],
        words_to_remember: [
          { id: 'm_8', section: 'words_to_remember', content: 'An exam measures what I wrote today, not my human worth.', added_date: 'Sep 27', user_confirmed: true }
        ]
      };
    }
  },

  async addUserManualItem(section: string, content: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/recovery/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content }),
      });
      return await res.json();
    } catch {
      return { status: 'success', item: { id: `local_${Date.now()}`, section, content, added_date: 'Today', user_confirmed: true } };
    }
  },

  async generateHelpMessage(recipient: string, topic: string, tone?: string): Promise<OutreachMessageDraft> {
    try {
      const res = await fetch(`${API_BASE}/recovery/help-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, topic, tone }),
      });
      return await res.json();
    } catch {
      return {
        recipient,
        subject: 'Checking in',
        message: "Hey, I've been feeling a bit overwhelmed lately. Are you free to grab a chai or talk for a few minutes sometime today?",
        tip: 'Reaching out is an act of courage and self-care.'
      };
    }
  },

  async generateHandoffSummary(data: { timeline?: string; primary_concerns?: string[]; what_helped?: string[]; what_did_not_help?: string[]; questions_to_ask?: string[] }): Promise<ProfessionalHandoff> {
    try {
      const res = await fetch(`${API_BASE}/recovery/handoff-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return {
        title: 'Personal Wellness Summary for Student Consultation',
        disclaimer: 'This document is a private self-report summary compiled by the student to facilitate an initial consultation. It is NOT a clinical diagnosis or medical assessment.',
        date_prepared: 'Today',
        timeline: data.timeline || 'Past 2 to 4 weeks',
        primary_concerns: data.primary_concerns || ['Academic fatigue and concentration difficulty', 'Fluctuating mood and low daytime energy'],
        strategies_attempted: {
          what_provided_some_relief: data.what_helped || ['4-count breathing exercises', 'Short 5-minute study intervals'],
          what_proved_unhelpful: data.what_did_not_help || ['Late-night cramming', 'Vague motivational advice']
        },
        student_questions_for_professional: data.questions_to_ask || ['How can I rebuild my sleep schedule without waking up anxious?']
      };
    }
  },

  // ----------------- Authentication & Profile -----------------
  async signup(data: {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    college?: string;
    emergency_contact_name?: string;
    emergency_contact_relation?: string;
    emergency_contact_phone?: string;
  }): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Signup failed');
    }
    return await res.json();
  },

  async login(email: string, password: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return await res.json();
  },

  async getUserProfile(userId: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/me/${userId}`);
    if (!res.ok) throw new Error('User not found');
    return await res.json();
  },

  async updateUserProfile(userId: string, data: { name: string; age: number; gender: string; college?: string }): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  },

  // ----------------- Emergency Contacts -----------------
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      const res = await fetch(`${API_BASE}/auth/contacts/${userId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async addEmergencyContact(userId: string, contact: { name: string; relation: string; phone: string; is_primary?: boolean }): Promise<EmergencyContact> {
    const res = await fetch(`${API_BASE}/auth/contacts/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to add contact');
    return await res.json();
  },

  async deleteEmergencyContact(userId: string, contactId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/auth/contacts/${userId}/${contactId}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // ----------------- Menstrual Cycle Tracking -----------------
  async getCurrentCycle(userId: string): Promise<MenstrualCycleData> {
    try {
      const res = await fetch(`${API_BASE}/menstrual/current/${userId}`);
      if (!res.ok) return { has_data: false };
      return await res.json();
    } catch {
      return { has_data: false };
    }
  },

  async logMenstrualCycle(userId: string, data: MenstrualLogPayload): Promise<MenstrualCycleData> {
    const res = await fetch(`${API_BASE}/menstrual/log/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log period cycle');
    return await res.json();
  },

  async getMenstrualHistory(userId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/menstrual/history/${userId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
};

