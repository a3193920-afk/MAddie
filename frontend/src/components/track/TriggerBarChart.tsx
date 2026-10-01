import React from 'react';

interface Props {
  stressors: Array<{ name: string; count: number; percentage: number }>;
}

export const TriggerBarChart: React.FC<Props> = ({ stressors }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-slate-800">Top Campus Stress Triggers</h3>
        <p className="text-xs text-slate-500">Most frequent stressors logged during your semester check-ins</p>
      </div>

      <div className="space-y-3 pt-1">
        {stressors.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{item.name}</span>
              <span className="text-calm-800 bg-calm-50 border border-calm-200 px-2 py-0.5 rounded-md text-[11px]">
                {item.percentage}% ({item.count} check-ins)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-calm-600 to-calm-400 transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 italic text-center pt-2 border-t border-slate-100">
        Academic deadlines and placement interview preparation represent 70% of logged campus tension.
      </p>
    </div>
  );
};
