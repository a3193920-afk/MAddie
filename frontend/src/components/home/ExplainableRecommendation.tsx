import React, { useState } from 'react';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, Play, ArrowRight } from 'lucide-react';
import { TabType } from '../../types';

interface Props {
  recommendationTitle: string;
  recommendationDuration: string;
  whyExplanation: string;
  onStartIntervention: () => void;
}

export const ExplainableRecommendation: React.FC<Props> = ({
  recommendationTitle,
  recommendationDuration,
  whyExplanation,
  onStartIntervention,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-gradient-to-r from-calm-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Decorative leaf watermark */}
      <div className="absolute right-3 bottom-0 text-7xl opacity-5 pointer-events-none select-none">
        🌿
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-calm-500/20 text-calm-300 border border-calm-400/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-calm-400" />
              Tailored Micro-Intervention
            </span>
            <span className="text-xs text-slate-400 font-medium">({recommendationDuration})</span>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {recommendationTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Calibrate your nervous system with this quick reset before continuing your study block.
          </p>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-1 text-xs text-calm-300 hover:text-calm-200 underline mt-1 font-medium transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why am I seeing this recommendation?</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          onClick={onStartIntervention}
          className="self-start md:self-center shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-calm-500 hover:bg-calm-400 text-slate-950 font-bold text-sm shadow-lg shadow-calm-500/30 transition transform hover:-translate-y-0.5"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Start Reset Now</span>
        </button>
      </div>

      {showExplanation && (
        <div className="mt-4 pt-4 border-t border-slate-700/80 text-xs text-slate-300 space-y-1.5 animate-fade-in">
          <div className="font-semibold text-calm-300 flex items-center gap-1.5">
            <span>Basis of this recommendation:</span>
          </div>
          <p className="leading-relaxed text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            {whyExplanation}
          </p>
          <p className="text-[11px] text-slate-400 italic">
            This recommendation is generated using transparent rule-based wellness thresholds and your past feedback, not clinical disease diagnosis.
          </p>
        </div>
      )}
    </div>
  );
};
