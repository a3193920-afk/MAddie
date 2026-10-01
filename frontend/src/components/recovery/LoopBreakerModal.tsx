import React, { useState } from 'react';
import { X, RefreshCw, ArrowDown, Sparkles, CheckCircle2, ChevronRight, Brain, Target, Users, Wind, Compass } from 'lucide-react';
import { apiService } from '../../lib/api';
import { webAudioService } from '../../lib/webAudio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartAction?: (actionPrompt: string) => void;
}

export const LoopBreakerModal: React.FC<Props> = ({ isOpen, onClose, onStartAction }) => {
  const [step, setStep] = useState<number>(1);
  const [eventText, setEventText] = useState('');
  const [thoughtText, setThoughtText] = useState('');
  const [emotionText, setEmotionText] = useState('');
  const [actionText, setActionText] = useState('');
  const [outcomeText, setOutcomeText] = useState('');
  const [interventions, setInterventions] = useState<any[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<any | null>(null);

  if (!isOpen) return null;

  const samplePresets = [
    {
      label: 'Exam Overwhelm Loop',
      event: 'Received low score in mid-term quiz',
      thought: 'Everyone else gets it except me. I am going to fail the end-sem.',
      emotion: 'Sinking shame, exhaustion, dread',
      action: 'Closed books, avoided reviewing quiz, stayed in bed',
      outcome: 'Missed two lectures and felt even more behind'
    },
    {
      label: 'Placement Rejection Loop',
      event: 'Did not clear Round 1 coding assessment',
      thought: 'My 4 years here were wasted. I will never get placed.',
      emotion: 'Panic, peer comparison, embarrassment',
      action: 'Obsessively checked LinkedIn placements and deleted resume file',
      outcome: 'Lost sleep, felt alienated from batchmates'
    },
    {
      label: 'Hostel Loneliness Loop',
      event: 'Roommates went out without asking me',
      thought: 'Nobody here actually likes me. I do not belong.',
      emotion: 'Deep loneliness, sadness, isolation',
      action: 'Stayed in dark hostel room with phone screen on',
      outcome: 'Did not eat dinner, felt increasingly disconnected'
    }
  ];

  const handleApplyPreset = (p: typeof samplePresets[0]) => {
    setEventText(p.event);
    setThoughtText(p.thought);
    setEmotionText(p.emotion);
    setActionText(p.action);
    setOutcomeText(p.outcome);
  };

  const handleAnalyzeLoop = async () => {
    webAudioService.playHarmonicChord(1);
    const data = await apiService.evaluateLoopBreaker({
      event: eventText || 'Difficult academic or life event',
      thought: thoughtText || 'Negative automatic self-talk',
      emotion: emotionText || 'Stress and emotional ache',
      action: actionText || 'Avoidance or withdrawal',
      next_outcome: outcomeText || 'Reinforced fatigue'
    });
    setInterventions(data.interventions || []);
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedIntervention(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-calm-100 flex items-center justify-center text-calm-800 shadow-xs">
              <RefreshCw className="w-5 h-5 text-calm-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Break the Loop</h2>
              <p className="text-xs text-slate-500">Map your recurring emotional cycle & choose where to interrupt it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Mapping the Cycle */}
        {step === 1 && (
          <div className="py-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700">Quick student scenarios:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {samplePresets.map((pr, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(pr)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-calm-100 hover:text-calm-800 text-slate-600 transition font-medium cursor-pointer"
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. What happened? (The Event)
                </label>
                <input
                  type="text"
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  placeholder="e.g. Failed quiz, missed deadline, roommate tension..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-calm-500/20 focus:border-calm-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. What did my mind tell me? (The Thought)
                </label>
                <input
                  type="text"
                  value={thoughtText}
                  onChange={(e) => setThoughtText(e.target.value)}
                  placeholder="e.g. 'I'm stupid', 'Everyone is ahead of me', 'Nobody cares'..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-calm-500/20 focus:border-calm-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. What did I feel inside? (The Emotion & Physical Sensation)
                </label>
                <input
                  type="text"
                  value={emotionText}
                  onChange={(e) => setEmotionText(e.target.value)}
                  placeholder="e.g. Sinking gut, shame, chest tightness, numbness..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-calm-500/20 focus:border-calm-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. What was my reaction? (The Action / Coping)
                </label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="e.g. Avoided looking at syllabus, doomscrolled reels, went to sleep..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-calm-500/20 focus:border-calm-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. What happened next? (The Next Consequence)
                </label>
                <input
                  type="text"
                  value={outcomeText}
                  onChange={(e) => setOutcomeText(e.target.value)}
                  placeholder="e.g. Fell behind, felt guilt, cycle started over again..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-calm-500/20 focus:border-calm-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleAnalyzeLoop}
                className="px-5 py-2.5 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Find Interruption Levers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Interruption Levers */}
        {step === 2 && (
          <div className="py-5 space-y-5 animate-fade-in">
            {/* Visual representation of the cycle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Your Current Loop:</span>
              <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                <span className="bg-white px-2 py-0.5 rounded border">{eventText || 'Trigger'}</span>
                <span className="text-slate-300">→</span>
                <span className="bg-white px-2 py-0.5 rounded border font-semibold text-rose-700">"{thoughtText || 'Thought'}"</span>
                <span className="text-slate-300">→</span>
                <span className="bg-white px-2 py-0.5 rounded border text-amber-700">{emotionText || 'Emotion'}</span>
                <span className="text-slate-300">→</span>
                <span className="bg-white px-2 py-0.5 rounded border">{actionText || 'Avoidance'}</span>
                <span className="text-slate-300">→</span>
                <span className="bg-white px-2 py-0.5 rounded border">{outcomeText || 'Guilt Loop'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">
                Where would you like to try something different?
              </h4>
              <p className="text-xs text-slate-500">
                You don't have to fix the whole situation. Interrupting just one single link shifts the entire trajectory.
              </p>
            </div>

            {/* Interruption choices */}
            <div className="space-y-2.5">
              {interventions.map((inv, idx) => {
                const isPicked = selectedIntervention?.lever === inv.lever;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIntervention(inv);
                      webAudioService.playHarmonicChord(idx);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      isPicked
                        ? 'bg-calm-50 border-calm-500 ring-2 ring-calm-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{inv.icon}</span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-calm-700">{inv.lever}</span>
                        {isPicked && <CheckCircle2 className="w-4 h-4 text-calm-600" />}
                      </div>
                      <div className="font-bold text-sm text-slate-800">{inv.title}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{inv.suggestion}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
              >
                ← Edit My Loop
              </button>

              <button
                onClick={() => {
                  if (onStartAction && selectedIntervention) {
                    onStartAction(selectedIntervention.suggestion);
                  }
                  onClose();
                }}
                disabled={!selectedIntervention}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 ${
                  selectedIntervention
                    ? 'bg-calm-700 hover:bg-calm-800 text-white cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply This Interruption</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
