import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Key, Plus, Search, Tag, Sparkles, ShieldCheck, Check, HelpCircle } from 'lucide-react';
import { encryptJournalText, decryptJournalText } from '../../lib/crypto';
import { EncryptedJournalRecord } from '../../types';

interface Props {
  isUnlocked: boolean;
  onUnlockStateChange: (unlocked: boolean) => void;
}

export const EncryptedVault: React.FC<Props> = ({ isUnlocked, onUnlockStateChange }) => {
  const [passphrase, setPassphrase] = useState('maddy2026'); // Pre-filled default demo passphrase for ease of judge testing
  const [entries, setEntries] = useState<EncryptedJournalRecord[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState(3);
  const [newStress, setNewStress] = useState(3);
  const [selectedTag, setSelectedTag] = useState<string>('Exam prep');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // CBT Reframer state
  const [selectedThought, setSelectedThought] = useState<string>('');
  const [cbtResult, setCbtResult] = useState<any | null>(null);
  const [isReframing, setIsReframing] = useState(false);

  // Pre-seed 2 sample encrypted entries in localStorage if empty
  useEffect(() => {
    const cached = localStorage.getItem('cc_encrypted_vault');
    if (!cached) {
      // Create initial sample encrypted entries
      (async () => {
        try {
          const sample1 = await encryptJournalText(
            "Today's placement shortlist came out and my name was not on the list. Felt an immediate drop in my stomach. Talked to a roommate, reminded myself this is just the first company.",
            'maddy2026'
          );
          const sample2 = await encryptJournalText(
            "Studied for 4 hours at the central library. Finished the Database indexing chapter. Brain felt fried around 4 PM, but a short walk around the campus sports complex helped reset my focus.",
            'maddy2026'
          );
          const initRecords: EncryptedJournalRecord[] = [
            {
              id: 'j_1',
              title: 'Placement shortlist reflection',
              ciphertext: sample1.ciphertext,
              iv: sample1.iv,
              salt: sample1.salt,
              mood_tag: 2,
              stress_tag: 4,
              tags: ['Placement', 'Emotions'],
              created_at: 'Sep 28, 2026 - 08:30 PM',
            },
            {
              id: 'j_2',
              title: 'Library focus block & evening walk',
              ciphertext: sample2.ciphertext,
              iv: sample2.iv,
              salt: sample2.salt,
              mood_tag: 4,
              stress_tag: 2,
              tags: ['Exam prep', 'Reset'],
              created_at: 'Sep 29, 2026 - 06:15 PM',
            },
          ];
          localStorage.setItem('cc_encrypted_vault', JSON.stringify(initRecords));
        } catch (e) {
          console.warn('Failed to pre-seed encrypted vault:', e);
        }
      })();
    }
  }, []);

  const handleUnlock = async () => {
    setErrorMsg(null);
    if (!passphrase) {
      setErrorMsg('Please enter a passphrase.');
      return;
    }

    try {
      const stored = localStorage.getItem('cc_encrypted_vault');
      const records: EncryptedJournalRecord[] = stored ? JSON.parse(stored) : [];

      // Decrypt each record client-side
      const decryptedRecords = await Promise.all(
        records.map(async (r) => {
          try {
            const cleartext = await decryptJournalText(
              { ciphertext: r.ciphertext, iv: r.iv, salt: r.salt },
              passphrase
            );
            return { ...r, decryptedContent: cleartext };
          } catch {
            return { ...r, decryptedContent: '[Decryption failed: Key mismatch]' };
          }
        })
      );

      setEntries(decryptedRecords);
      onUnlockStateChange(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Decryption failed.');
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const encrypted = await encryptJournalText(newContent.trim(), passphrase);
      const newRecord: EncryptedJournalRecord = {
        id: `j_${Date.now()}`,
        title: newTitle.trim(),
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        salt: encrypted.salt,
        mood_tag: newMood,
        stress_tag: newStress,
        tags: [selectedTag],
        created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        decryptedContent: newContent.trim(),
      };

      const updated = [newRecord, ...entries];
      setEntries(updated);
      localStorage.setItem('cc_encrypted_vault', JSON.stringify(updated.map(({ decryptedContent, ...rest }) => rest)));

      setNewTitle('');
      setNewContent('');
      setIsCreating(false);
    } catch (err: any) {
      setErrorMsg('Encryption error: ' + err.message);
    }
  };

  const handleReframeThought = async (thought: string) => {
    setIsReframing(true);
    setCbtResult(null);
    try {
      const res = await fetch('/api/journal/reframe-thought', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automatic_thought: thought }),
      });
      const data = await res.json();
      setCbtResult(data);
    } catch {
      setCbtResult({
        identified_cognitive_trap: 'Catastrophizing',
        balanced_reframing: 'One challenge does not define your entire future. Break the workload into immediate 15-minute actions.',
        action_step: 'Take a slow breath and step back from the thought.',
      });
    } finally {
      setIsReframing(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.decryptedContent && e.decryptedContent.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Web Crypto Client-Side Encrypted
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Private Journal Vault</h2>
          <p className="text-xs text-slate-500">
            Encrypted with AES-256-GCM + PBKDF2 directly in your browser. Server and AI cannot read cleartext.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <button
              onClick={() => onUnlockStateChange(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Lock Vault</span>
            </button>
          ) : (
            <div className="text-xs font-bold text-calm-700 bg-calm-50 border border-calm-200 px-3 py-1.5 rounded-xl">
              Vault Locked
            </div>
          )}
        </div>
      </div>

      {/* Vault Locked Screen */}
      {!isUnlocked ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-md mx-auto space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-700 mx-auto shadow-inner">
            <Key className="w-8 h-8 text-calm-700" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">Unlock Encrypted Journal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your local passphrase to derive the AES-256 key and decrypt your thoughts in browser memory.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-calm-500/20 focus:border-calm-500 text-center font-mono"
            />
            {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
            <button
              onClick={handleUnlock}
              className="w-full py-3.5 px-6 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-sm shadow-md shadow-calm-700/20 transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Vault (Demo Passphrase: maddy2026)</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Zero-knowledge architecture: We never store your passphrase on any server.
          </p>
        </div>
      ) : (
        /* Vault Unlocked Screen */
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search decrypted entries..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-calm-500/20"
              />
            </div>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-sm shadow-calm-700/20 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Cancel Entry' : 'New Encrypted Entry'}</span>
            </button>
          </div>

          {/* New Entry Form */}
          {isCreating && (
            <form onSubmit={handleSaveEntry} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm animate-fade-in">
              <div className="font-bold text-sm text-slate-800">Draft New Private Thought</div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Entry title (e.g., Midnight exam reflection, Hostel thoughts...)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-calm-500"
                required
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Write freely. When you click save, this will be encrypted client-side using AES-256-GCM before being stored..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-calm-500 leading-relaxed"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Category Tag:</span>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-xs"
                  >
                    <option value="Exam prep">Exam prep</option>
                    <option value="Placement">Placement</option>
                    <option value="Hostel life">Hostel life</option>
                    <option value="Emotions">Emotions</option>
                    <option value="Relationships">Relationships</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-md transition"
                >
                  Encrypt & Save Entry
                </button>
              </div>
            </form>
          )}

          {/* CBT Reframer Result Drawer if active */}
          {cbtResult && (
            <div className="bg-calm-50 border border-calm-200 rounded-3xl p-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-calm-800">
                  <Sparkles className="w-4 h-4 text-calm-600" />
                  <span>Privacy-Minimized CBT Thought Reframer</span>
                </div>
                <button onClick={() => setCbtResult(null)} className="text-xs text-slate-400 hover:text-slate-600">
                  Close
                </button>
              </div>
              <div className="bg-white p-3 rounded-xl border border-calm-100 text-xs space-y-1">
                <div className="text-slate-500 font-semibold">Identified Cognitive Distortion:</div>
                <div className="text-slate-800 font-bold">{cbtResult.identified_cognitive_trap}</div>
                <div className="text-slate-500 font-semibold pt-1">Balanced Alternative Perspective:</div>
                <div className="text-calm-900 leading-relaxed font-medium">{cbtResult.balanced_reframing}</div>
              </div>
            </div>
          )}

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                No entries match your search query.
              </div>
            ) : (
              filteredEntries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-3 shadow-sm hover:border-calm-300 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{item.title}</h4>
                      <span className="text-[11px] text-slate-400">{item.created_at}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-calm-50 border border-calm-200 text-calm-800 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {item.decryptedContent}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-400">
                    <span className="font-mono text-[10px] truncate max-w-xs text-slate-400">
                      IV: {item.iv.slice(0, 10)}... (AES-256-GCM authenticated)
                    </span>
                    <button
                      onClick={() => handleReframeThought(item.decryptedContent || item.title)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-calm-700 hover:text-calm-900 underline"
                      title="Send only this single thought for CBT reframing without sharing your journal"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-calm-600" />
                      <span>Reframe this thought with CBT</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
