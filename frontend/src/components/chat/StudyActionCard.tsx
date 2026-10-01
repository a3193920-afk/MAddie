import React from 'react';
import { StudyActionPlan } from '../../types';
import { Clock, CheckCircle2, Wind, Coffee, Sparkles } from 'lucide-react';

interface Props {
  plan: StudyActionPlan;
  onStartBreathing: () => void;
}

export const StudyActionCard: React.FC<Props> = ({ plan, onStartBreathing }) => {
  return (
    <div className="bg-sand-50 border border-sand-200 rounded-2xl p-4 my-2.5 space-y-3 text-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-calm-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{plan.title}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>{plan.total_time_minutes} mins total</span>
        </div>
      </div>

      <div className="space-y-2">
        {plan.blocks.map((block, idx) => {
          const isBreathing = block.category === 'breathing_reset';
          const isBreak = block.category === 'active_break';
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                isBreathing
                  ? 'bg-calm-100/70 border-calm-300 text-calm-900'
                  : isBreak
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isBreathing ? (
                  <Wind className="w-4 h-4 text-calm-700" />
                ) : isBreak ? (
                  <Coffee className="w-4 h-4 text-amber-700" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{block.task_name}</span>
                  <span className="font-mono text-[11px] text-slate-500">{block.time_window}</span>
                </div>
                {block.tip && (
                  <p className="text-[11px] text-slate-500 italic">{block.tip}</p>
                )}
                {isBreathing && (
                  <button
                    onClick={onStartBreathing}
                    className="inline-flex items-center gap-1 text-[11px] text-calm-700 hover:text-calm-900 underline font-semibold mt-1"
                  >
                    Launch 4-4-4 Breathing Exercise →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 font-medium italic border-t border-sand-200 pt-2">
        "{plan.encouragement}"
      </p>
    </div>
  );
};
