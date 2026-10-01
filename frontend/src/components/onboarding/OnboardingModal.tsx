import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, HeartHandshake } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [permissions, setPermissions] = useState({
    aiConversations: true,
    moodTracking: true,
    journalAnalysis: false, // Privacy-first default off
    behaviorInsights: true,
    menstrualTracking: false, // Privacy-first default off
    community: true,
    notifications: true,
  });

  if (!isOpen) return null;

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden relative">
        {step === 1 ? (
          /* Screen 1 */
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-calm-100 flex items-center justify-center text-3xl shadow-inner">
              🌿
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Welcome to Maddy
              </h2>
              <p className="text-sm font-medium text-calm-700">
                A private, compassionate digital companion for your college life.
              </p>
            </div>

            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-calm-50 border border-calm-100">
                <CheckCircle2 className="w-5 h-5 text-calm-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">No judgment. Speak freely in English or Hinglish.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-calm-50 border border-calm-100">
                <CheckCircle2 className="w-5 h-5 text-calm-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">No clinical diagnosis. We support everyday student wellness.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-calm-50 border border-calm-100">
                <CheckCircle2 className="w-5 h-5 text-calm-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">You control your data. Client-side encrypted journal.</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-sm shadow-md shadow-calm-700/20 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Screen 2 */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Your Privacy, Your Choice</h3>
                <p className="text-xs text-slate-500">Enable only what you are comfortable with. Change anytime.</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-calm-600" />
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {/* Permission Item 1 */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="pr-2">
                  <div className="text-sm font-semibold text-slate-800">AI Conversations</div>
                  <div className="text-[11px] text-slate-500">Empathetic chat with cultural Gen-Z / Hinglish understanding.</div>
                </div>
                <input
                  type="checkbox"
                  checked={permissions.aiConversations}
                  onChange={() => togglePermission('aiConversations')}
                  className="mt-1 w-4 h-4 accent-calm-600 cursor-pointer"
                />
              </div>

              {/* Permission Item 2 */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="pr-2">
                  <div className="text-sm font-semibold text-slate-800">Mood & Stress Tracking</div>
                  <div className="text-[11px] text-slate-500">30-second daily check-in to visualize your semester patterns.</div>
                </div>
                <input
                  type="checkbox"
                  checked={permissions.moodTracking}
                  onChange={() => togglePermission('moodTracking')}
                  className="mt-1 w-4 h-4 accent-calm-600 cursor-pointer"
                />
              </div>

              {/* Permission Item 3 */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="pr-2">
                  <div className="text-sm font-semibold text-slate-800">Behavioral Baseline Insights</div>
                  <div className="text-[11px] text-slate-500">
                    Compares your gaming/sleep with your own normal pattern. Not used to diagnose illness.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={permissions.behaviorInsights}
                  onChange={() => togglePermission('behaviorInsights')}
                  className="mt-1 w-4 h-4 accent-calm-600 cursor-pointer"
                />
              </div>

              {/* Permission Item 4 */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="pr-2">
                  <div className="text-sm font-semibold text-slate-800">Encrypted Journal Vault</div>
                  <div className="text-[11px] text-slate-500">
                    Encrypted client-side with AES-256-GCM. Never sent to AI without single-thought reframing consent.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={permissions.journalAnalysis}
                  onChange={() => togglePermission('journalAnalysis')}
                  className="mt-1 w-4 h-4 accent-calm-600 cursor-pointer"
                />
              </div>

              {/* Permission Item 5 */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="pr-2">
                  <div className="text-sm font-semibold text-slate-800">Anonymous Community</div>
                  <div className="text-[11px] text-slate-500">Peer support forum without real names or student IDs.</div>
                </div>
                <input
                  type="checkbox"
                  checked={permissions.community}
                  onChange={() => togglePermission('community')}
                  className="mt-1 w-4 h-4 accent-calm-600 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3 px-6 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-sm shadow-md shadow-calm-700/20 transition"
            >
              Enter Maddy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
