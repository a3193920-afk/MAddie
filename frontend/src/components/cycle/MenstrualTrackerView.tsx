import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Sparkles, Moon, Sun, AlertCircle, CheckCircle2, Droplet, MessageCircle, Plus, Info } from 'lucide-react';
import { MenstrualCycleData, UserProfile } from '../../types';
import { apiService } from '../../lib/api';

interface Props {
  currentUser: UserProfile;
  onNavigateChat: (initialPrompt?: string) => void;
}

export const MenstrualTrackerView: React.FC<Props> = ({ currentUser, onNavigateChat }) => {
  const [cycleData, setCycleData] = useState<MenstrualCycleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingPeriod, setIsLoggingPeriod] = useState(false);

  // Form for logging new period
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLen, setCycleLen] = useState(28);
  const [periodDur, setPeriodDur] = useState(5);
  const [flow, setFlow] = useState('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const commonSymptoms = [
    'Cramps', 'Mood Swings', 'Crying Spells', 'Low Energy', 'Bloating',
    'Anxiety', 'Tender Breasts', 'Headache', 'Irritability', 'Brain Fog'
  ];

  useEffect(() => {
    loadCycleData();
  }, [currentUser?.id]);

  const loadCycleData = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await apiService.getCurrentCycle(currentUser.id);
      setCycleData(data);
      if (data?.recent_symptoms) {
        setSelectedSymptoms(data.recent_symptoms);
      }
    } catch (e) {
      console.error('Error fetching cycle data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleLogPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiService.logMenstrualCycle(currentUser.id, {
        start_date: startDate,
        cycle_length: cycleLen,
        period_duration: periodDur,
        flow_intensity: flow,
        symptoms: selectedSymptoms,
        notes: notes || undefined,
      });
      setCycleData(updated);
      setIsLoggingPeriod(false);
    } catch (err) {
      console.error('Error logging cycle:', err);
    }
  };

  const handleTalkToMaddy = () => {
    const phase = cycleData?.phase_name || 'my cycle';
    const day = cycleData?.current_day || '';
    const syms = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'mood swings';
    const prompt = `Hey Maddy, I'm on Day ${day} of my cycle (${phase}) and experiencing ${syms}. Emotions feel really heavy today, can we just talk?`;
    onNavigateChat(prompt);
  };

  if (currentUser.gender !== 'female') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
        <span className="text-3xl">🌸</span>
        <h3 className="text-lg font-bold text-slate-800">Menstrual Cycle Tracking</h3>
        <p className="text-xs text-slate-500">
          This feature is personalized for female hormonal cycle tracking. To activate, please update your gender profile to 'Female' in the top right user menu.
        </p>
      </div>
    );
  }

  const currentDay = cycleData?.current_day || 1;
  const cycleLength = cycleData?.cycle_length || 28;
  const progressPercent = Math.min(100, Math.round((currentDay / cycleLength) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 p-6 sm:p-7 rounded-3xl text-white shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
              Female Biological Care
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Menstrual & Hormonal Companion
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Track your cycle phases, normalize hormonal mood swings with compassion, and let Maddy adapt late-night conversations to where your body is today.
          </p>
        </div>

        <button
          onClick={() => setIsLoggingPeriod(true)}
          className="self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-md transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-rose-600" />
          <span>Log Period Dates</span>
        </button>
      </div>

      {/* Main Cycle Status Card */}
      {cycleData && cycleData.has_data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Circular Day Visualizer Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer Progress Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#FCE7F3"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={
                    cycleData.is_pms
                      ? '#818CF8'
                      : cycleData.phase_key === 'menstrual'
                      ? '#F43F5E'
                      : '#10B981'
                  }
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">Day</span>
                <span className="text-3xl font-extrabold text-slate-800">{currentDay}</span>
                <span className="text-[10px] text-slate-400 font-medium">of {cycleLength} days</span>
              </div>
            </div>

            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  cycleData.is_pms
                    ? 'bg-indigo-100 text-indigo-800'
                    : cycleData.phase_key === 'menstrual'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {cycleData.phase_name}
              </span>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Next period predicted in <strong>{cycleData.days_until_next_period} days</strong> ({cycleData.predicted_next_date})
              </p>
            </div>
          </div>

          {/* Biological Reality & Emotional Climate Card */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Hormonal Landscape Today</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {cycleData.emotional_climate}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why you might feel this way:</strong> {cycleData.mood_swing_risk}
              </p>
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900 leading-relaxed flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] uppercase tracking-wider text-rose-700">Self-Care Micro-Tip</strong>
                  {cycleData.self_care_tip}
                </div>
              </div>
            </div>

            {/* Quick Action: Talk to Maddy */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                Maddy's LLM automatically knows your cycle phase to validate mood swings with zero judgment.
              </div>
              <button
                onClick={handleTalkToMaddy}
                className="px-4 py-2.5 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Talk with Maddy</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <Droplet className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No period dates logged yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Log the start date of your last period. Maddy will calculate your current phase (Menstrual, Follicular, Ovulatory, or Luteal PMS) and gently explain how hormonal shifts affect study burnout and emotional resilience.
          </p>
          <button
            onClick={() => setIsLoggingPeriod(true)}
            className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
          >
            Log First Period Start
          </button>
        </div>
      )}

      {/* Symptom Logger Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Today's Physical & Emotional Symptoms</h3>
            <p className="text-xs text-slate-500">Tap any symptoms you are experiencing today to sync with Maddy's AI</p>
          </div>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
            {selectedSymptoms.length} logged
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {commonSymptoms.map((sym) => {
            const active = selectedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => handleToggleSymptom(sym)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Phases Education Guide */}
      <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            Understanding Your 4 Cycle Phases & College Life
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-rose-100 space-y-1">
            <span className="text-rose-600 font-extrabold block">1. Menstrual (Days 1–5)</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Lowest estrogen and progesterone. Natural fatigue, physical cramps. Best for quiet rest, warm chai, and low-demand tasks.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-emerald-600 font-extrabold block">2. Follicular (Days 6–13)</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Estrogen climbing. Increasing mental sharpness, curiosity, and high memory recall. Prime window for intense study sprints and projects.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-100 space-y-1">
            <span className="text-amber-600 font-extrabold block">3. Ovulatory (Days 14–16)</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Peak estrogen and energy. Highest confidence, social ease, and resilience. Ideal for interviews, presentations, and group study.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-1">
            <span className="text-indigo-600 font-extrabold block">4. Luteal / PMS (Days 17–28)</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Progesterone drop. Serotonin fluctuates, amplifying test anxiety, tears, and irritability. Crucial: normalize mood swings as biological, not failure.
            </p>
          </div>
        </div>
      </div>

      {/* Log Period Modal */}
      {isLoggingPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Log Period Cycle</h3>
              <button
                onClick={() => setIsLoggingPeriod(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogPeriod} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Period Start Date (First Day of Bleeding)
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cycle Length (Days)
                  </label>
                  <input
                    type="number"
                    min={21}
                    max={45}
                    value={cycleLen}
                    onChange={(e) => setCycleLen(parseInt(e.target.value) || 28)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Period Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={periodDur}
                    onChange={(e) => setPeriodDur(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Flow Intensity</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['light', 'medium', 'heavy'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlow(f)}
                      className={`py-1.5 rounded-xl border capitalize font-semibold ${
                        flow === f
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Midsem exam stress making cramps worse"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoggingPeriod(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  Save & Calculate Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
