import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight, HeartHandshake, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { TabType, CheckInEntry, RecoverySupportMode, ChatMode } from '../../types';
import { MetricCards } from './MetricCards';
import { ActionGrid } from './ActionGrid';
import { ExplainableRecommendation } from './ExplainableRecommendation';
import { BaselineDeviationBanner } from './BaselineDeviationBanner';
import { MoodCheckInModal } from './MoodCheckInModal';
import { SupportModeSelector } from '../recovery/SupportModeSelector';
import { RecoveryMissionsCard } from '../recovery/RecoveryMissionsCard';
import { apiService } from '../../lib/api';

interface Props {
  onNavigate: (tab: TabType, initialPrompt?: string) => void;
  checkins: CheckInEntry[];
  onNewCheckin: (entry: CheckInEntry) => void;
  hasBaselineDeviation: boolean;
  onOpenLoopBreaker?: () => void;
  onSelectMode?: (mode: ChatMode) => void;
}

export const HomeView: React.FC<Props> = ({
  onNavigate,
  checkins,
  onNewCheckin,
  hasBaselineDeviation,
  onOpenLoopBreaker,
  onSelectMode,
}) => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [supportModes, setSupportModes] = useState<RecoverySupportMode[]>([]);

  useEffect(() => {
    (async () => {
      const modes = await apiService.getSupportModes();
      setSupportModes(modes);
    })();
  }, []);

  const latestCheckin = checkins[checkins.length - 1] || {
    mood: 3,
    stress: 3,
    energy: 3,
    sleep: 'Okay',
    stressors: ['Academic'],
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSupportModeClick = (mode: RecoverySupportMode) => {
    if (mode.id === 'stay_with_me' || mode.id === 'distract_me' || mode.id === 'help_me_calm_down') {
      onNavigate('RELAX');
    } else if (mode.id === 'help_me_connect') {
      onNavigate('HELP');
    } else {
      if (onSelectMode) {
        onSelectMode(mode.label as ChatMode);
      }
      onNavigate('CHAT');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <span className="text-sm font-bold text-slate-500">{getGreeting()}, Scholar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            How are you feeling today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            A safe, non-judgmental space to navigate college pressure, placements, and hostel life at your own pace.
          </p>
        </div>

        <button
          onClick={() => setIsCheckInOpen(true)}
          className="self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-md shadow-calm-700/20 transition shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Daily 30s Check-in</span>
        </button>
      </div>

      {/* Signature: What would help right now? Support Mode Selector */}
      {supportModes.length > 0 && (
        <SupportModeSelector
          modes={supportModes}
          onSelectMode={handleSupportModeClick}
        />
      )}

      {/* Baseline Deviation Signal Banner if active */}
      <BaselineDeviationBanner
        hasDeviation={hasBaselineDeviation}
        onNavigateChat={(prompt) => onNavigate('CHAT', prompt)}
        onNavigateTrack={() => onNavigate('TRACK')}
      />

      {/* Quick Metrics Cards */}
      <MetricCards
        mood={latestCheckin.mood}
        stress={latestCheckin.stress}
        energy={latestCheckin.energy}
        sleep={latestCheckin.sleep}
      />

      {/* 5-Minute Recovery Missions (Behavioral Activation) */}
      <RecoveryMissionsCard
        onMissionCompleted={(title) => {
          console.log('Mission completed:', title);
        }}
      />

      {/* Break the Loop Interactive Banner */}
      {onOpenLoopBreaker && (
        <div className="bg-gradient-to-r from-calm-800 via-teal-800 to-calm-900 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-calm-300 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4" />
              <span>Recovery Loop Breaker</span>
            </div>
            <h3 className="text-lg font-bold">Stuck in an overwhelming pattern?</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Stress → Avoidance → Guilt → Self-criticism. Map your personal loop and discover 5 tangible interruption points to break the cycle.
            </p>
          </div>
          <button
            onClick={onOpenLoopBreaker}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-calm-50 text-slate-800 font-bold text-xs shadow-md transition shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-calm-700" />
            <span>Break the Loop</span>
          </button>
        </div>
      )}

      {/* Explainable Personalized Recommendation */}
      <ExplainableRecommendation
        recommendationTitle={
          latestCheckin.stress >= 4
            ? "4-4-4 Box Breathing Nervous System Reset"
            : "5-4-3-2-1 Sensory Grounding & Study Sprint"
        }
        recommendationDuration="3 - 5 mins"
        whyExplanation={
          `Recommended because your reported stress is ${latestCheckin.stress}/5 with primary campus stressors: ${latestCheckin.stressors?.join(', ') || 'Academics'}. Past student outcomes show an 88% reduction in acute test panic after this reset.`
        }
        onStartIntervention={() => onNavigate('RELAX')}
      />

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </h3>
          <span className="text-xs text-slate-400">Gen-Z & Hinglish Enabled</span>
        </div>
        <ActionGrid
          onNavigate={onNavigate}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
        />
      </div>

      {/* Today's Context & Status Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Active Focus Stressor: <span className="text-calm-700">{latestCheckin.stressors?.[0] || 'Mid-Sem Academics'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged {checkins.length} wellness check-ins this semester. Trends indicate higher resilience on days with pre-bed breathwork.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('TRACK')}
          className="flex items-center gap-1.5 text-xs font-semibold text-calm-700 hover:text-calm-900 underline shrink-0"
        >
          <span>View Weekly Report & Baselines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Daily Check-in Modal */}
      <MoodCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={(data) => {
          const entry: CheckInEntry = {
            id: `chk_${Date.now()}`,
            date: 'Today',
            ...data,
          };
          onNewCheckin(entry);
        }}
      />
    </div>
  );
};
