import React from 'react';
import { Play, Sparkles, Brain, Clock, CheckCircle2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onStart: () => void;
  title: string;
  subtitle: string;
  icon: string;
  neurosciencePurpose: string;
  steps: string[];
  recommendedDuration: string;
}

export const GameGuideModal: React.FC<Props> = ({
  isOpen,
  onStart,
  title,
  subtitle,
  icon,
  neurosciencePurpose,
  steps,
  recommendedDuration,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between animate-fade-in text-slate-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-calm-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-calm-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mindful Game Guide</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        {/* Neuroscience / Mindfulness Rationale Box */}
        <div className="p-4 rounded-2xl bg-calm-50/90 border border-calm-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-calm-900">
            <Brain className="w-4 h-4 text-calm-700" />
            <span>Why this exercise works (Neuroscience Basis):</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {neurosciencePurpose}
          </p>
        </div>

        {/* 3 Step Instructions */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            How to play with presence:
          </span>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="w-5 h-5 rounded-full bg-calm-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Start Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Recommended: {recommendedDuration}</span>
          <span className="text-slate-300">•</span>
          <span className="text-calm-700 font-semibold">Zero point penalties</span>
        </div>

        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-md shadow-calm-700/20 transition transform hover:-translate-y-0.5"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Begin Calming Exercise</span>
        </button>
      </div>
    </div>
  );
};
