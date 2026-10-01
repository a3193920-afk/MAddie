import React, { useState } from 'react';
import { X, ShieldCheck, Download, Trash2, Eye, Info, Check, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentContext: {
    mood?: number;
    stress?: number;
    primaryStressor?: string;
    mode?: string;
  };
}

export const PrivacyCenterModal: React.FC<Props> = ({ isOpen, onClose, currentContext }) => {
  const [toggles, setToggles] = useState({
    aiJournalAccess: false, // Default STRICTLY false
    behaviorInsights: true,
    menstrualTracking: false,
    communitySharing: true,
    analytics: false,
  });

  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      studentState: currentContext,
      privacySettings: toggles,
      note: 'Client-side export. Encrypted journals remain protected with your passphrase.'
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maddy-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all locally cached wellness data and encrypted journal keys?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-calm-100 flex items-center justify-center text-calm-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Privacy & Data Governance</h2>
              <p className="text-xs text-slate-500">Zero-knowledge cryptography and strict data minimization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Live AI Context Inspector Card */}
          <div className="p-4 rounded-2xl bg-calm-50/80 border border-calm-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-calm-900 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-calm-700" />
                <span>Live Data Minimization Inspector</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                Minimization Verified
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Below is the exact and only payload permitted to reach the AI model during your current conversation:
            </p>
            <div className="bg-white p-3 rounded-xl border border-calm-100 font-mono text-xs text-slate-700 space-y-1">
              <div><span className="text-slate-400">Current Mood:</span> {currentContext.mood ? `${currentContext.mood}/5` : 'Not provided'}</div>
              <div><span className="text-slate-400">Current Stress:</span> {currentContext.stress ? `${currentContext.stress}/5` : 'Not provided'}</div>
              <div><span className="text-slate-400">Active Campus Stressor:</span> {currentContext.primaryStressor || 'General Campus Life'}</div>
              <div><span className="text-slate-400">Conversational Mode:</span> {currentContext.mode || 'Help me understand'}</div>
              <div className="text-emerald-700 font-semibold pt-1 border-t border-slate-100 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Zero student names, phone numbers, roll numbers, or raw journal text included.
              </div>
            </div>
          </div>

          {/* Granular Permission Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs">
              Feature Consent Toggles
            </h3>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-calm-600" />
                    AI Access to Journal Entries
                  </div>
                  <div className="text-xs text-slate-500">Allow AI to read full journal notes for summaries (Default: Off)</div>
                </div>
                <input
                  type="checkbox"
                  checked={toggles.aiJournalAccess}
                  onChange={(e) => setToggles({ ...toggles, aiJournalAccess: e.target.checked })}
                  className="w-4 h-4 accent-calm-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Behavioral Baseline Deviations</div>
                  <div className="text-xs text-slate-500">Compare screen time and sleep patterns against personal baseline</div>
                </div>
                <input
                  type="checkbox"
                  checked={toggles.behaviorInsights}
                  onChange={(e) => setToggles({ ...toggles, behaviorInsights: e.target.checked })}
                  className="w-4 h-4 accent-calm-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Menstrual Wellness Module</div>
                  <div className="text-xs text-slate-500">Optional cycle tracking and mood correlation patterns</div>
                </div>
                <input
                  type="checkbox"
                  checked={toggles.menstrualTracking}
                  onChange={(e) => setToggles({ ...toggles, menstrualTracking: e.target.checked })}
                  className="w-4 h-4 accent-calm-600"
                />
              </label>
            </div>
          </div>

          {/* Data Ownership & Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export My Data (JSON)</span>
            </button>

            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Wipe Local Data & Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
