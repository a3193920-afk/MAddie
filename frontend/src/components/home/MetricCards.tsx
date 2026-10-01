import React from 'react';
import { Smile, Zap, Moon, Flame } from 'lucide-react';

interface Props {
  mood: number;
  stress: number;
  energy: number;
  sleep: string;
}

export const MetricCards: React.FC<Props> = ({ mood, stress, energy, sleep }) => {
  const getMoodLabel = (m: number) => {
    switch (m) {
      case 5: return { label: 'Very Good', emoji: '😄', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 4: return { label: 'Good', emoji: '🙂', color: 'text-teal-700 bg-teal-50 border-teal-200' };
      case 3: return { label: 'Okay', emoji: '😐', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 2: return { label: 'Low', emoji: '😔', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      default: return { label: 'Very Low', emoji: '😞', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  const getStressLabel = (s: number) => {
    switch (s) {
      case 5: return { label: 'Overwhelmed', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 4: return { label: 'High Stress', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 3: return { label: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 2: return { label: 'Mild', color: 'text-teal-700 bg-teal-50 border-teal-200' };
      default: return { label: 'Very Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  };

  const moodInfo = getMoodLabel(mood);
  const stressInfo = getStressLabel(stress);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Mood Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Mood</span>
          <span className="text-lg">{moodInfo.emoji}</span>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-800">{mood} / 5</div>
          <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${moodInfo.color}`}>
            {moodInfo.label}
          </span>
        </div>
      </div>

      {/* Stress Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Stress</span>
          <Flame className={`w-4 h-4 ${stress >= 4 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-800">{stress} / 5</div>
          <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${stressInfo.color}`}>
            {stressInfo.label}
          </span>
        </div>
      </div>

      {/* Energy Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Energy</span>
          <Zap className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-800">{energy} / 5</div>
          <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border text-emerald-800 bg-emerald-50 border-emerald-200">
            {energy >= 4 ? 'Energized' : energy === 3 ? 'Steady' : 'Drained'}
          </span>
        </div>
      </div>

      {/* Sleep Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Sleep</span>
          <Moon className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-800">{sleep}</div>
          <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border text-indigo-800 bg-indigo-50 border-indigo-200">
            Reported Quality
          </span>
        </div>
      </div>
    </div>
  );
};
