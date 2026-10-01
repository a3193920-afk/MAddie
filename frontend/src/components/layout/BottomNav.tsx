import React from 'react';
import { Home, MessageSquare, Wind, Activity, HeartHandshake, Heart } from 'lucide-react';
import { TabType, UserProfile } from '../../types';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser?: UserProfile | null;
}

export const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab, currentUser }) => {
  const items = [
    { id: 'HOME' as TabType, label: 'Home', icon: Home },
    { id: 'CHAT' as TabType, label: 'Chat', icon: MessageSquare },
    { id: 'RELAX' as TabType, label: 'Relax', icon: Wind },
    { id: 'TRACK' as TabType, label: 'Track', icon: Activity },
  ];

  if (currentUser?.gender === 'female') {
    items.push({ id: 'CYCLE' as TabType, label: 'Cycle', icon: Heart });
  }

  items.push({ id: 'HELP' as TabType, label: 'Help', icon: HeartHandshake });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              isActive ? 'text-calm-700 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-calm-700' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
