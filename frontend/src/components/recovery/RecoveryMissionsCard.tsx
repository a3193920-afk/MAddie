import React, { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle2, Play, Pause, RotateCcw, Sparkles, HeartHandshake } from 'lucide-react';
import { RecoveryMission } from '../../types';
import { apiService } from '../../lib/api';
import { webAudioService } from '../../lib/webAudio';

interface Props {
  onMissionCompleted?: (missionTitle: string) => void;
}

export const RecoveryMissionsCard: React.FC<Props> = ({ onMissionCompleted }) => {
  const [missions, setMissions] = useState<RecoveryMission[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMission, setActiveMission] = useState<RecoveryMission | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const [showObstacleFeedback, setShowObstacleFeedback] = useState<boolean>(false);
  const [obstacleSelected, setObstacleSelected] = useState<string | null>(null);
  const [reflectionInsight, setReflectionInsight] = useState<string | null>(null);

  const categories = ['All', 'Pleasure', 'Mastery', 'Connection', 'Meaning', 'Care'];

  useEffect(() => {
    (async () => {
      const data = await apiService.getRecoveryMissions(selectedCategory);
      setMissions(data);
      if (data.length > 0 && !activeMission) {
        setActiveMission(data[0]);
        setTimerSeconds(data[0].duration_minutes * 60);
      }
    })();
  }, [selectedCategory]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      webAudioService.playHarmonicChord(2);
      handleFinishMission();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleSelectMission = (m: RecoveryMission) => {
    setActiveMission(m);
    setIsTimerRunning(false);
    setTimerSeconds(m.duration_minutes * 60);
    setShowObstacleFeedback(false);
    setReflectionInsight(null);
  };

  const handleFinishMission = async () => {
    if (!activeMission) return;
    setCompletedId(activeMission.id);
    webAudioService.playHarmonicChord(3);
    setShowObstacleFeedback(true);
    if (onMissionCompleted) {
      onMissionCompleted(activeMission.title);
    }
  };

  const handleRecordObstacle = async (obstacle: string) => {
    if (!activeMission) return;
    setObstacleSelected(obstacle);
    const res = await apiService.completeRecoveryMission(activeMission.id, obstacle);
    if (res.reflection_insight) {
      setReflectionInsight(res.reflection_insight);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
            <Target className="w-3.5 h-3.5" />
            <span>Behavioral Activation</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            5-Minute Recovery Missions
          </h3>
          <p className="text-xs text-slate-500">
            Tiny, low-friction actions to rebuild agency without pressure or guilt.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Mission Banner */}
      {activeMission && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/70 via-calm-50/50 to-white border border-teal-200/80 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                  {activeMission.category_label}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeMission.duration_minutes} mins
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-800">
                {activeMission.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeMission.prompt}
              </p>
            </div>

            {/* Timer Display */}
            <div className="flex flex-col items-center bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-2xs shrink-0">
              <span className="font-mono text-lg font-bold text-slate-800">
                {formatTime(timerSeconds)}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition cursor-pointer"
                  title={isTimerRunning ? 'Pause' : 'Start'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(activeMission.duration_minutes * 60);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-teal-100/80">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>{activeMission.why_it_helps}</span>
            </span>
            <button
              onClick={handleFinishMission}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
          </div>

          {/* Obstacle Reflection Section (Learning What Got In The Way) */}
          {showObstacleFeedback && (
            <div className="p-4 rounded-xl bg-white border border-teal-200 shadow-2xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span>What was the hardest part about starting?</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Learning whether the resistance was fear, confusion, or exhaustion helps Maddy tailor gentler steps next time.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: 'perfectionism', label: 'Perfectionism / High expectations' },
                  { id: 'exhaustion', label: 'Physical / Emotional exhaustion' },
                  { id: 'fear', label: 'Fear of failing or bad news' },
                  { id: 'confusion', label: 'Not knowing where to start' },
                  { id: 'environment', label: 'Hostel noise / messy space' },
                  { id: 'none', label: 'Felt manageable once started' },
                ].map((obs) => (
                  <button
                    key={obs.id}
                    onClick={() => handleRecordObstacle(obs.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      obstacleSelected === obs.id
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {obs.label}
                  </button>
                ))}
              </div>

              {reflectionInsight && (
                <div className="text-xs text-teal-900 bg-teal-50/80 p-2.5 rounded-lg border border-teal-100 mt-2 leading-relaxed animate-fade-in">
                  💡 {reflectionInsight}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mission Quick Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {missions.map((m) => {
          const isCurrent = activeMission?.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMission(m)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-teal-50/60 border-teal-500 ring-1 ring-teal-500/20 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold">{m.category}</span>
                  <span>{m.duration_minutes}m</span>
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  {m.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {m.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
