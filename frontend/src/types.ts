export type TabType = 'HOME' | 'CHAT' | 'RELAX' | 'TRACK' | 'HELP' | 'JOURNAL' | 'CYCLE';

export type ChatMode = 
  | 'Adaptive (Auto)'
  | 'Just listen'
  | 'Help me understand'
  | 'Help me calm down'
  | 'Help me solve something'
  | 'Help me start'
  | 'Distract me'
  | 'Help me connect'
  | 'Stay with me'
  | 'Give practical steps'
  | 'Help me plan';

export interface RecoverySupportMode {
  id: string;
  label: string;
  icon: string;
  description: string;
  user_need: string;
  recommended_action: string;
}

export interface RecoveryMission {
  id: string;
  title: string;
  duration_minutes: number;
  category: 'Pleasure' | 'Mastery' | 'Connection' | 'Meaning' | 'Care';
  category_label: string;
  prompt: string;
  why_it_helps: string;
  difficulty: 'micro' | 'easy';
  is_completed?: boolean;
}

export interface LoopBreakerIntervention {
  lever: string;
  icon: string;
  title: string;
  suggestion: string;
}

export interface WhatHelpsMeItem {
  id: string;
  section: 'overwhelmed' | 'cannot_start' | 'lonely' | 'cannot_sleep' | 'makes_it_worse' | 'words_to_remember';
  content: string;
  added_date: string;
  user_confirmed: boolean;
}

export interface WhatHelpsMeProfile {
  overwhelmed: WhatHelpsMeItem[];
  cannot_start: WhatHelpsMeItem[];
  lonely: WhatHelpsMeItem[];
  cannot_sleep: WhatHelpsMeItem[];
  makes_it_worse: WhatHelpsMeItem[];
  words_to_remember: WhatHelpsMeItem[];
}

export interface OutreachMessageDraft {
  recipient: string;
  subject: string;
  message: string;
  tip: string;
}

export interface ProfessionalHandoff {
  title: string;
  disclaimer: string;
  date_prepared: string;
  timeline: string;
  primary_concerns: string[];
  strategies_attempted: {
    what_provided_some_relief: string[];
    what_proved_unhelpful: string[];
  };
  student_questions_for_professional: string[];
}

export interface DynamicQuestion {
  category: string;
  question: string;
  options?: string[];
}

export interface StudyActionBlock {
  time_window: string;
  task_name: string;
  category: string;
  duration_minutes: number;
  tip?: string;
}

export interface StudyActionPlan {
  title: string;
  total_time_minutes: number;
  blocks: StudyActionBlock[];
  encouragement: string;
}

export interface SafetyVerdict {
  risk_level: 'NORMAL' | 'EMOTIONAL_DISTRESS' | 'AMBIGUOUS_SAFETY_CONCERN' | 'HIGH_RISK_SELF_HARM' | 'IMMEDIATE_EMERGENCY';
  hard_stop: boolean;
  requires_safety_question: boolean;
  reason: string;
  suggested_question?: string;
  emergency_contacts: Array<{
    id: string;
    name: string;
    number: string;
    toll_free?: string;
    description: string;
    urgent?: boolean;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  safetyVerdict?: SafetyVerdict;
  slangNormalized?: string;
  nextQuestions?: DynamicQuestion[];
  studyPlan?: StudyActionPlan;
  suggestedIntervention?: Intervention;
  contextUsed?: Record<string, any>;
}

export interface Intervention {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  type: string;
}

export interface CheckInEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  stress: number; // 1-5
  energy: number; // 1-5
  sleep: string;
  stressors: string[];
  notes?: string;
}

export interface BaselineMetric {
  metric: string;
  baseline_value: number;
  current_value: number;
  unit: string;
  deviation_percent: number;
  status_tone: 'neutral' | 'attention' | 'positive';
  message: string;
}

export interface WeeklyResilienceReport {
  period: string;
  average_mood: number;
  average_stress: number;
  average_sleep_hours: number;
  top_stressors: Array<{ name: string; count: number; percentage: number }>;
  positive_factors: string[];
  behavior_signals: BaselineMetric[];
  effective_interventions: string[];
  personalized_insight: string;
  recommendation: string;
  why_am_i_seeing_this: string[];
}

export interface EncryptedJournalRecord {
  id: string;
  title: string;
  ciphertext: string;
  iv: string;
  salt: string;
  mood_tag: number;
  stress_tag: number;
  tags: string[];
  created_at: string;
  // Decrypted cache in client memory only
  decryptedContent?: string;
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  primary_stressor: string;
  current_mood: number;
  current_stress: number;
  sample_chat: string;
  recommended_mode: ChatMode;
  recommended_feature: string;
}

// ----------------- Auth, Contacts & Menstrual Tracker -----------------
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary' | 'prefer_not_to_say';
  college?: string;
  created_at?: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  relation: string;
  phone: string;
  is_primary: boolean;
}

export interface MenstrualCycleData {
  has_data: boolean;
  current_day?: number;
  cycle_length?: number;
  period_duration?: number;
  phase_key?: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  phase_name?: string;
  is_pms?: boolean;
  days_until_next_period?: number;
  predicted_next_date?: string;
  emotional_climate?: string;
  mood_swing_risk?: string;
  self_care_tip?: string;
  recent_symptoms?: string[];
  message?: string;
}

export interface MenstrualLogPayload {
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  period_duration?: number;
  symptoms?: string[];
  flow_intensity?: string;
  notes?: string;
}

export interface LowStimVideo {
  id: string;
  title: string;
  category: 'lofi_rain' | 'nature_sway' | 'claymation' | 'night_stars' | 'pastels';
  description: string;
  duration: string;
  audioSoundscape: string;
  palette: string[];
  previewIcon: string;
}
