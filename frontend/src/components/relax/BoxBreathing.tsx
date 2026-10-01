import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { webAudioService } from '../../lib/webAudio';

interface Props {
  onCompleteSession: () => void;
}

export const BoxBreathing: React.FC<Props> = ({ onCompleteSession }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Transition phase
            webAudioService.playGentleChime();
            if (phase === 'Inhale') {
              setPhase('Hold');
            } else if (phase === 'Hold') {
              setPhase('Exhale');
            } else if (phase === 'Exhale') {
              setPhase('Rest');
            } else if (phase === 'Rest') {
              setPhase('Inhale');
              setCyclesCompleted((c) => {
                const nextC = c + 1;
                if (nextC >= 4) {
                  onCompleteSession();
                }
                return nextC;
              });
            }
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, onCompleteSession]);

  const handleToggle = () => {
    if (!isActive) {
      webAudioService.playGentleChime();
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  // Compute ring expansion
  const getScaleClass = () => {
    if (!isActive) return 'scale-90 opacity-75';
    if (phase === 'Inhale') return 'scale-110 duration-[4000ms]';
    if (phase === 'Hold' || phase === 'Rest') return 'scale-110 duration-[4000ms]';
    if (phase === 'Exhale') return 'scale-90 duration-[4000ms]';
    return 'scale-100';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col items-center justify-between text-center space-y-6 shadow-sm">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-3 py-1 rounded-full">
          4-4-4-4 Box Breathing
        </span>
        <h3 className="text-xl font-extrabold text-slate-800">
          Down-Regulate Sympathetic Nervous System
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Used by medical and flight professionals to clear acute panic and lower heart rate.
        </p>
      </div>

      {/* Breathing Circle Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Animated breathing aura */}
        <div
          className={`absolute inset-0 rounded-full bg-calm-100 border border-calm-300 transition-transform ease-in-out ${getScaleClass()}`}
        />
        <div
          className={`absolute w-48 h-48 rounded-full bg-calm-200/60 transition-transform ease-in-out ${getScaleClass()}`}
        />
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-calm-800">
            {isActive ? phase : 'Ready'}
          </span>
          <span className="text-4xl font-extrabold text-slate-900 mt-1">
            {isActive ? secondsLeft : '4'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">seconds</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-sm shadow-md shadow-calm-700/20 transition"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isActive ? 'Pause' : 'Start 4-Minute Cycle'}</span>
        </button>
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-400 font-medium">
        Cycles completed: <span className="font-bold text-slate-700">{cyclesCompleted}</span> / 4
      </div>
    </div>
  );
};
