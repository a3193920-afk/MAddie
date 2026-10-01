import React from 'react';
import { Home, MessageSquare, Wind, Activity, HeartHandshake, BookOpen, Shield, Heart } from 'lucide-react';
import { TabType, UserProfile } from '../../types';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenPrivacy: () => void;
  currentUser?: UserProfile | null;
}

export const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenPrivacy, currentUser }) => {
  const baseNavItems = [
    { id: 'HOME' as TabType, label: 'HOME', icon: Home, desc: 'Dashboard & Check-in' },
    { id: 'CHAT' as TabType, label: 'CHAT', icon: MessageSquare, desc: 'Empathetic Companion' },
    { id: 'RELAX' as TabType, label: 'RELAX', icon: Wind, desc: 'Breathing, Games, Audio' },
    { id: 'TRACK' as TabType, label: 'TRACK', icon: Activity, desc: 'Baselines & Trends' },
  ];

  if (currentUser?.gender === 'female') {
    baseNavItems.push({ id: 'CYCLE' as TabType, label: 'CYCLE', icon: Heart, desc: 'Menstrual Tracking' });
  }

  baseNavItems.push(
    { id: 'JOURNAL' as TabType, label: 'JOURNAL', icon: BookOpen, desc: 'Encrypted Vault' },
    { id: 'HELP' as TabType, label: 'HELP', icon: HeartHandshake, desc: 'Campus & Crisis Hotlines' }
  );

  const navItems = baseNavItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 justify-between h-[calc(100vh-61px)]">
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-calm-100 text-calm-900 shadow-sm border border-calm-200/80'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-calm-700' : 'text-slate-400'}`} />
              <div className="text-left">
                <div>{item.label}</div>
                <div className="text-[11px] font-normal text-slate-400">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Non-diagnostic notice & privacy trigger card */}
      <div className="p-3 rounded-2xl bg-sand-100 border border-sand-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Shield className="w-3.5 h-3.5 text-calm-600" />
          <span>Non-Diagnostic Space</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Maddy supports wellness, detects stress signals, and does not diagnose psychiatric conditions.
        </p>
        <button
          onClick={onOpenPrivacy}
          className="w-full text-xs font-medium text-calm-700 hover:text-calm-800 text-left underline"
        >
          View Data Minimization Controls →
        </button>
      </div>
    </aside>
  );
};
