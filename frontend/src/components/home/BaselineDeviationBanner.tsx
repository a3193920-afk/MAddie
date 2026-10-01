import React from 'react';
import { AlertTriangle, ArrowRight, MessageSquareHeart } from 'lucide-react';
import { TabType } from '../../types';

interface Props {
  hasDeviation: boolean;
  onNavigateChat: (initialPrompt?: string) => void;
  onNavigateTrack: () => void;
}

export const BaselineDeviationBanner: React.FC<Props> = ({
  hasDeviation,
  onNavigateChat,
  onNavigateTrack,
}) => {
  if (!hasDeviation) return null;

  const contextualPrompt = 
    "You've been gaming more and sleeping less this week. Does gaming feel like relaxation, escape, procrastination, or just something you're enjoying?";

  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-5 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider">
              Early Wellness Signal
            </span>
            <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
              Shift Detected
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Your recent pattern differs from your usual routine.
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Over the last 3 days, late evening screen time rose (+180%) while sleep duration dipped below 5.5 hours. 
            This is a gentle wellness observation comparing your own patterns, not a diagnosis.
          </p>
        </div>
      </div>

      <div className="bg-white/80 p-3 rounded-2xl border border-amber-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <MessageSquareHeart className="w-4 h-4 text-calm-700 shrink-0" />
          <span className="italic">"{contextualPrompt}"</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateChat(contextualPrompt)}
            className="px-3 py-1.5 rounded-xl bg-calm-700 hover:bg-calm-800 text-white text-xs font-semibold transition"
          >
            Reflect with AI
          </button>
          <button
            onClick={onNavigateTrack}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            View Trend
          </button>
        </div>
      </div>
    </div>
  );
};
