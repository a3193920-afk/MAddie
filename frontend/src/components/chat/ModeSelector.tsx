import React, { useState } from 'react';
import { Sparkles, ChevronDown, Check, Ear, HelpCircle, ListTodo, Wind, Calendar } from 'lucide-react';
import { ChatMode } from '../../types';

interface Props {
  currentMode: ChatMode;
  onSelectMode: (mode: ChatMode) => void;
}

export const ModeSelector: React.FC<Props> = ({ currentMode, onSelectMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const modes: Array<{ id: ChatMode; label: string; icon: React.FC<{ className?: string }>; desc: string }> = [
    { id: 'Adaptive (Auto)', label: 'Adaptive (Auto)', icon: Sparkles, desc: 'Automatically senses venting, planning, or calming' },
    { id: 'Just listen', label: 'Just listen', icon: Ear, desc: 'Pure active listening without any unsolicited advice' },
    { id: 'Help me understand', label: 'Help me understand', icon: HelpCircle, desc: 'CBT reflection & perspective' },
    { id: 'Give practical steps', label: 'Practical steps', icon: ListTodo, desc: 'Bite-sized micro-actions' },
    { id: 'Help me calm down', label: 'Calm me down', icon: Wind, desc: 'Somatic grounding & paced breath' },
    { id: 'Help me plan', label: 'Study planner', icon: Calendar, desc: 'Deconstruct academic deadlines' },
  ];

  const active = modes.find((m) => m.id === currentMode) || modes[0];
  const ActiveIcon = active.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition"
        title="Optional Tone Preference (Defaults to Adaptive)"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-calm-700" />
        <span className="font-semibold">{active.label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-fade-in">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Optional Tone Style
          </div>
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = currentMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelectMode(m.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition ${
                  isSelected ? 'bg-calm-50 text-calm-950 border border-calm-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-calm-700' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{m.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-calm-700" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{m.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
