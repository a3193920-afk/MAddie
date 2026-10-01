import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { RecoverySupportMode, ChatMode } from '../../types';

interface Props {
  modes: RecoverySupportMode[];
  selectedMode?: ChatMode;
  onSelectMode: (mode: RecoverySupportMode) => void;
  compact?: boolean;
}

export const SupportModeSelector: React.FC<Props> = ({
  modes,
  selectedMode,
  onSelectMode,
  compact = false
}) => {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all ${
      compact ? 'p-3 sm:p-4' : 'p-5 sm:p-6 space-y-4'
    }`}>
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-calm-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Support Choice</span>
          </div>
          <h3 className={`${compact ? 'text-sm' : 'text-base sm:text-lg'} font-bold text-slate-800 tracking-tight`}>
            What would help right now?
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Choose what fits your moment
        </span>
      </div>

      {/* 8 Modes Grid */}
      <div className={`grid ${
        compact 
          ? 'grid-cols-2 sm:grid-cols-4 gap-2 pt-2' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
      }`}>
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.label;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group cursor-pointer relative ${
                isSelected
                  ? 'bg-calm-50/90 border-calm-500 ring-2 ring-calm-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-calm-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{mode.icon}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isSelected ? 'text-calm-700' : 'text-slate-300 group-hover:text-calm-600'
                  }`} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-calm-800 transition">
                  {mode.label}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {mode.description}
                </p>
              </div>

              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-calm-600 absolute top-2.5 right-2.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
