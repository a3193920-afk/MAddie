import React from 'react';
import { MessageSquare, Wind, BookOpen, Clock, ArrowUpRight } from 'lucide-react';
import { TabType } from '../../types';

interface Props {
  onNavigate: (tab: TabType) => void;
  onOpenCheckIn: () => void;
}

export const ActionGrid: React.FC<Props> = ({ onNavigate, onOpenCheckIn }) => {
  const actions = [
    {
      title: 'Talk to AI',
      subtitle: 'Vent freely or seek gentle clarity',
      icon: MessageSquare,
      tab: 'CHAT' as TabType,
      gradient: 'from-calm-700 to-calm-600',
      badge: 'Gen-Z / Hinglish Ready',
    },
    {
      title: 'Calm Me',
      subtitle: '3-min 4-4-4 breathing & sensory reset',
      icon: Wind,
      tab: 'RELAX' as TabType,
      gradient: 'from-teal-700 to-teal-600',
      badge: 'Immediate Relief',
    },
    {
      title: 'Encrypted Journal',
      subtitle: 'Private thoughts locked with Web Crypto',
      icon: BookOpen,
      tab: 'JOURNAL' as TabType,
      gradient: 'from-slate-800 to-slate-700',
      badge: 'AES-256-GCM',
    },
    {
      title: 'Check Progress',
      subtitle: 'Personal baselines & weekly report',
      icon: Clock,
      tab: 'TRACK' as TabType,
      gradient: 'from-emerald-800 to-emerald-700',
      badge: 'Correlations',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <button
            key={idx}
            onClick={() => onNavigate(act.tab)}
            className="group relative bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-calm-300 transition-all text-left flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${act.gradient} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-calm-100 flex items-center justify-center text-slate-400 group-hover:text-calm-700 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {act.badge}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-2">{act.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{act.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
