import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CheckInEntry } from '../../types';

interface Props {
  data: CheckInEntry[];
}

export const MoodStressChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800">Mood vs. Stress Dynamics</h3>
          <p className="text-xs text-slate-500">14-day longitudinal trends across your campus routine</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-calm-800">
            <span className="w-2.5 h-2.5 rounded-full bg-calm-600"></span>
            <span>Mood (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Stress (1-5)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#528974" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#528974" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#34584b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#moodGradient)"
              name="Mood"
            />
            <Area
              type="monotone"
              dataKey="stress"
              stroke="#e11d48"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#stressGradient)"
              name="Stress"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        Higher stress days frequently precede lower energy ratings. Notice when stress down-regulates after resets.
      </div>
    </div>
  );
};
