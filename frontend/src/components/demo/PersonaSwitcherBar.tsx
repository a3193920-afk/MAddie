import React, { useState } from 'react';
import { Persona } from '../../types';
import { Sparkles, AlertCircle, ChevronDown, Check } from 'lucide-react';

interface Props {
  personas: Persona[];
  activePersona: Persona | null;
  onSelectPersona: (p: Persona) => void;
}

export const PersonaSwitcherBar: React.FC<Props> = ({ personas, activePersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 text-white px-3 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-calm-600/30 text-calm-300 px-2 py-0.5 rounded-full font-medium border border-calm-500/40">
          <Sparkles className="w-3 h-3 text-calm-400" />
          Judge Demo Bar
        </span>
        <span className="hidden sm:inline text-slate-400">
          Instant Persona & Stress Scenarios:
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-200 border border-slate-700 transition"
        >
          <span className="font-semibold text-calm-300">
            {activePersona ? activePersona.name : 'Select Scenario (Personas A - G)'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1 z-50 max-h-96 overflow-y-auto">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
              Select Demo Scenario
            </div>
            {personas.map((p) => {
              const isSelected = activePersona?.id === p.id;
              const isCrisis = p.id === 'persona_f';
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPersona(p);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded flex flex-col gap-0.5 transition ${
                    isSelected ? 'bg-calm-950/70 border border-calm-500/30' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isCrisis ? 'text-rose-400' : 'text-slate-200'}`}>
                      {p.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-calm-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{p.tagline}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
