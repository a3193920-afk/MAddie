import React, { useState } from 'react';
import { X, Users, Copy, Check, Sparkles, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AskForHelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Friend');
  const [topic, setTopic] = useState<string>('Academic overwhelm and feeling low');
  const [draft, setDraft] = useState<{ recipient: string; subject: string; message: string; tip: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const recipients = [
    { id: 'Friend', label: 'Friend / Roommate', icon: '🫂' },
    { id: 'Family', label: 'Parents / Family', icon: '🏡' },
    { id: 'Professor', label: 'Professor / Teacher', icon: '🎓' },
    { id: 'Counselor', label: 'Campus Counselor', icon: '🩺' },
    { id: 'Campus', label: 'Campus Support', icon: '🏛️' }
  ];

  const handleGenerate = async (recipient: string, customTopic?: string) => {
    setIsLoading(true);
    setCopied(false);
    setSelectedRecipient(recipient);
    const data = await apiService.generateHelpMessage(recipient, customTopic || topic);
    setDraft(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      handleGenerate('Friend');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-calm-100 flex items-center justify-center text-calm-800 shadow-xs">
              <Users className="w-5 h-5 text-calm-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">I Don't Know How to Ask for Help</h2>
              <p className="text-xs text-slate-500">Low-friction message templates to connect with real humans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Who would you like to reach out to?
            </label>
            <div className="flex flex-wrap gap-2">
              {recipients.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleGenerate(r.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    selectedRecipient === r.id
                      ? 'bg-calm-700 text-white border-calm-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {draft && (
            <div className="space-y-3 pt-2 animate-fade-in">
              {draft.subject && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Line:</span>
                  <div className="text-xs font-mono font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-0.5">
                    {draft.subject}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Draft:</span>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-calm-700 hover:text-calm-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to clipboard!' : 'Copy Text'}</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-slate-800 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {draft.message}
                </div>
              </div>

              {/* Supportive Tip */}
              <div className="p-3 rounded-xl bg-calm-50/70 border border-calm-200/80 text-xs text-calm-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-calm-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{draft.tip}</span>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-500">
            <HeartHandshake className="w-4 h-4 text-calm-600 shrink-0" />
            <span>
              Maddy is here with you, but connecting with real people is the heart of recovery. You don't have to carry this alone.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
