import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, Plus, CheckCircle2, ShieldCheck, Heart, AlertOctagon, Flame } from 'lucide-react';
import { WhatHelpsMeProfile } from '../../types';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatHelpsMeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<WhatHelpsMeProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'add'>('manual');
  const [newSection, setNewSection] = useState('overwhelmed');
  const [newContent, setNewContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadManual();
    }
  }, [isOpen]);

  const loadManual = async () => {
    const data = await apiService.getUserManual();
    setProfile(data);
  };

  if (!isOpen) return null;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setIsSaving(true);
    await apiService.addUserManualItem(newSection, newContent.trim());
    setNewContent('');
    await loadManual();
    setIsSaving(false);
    setActiveTab('manual');
  };

  const sectionsConfig = [
    { id: 'overwhelmed', title: "When I'm overwhelmed", icon: '🌊', bg: 'bg-teal-50 border-teal-200' },
    { id: 'cannot_start', title: "When I can't start", icon: '🎯', bg: 'bg-calm-50 border-calm-200' },
    { id: 'lonely', title: "When I feel lonely", icon: '🤝', bg: 'bg-emerald-50 border-emerald-200' },
    { id: 'cannot_sleep', title: "When I can't sleep", icon: '🌙', bg: 'bg-indigo-50 border-indigo-200' },
    { id: 'makes_it_worse', title: "Things that usually make it worse", icon: '⚠️', bg: 'bg-amber-50 border-amber-200' },
    { id: 'words_to_remember', title: "Words worth remembering", icon: '🌱', bg: 'bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-calm-100 flex items-center justify-center text-calm-800 shadow-xs">
              <BookOpen className="w-5 h-5 text-calm-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">What Helps Me (My Manual)</h2>
              <p className="text-xs text-slate-500">Your private, evidence-informed guide to what actually supports you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'manual' ? 'bg-calm-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              My Support Profile
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'add' ? 'bg-calm-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Manual</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-calm-600" />
            <span>Private & User-Confirmed Only</span>
          </div>
        </div>

        {/* View Manual */}
        {activeTab === 'manual' && profile && (
          <div className="space-y-4 py-3 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
              💡 <strong>How Maddy learns:</strong> Maddy never invents assumptions about you. This personal manual is built exclusively from strategies you have confirmed and notes you have written.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectionsConfig.map((sec) => {
                const items = (profile as any)[sec.id] || [];
                return (
                  <div key={sec.id} className={`p-4 rounded-2xl border ${sec.bg} space-y-2`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sec.icon}</span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">{sec.title}</h4>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No notes confirmed yet.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {items.map((item: any) => (
                          <li key={item.id} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                            <span className="text-calm-600 mt-0.5">•</span>
                            <span>{item.content}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Entry Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddItem} className="space-y-4 py-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Manual Section
              </label>
              <select
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none bg-white focus:ring-2 focus:ring-calm-500/20"
              >
                {sectionsConfig.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.icon} {sec.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                What insight or strategy has proven true for you?
              </label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="e.g. Taking a 5-minute walk before opening the syllabus helps clear brain fog..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-calm-500/20 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !newContent.trim()}
                className={`px-5 py-2 rounded-xl font-bold text-xs text-white transition cursor-pointer ${
                  newContent.trim() ? 'bg-calm-700 hover:bg-calm-800' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {isSaving ? 'Saving...' : 'Add to My Manual'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
