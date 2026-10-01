import React from 'react';
import { WeeklyResilienceReport } from '../../types';
import { Sparkles, CheckCircle2, Lightbulb, Compass, HelpCircle } from 'lucide-react';

interface Props {
  report: WeeklyResilienceReport;
}

export const WeeklyResilienceCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-3 py-1 rounded-full">
            Longitudinal Report
          </span>
          <h3 className="text-lg font-extrabold text-slate-800 mt-2">
            Weekly Resilience Report ({report.period})
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Avg Mood: <span className="font-bold text-slate-800">{report.average_mood}/5</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Avg Stress: <span className="font-bold text-slate-800">{report.average_stress}/5</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Avg Sleep: <span className="font-bold text-slate-800">{report.average_sleep_hours}h</span>
          </div>
        </div>
      </div>

      {/* Positive Correlation Factors */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Positive Wellness Factors (What Correlated with Better Days)</span>
        </h4>
        <div className="space-y-1.5">
          {report.positive_factors.map((factor, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-950 font-medium leading-relaxed">
              • {factor}
            </div>
          ))}
        </div>
      </div>

      {/* Effective Interventions */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-calm-700" />
          <span>Most Effective Interventions for You ("What Worked For Me")</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {report.effective_interventions.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-calm-50 border border-calm-200 text-xs text-calm-950 font-medium">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Insight & Recommendation */}
      <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-calm-950 text-white space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-calm-300 font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-calm-400" />
            <span>Personalized Synthesis</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            "{report.personalized_insight}"
          </p>
        </div>

        <div className="pt-2 border-t border-slate-700/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Gentle Recommendation for This Week</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {report.recommendation}
          </p>
        </div>
      </div>

      {/* Transparent Attribution */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1.5">
        <div className="font-semibold text-slate-700 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-calm-600" />
          <span>Transparent Basis ("Why am I seeing this?"):</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
          {report.why_am_i_seeing_this.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
