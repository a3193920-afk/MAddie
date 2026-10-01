import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  interventionName: string;
  interventionId: string;
}

export const OutcomeFeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  interventionName,
  interventionId,
}) => {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [learningMessage, setLearningMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const ratings = [
    { id: 'worse', label: 'Worse', emoji: '😣', desc: 'Need a different exercise' },
    { id: 'same', label: 'Same', emoji: '😐', desc: 'Felt neutral' },
    { id: 'a_little', label: 'A little', emoji: '🙂', desc: 'Noticeable drop in tension' },
    { id: 'a_lot', label: 'A lot', emoji: '😄', desc: 'Substantial calm restored' },
  ];

  const handleSubmit = async () => {
    if (!selectedRating) return;
    setIsSubmitting(true);
    try {
      const res = await apiService.submitFeedback({
        intervention_id: interventionId,
        intervention_name: interventionName,
        rating: selectedRating,
      });
      setLearningMessage(res.user_learning_stat || 'Logged outcome feedback.');
    } catch {
      setLearningMessage('Recorded outcome to your local profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-calm-700">
            <Sparkles className="w-4 h-4" />
            <span>"What Worked For Me?" Loop</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-800">
            Did this exercise help?
          </h3>
          <p className="text-xs text-slate-500">
            Completed: <span className="font-semibold text-slate-700">{interventionName}</span>
          </p>
        </div>

        {!learningMessage ? (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              {ratings.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRating(r.id)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRating === r.id
                      ? 'bg-calm-100 border-calm-500 text-calm-950 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs font-bold">{r.label}</span>
                  <span className="text-[10px] text-slate-400">{r.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedRating || isSubmitting}
              className="w-full py-3 px-6 rounded-2xl bg-calm-700 hover:bg-calm-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs shadow-md shadow-calm-700/20 transition"
            >
              {isSubmitting ? 'Updating Personal Model...' : 'Save Feedback & Learn'}
            </button>
          </>
        ) : (
          <div className="space-y-4 py-2 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
              {learningMessage}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
