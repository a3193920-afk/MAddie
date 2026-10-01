import React from 'react';
import { BaselineMetric } from '../../types';
import { Activity, AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  metrics: BaselineMetric[];
}

export const BaselineComparisonCard: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-calm-700">
            <Activity className="w-4 h-4" />
            <span>Personal Baseline Engine</span>
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Rolling Semester Baseline vs. Recent 3-Day Shift
          </h3>
        </div>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
          14-Day Baseline
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {metrics.map((m, idx) => {
          const isAttention = m.status_tone === 'attention';
          const isPositiveDev = m.deviation_percent > 0;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition ${
                isAttention
                  ? 'bg-amber-50/60 border-amber-200 text-slate-800'
                  : 'bg-slate-50/70 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {m.metric}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                    isAttention
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isPositiveDev ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{isPositiveDev ? `+${m.deviation_percent}%` : `${m.deviation_percent}%`}</span>
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-900">
                  {m.current_value} {m.unit}
                </span>
                <span className="text-xs text-slate-500">
                  (Baseline: {m.baseline_value} {m.unit})
                </span>
              </div>

              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {m.message}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200 text-xs text-slate-600 leading-relaxed space-y-1">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-calm-700" />
          <span>Non-Diagnostic Framing Notice:</span>
        </div>
        <p>
          "Your recent pattern differs from your usual routine." We measure behavioral variance against your own historical data to offer supportive pacing, never to infer mental illness.
        </p>
      </div>
    </div>
  );
};
