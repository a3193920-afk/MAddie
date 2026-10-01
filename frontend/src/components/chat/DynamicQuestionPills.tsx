import React from 'react';
import { DynamicQuestion } from '../../types';
import { Sparkles } from 'lucide-react';

interface Props {
  questions: DynamicQuestion[];
  onSelectOption: (optionText: string) => void;
}

export const DynamicQuestionPills: React.FC<Props> = ({ questions, onSelectOption }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
      {questions.map((q, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-calm-600" />
            <span>{q.question}</span>
          </div>
          {q.options && q.options.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => onSelectOption(opt)}
                  className="px-2.5 py-1 rounded-xl bg-calm-50 hover:bg-calm-100 text-calm-800 border border-calm-200 text-xs font-medium transition text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
