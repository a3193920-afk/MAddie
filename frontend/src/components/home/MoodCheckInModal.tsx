import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    mood: number;
    stress: number;
    energy: number;
    sleep: string;
    stressors: string[];
    notes?: string;
  }) => void;
}

export const MoodCheckInModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState('Okay');
  const [selectedStressors, setSelectedStressors] = useState<string[]>(['Academic']);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const moodOptions = [
    { score: 5, emoji: '😄', label: 'Very good' },
    { score: 4, emoji: '🙂', label: 'Good' },
    { score: 3, emoji: '😐', label: 'Okay' },
    { score: 2, emoji: '😔', label: 'Low' },
    { score: 1, emoji: '😞', label: 'Very low' },
  ];

  const stressorOptions = [
    'Academic',
    'Exams',
    'Assignments',
    'Placement',
    'Career',
    'Relationships',
    'Hostel',
    'Homesickness',
    'Loneliness',
    'Sleep',
    'Fear of failure',
    'Confidence',
  ];

  const sleepOptions = ['Very good', 'Okay', 'Poor', 'Very poor'];

  const toggleStressor = (item: string) => {
    if (selectedStressors.includes(item)) {
      setSelectedStressors(selectedStressors.filter(s => s !== item));
    } else {
      setSelectedStressors([...selectedStressors, item]);
    }
  };

  const handleFinish = () => {
    onSubmit({
      mood,
      stress,
      energy,
      sleep,
      stressors: selectedStressors,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">30-Second Daily Check-in</h2>
            <p className="text-xs text-slate-500">Tune into your body and mind before starting the day</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Q1: Mood */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. How is your mood today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((opt) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setMood(opt.score)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 border transition ${
                    mood === opt.score
                      ? 'bg-calm-100 border-calm-400 text-calm-900 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[11px] font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Stress */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. How stressed do you feel? (1: Very Low, 5: Overwhelmed)
              </label>
              <span className="text-sm font-bold text-calm-800 bg-calm-50 px-2 py-0.5 rounded-lg border border-calm-200">
                {stress} / 5
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-calm-600"
            />
          </div>

          {/* Q3: Energy */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. How is your energy level? (1: Drained, 5: High)
              </label>
              <span className="text-sm font-bold text-calm-800 bg-calm-50 px-2 py-0.5 rounded-lg border border-calm-200">
                {energy} / 5
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-calm-600"
            />
          </div>

          {/* Q4: Sleep */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              4. How was your sleep last night?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sleepOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSleep(opt)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                    sleep === opt
                      ? 'bg-calm-100 border-calm-500 text-calm-900 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q5: Stressors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              5. What is affecting you most today? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {stressorOptions.map((item) => {
                const isSelected = selectedStressors.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleStressor(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-calm-700 text-white border-calm-700 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q6: Optional reflection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              6. What happened today? (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Mid-sem exam announcement, roommate issue, placement prep..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-calm-500/20 focus:border-calm-500 text-slate-800"
            />
          </div>

          <button
            onClick={handleFinish}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-sm shadow-md shadow-calm-700/20 transition"
          >
            <span>Save Today's Check-in</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
