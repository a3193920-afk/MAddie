import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Play, HelpCircle, Volume2 } from 'lucide-react';
import { webAudioService } from '../../lib/webAudio';
import { GameGuideModal } from './GameGuideModal';

interface Props {
  onComplete: () => void;
}

export const PatternFlowGame: React.FC<Props> = ({ onComplete }) => {
  const [showGuide, setShowGuide] = useState(true);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeStone, setActiveStone] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [level, setLevel] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('Listen and watch the sequence...');
  const [isCompleted, setIsCompleted] = useState(false);
  const maxLevels = 5;

  const stones = [
    {
      id: 0,
      label: 'Sage',
      note: 'C4',
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      active: 'bg-emerald-400 border-emerald-500 text-white scale-105 shadow-lg shadow-emerald-400/40 ring-4 ring-emerald-200',
    },
    {
      id: 1,
      label: 'Teal',
      note: 'E4',
      bg: 'bg-teal-50 border-teal-300 text-teal-900',
      active: 'bg-teal-400 border-teal-500 text-white scale-105 shadow-lg shadow-teal-400/40 ring-4 ring-teal-200',
    },
    {
      id: 2,
      label: 'Amber',
      note: 'G4',
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      active: 'bg-amber-400 border-amber-500 text-white scale-105 shadow-lg shadow-amber-400/40 ring-4 ring-amber-200',
    },
    {
      id: 3,
      label: 'Lilac',
      note: 'B4',
      bg: 'bg-indigo-50 border-indigo-300 text-indigo-900',
      active: 'bg-indigo-400 border-indigo-500 text-white scale-105 shadow-lg shadow-indigo-400/40 ring-4 ring-indigo-200',
    },
  ];

  // Duration timer
  useEffect(() => {
    if (showGuide || isCompleted || sequence.length === 0) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [showGuide, isCompleted, sequence]);

  const startNextRound = (currentLevel: number) => {
    setIsPlayingSequence(true);
    setPlayerIndex(0);
    setFeedbackMsg(`Playing sequence for Tier ${currentLevel}...`);

    // Generate random sequence of length currentLevel + 2
    const seqLength = currentLevel + 2;
    const newSeq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);

    // Playback sequence with harmonic chords and visual glow
    newSeq.forEach((stoneId, idx) => {
      setTimeout(() => {
        webAudioService.playHarmonicChord(stoneId);
        setActiveStone(stoneId);
        setTimeout(() => setActiveStone(null), 450);

        if (idx === newSeq.length - 1) {
          setTimeout(() => {
            setIsPlayingSequence(false);
            setFeedbackMsg('Your turn: repeat the harmonic flow');
          }, 600);
        }
      }, (idx + 1) * 750);
    });
  };

  const handleStartGame = () => {
    setLevel(1);
    setSeconds(0);
    setIsCompleted(false);
    startNextRound(1);
  };

  const handleStoneClick = (stoneId: number) => {
    if (showGuide || isPlayingSequence || isCompleted || sequence.length === 0) return;

    // Play specific harmonic note for this stone
    webAudioService.playHarmonicChord(stoneId);
    setActiveStone(stoneId);
    setTimeout(() => setActiveStone(null), 250);

    if (stoneId === sequence[playerIndex]) {
      const nextIdx = playerIndex + 1;
      setPlayerIndex(nextIdx);

      if (nextIdx === sequence.length) {
        // Round completed successfully!
        if (level >= maxLevels) {
          setIsCompleted(true);
          setFeedbackMsg('All harmonic tiers complete! Beautiful focus.');
          setTimeout(() => onComplete(), 1600);
        } else {
          setFeedbackMsg(`Tier ${level} resonant! Advancing...`);
          setLevel((l) => l + 1);
          setTimeout(() => startNextRound(level + 1), 1000);
        }
      }
    } else {
      // Gentle mismatch, repeat same level with encouraging prompt
      setFeedbackMsg('Gentle breath. Let’s hear that sequence one more time...');
      setTimeout(() => {
        setIsPlayingSequence(true);
        setPlayerIndex(0);
        sequence.forEach((sId, idx) => {
          setTimeout(() => {
            webAudioService.playHarmonicChord(sId);
            setActiveStone(sId);
            setTimeout(() => setActiveStone(null), 450);

            if (idx === sequence.length - 1) {
              setTimeout(() => {
                setIsPlayingSequence(false);
                setFeedbackMsg('Now give it another calm try:');
              }, 600);
            }
          }, (idx + 1) * 750);
        });
      }, 700);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden select-none min-h-[460px]">
      {/* Pre-Game Guide Modal */}
      <GameGuideModal
        isOpen={showGuide}
        onStart={() => setShowGuide(false)}
        title="Pattern Flow: Harmonic Attention Anchoring"
        subtitle="Soothing chord sequences that slow down cognitive racing"
        icon="🎵"
        neurosciencePurpose="Following multi-sensory melodic patterns (warm musical intervals + soft illumination) activates bilateral auditory-motor coupling, guiding your brain out of high-beta stress into grounded alpha states."
        steps={[
          "Listen and watch as the stones glow and sound their harmonic tones (C-E-G-B).",
          "Repeat the pattern by tapping the stones in the same sequence.",
          "If you miss a note, don't worry! There is zero penalty; the pattern simply replays gently."
        ]}
        recommendedDuration="2 - 3 minutes"
      />

      {/* Top Header & Stats */}
      <div className="w-full flex items-center justify-between z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Game 3: Pattern Flow
          </span>
          <button
            onClick={() => setShowGuide(true)}
            className="p-1 text-slate-400 hover:text-calm-700 rounded-full hover:bg-slate-100 transition"
            title="View Mindful Purpose & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">
            Time: {seconds}s
          </div>
          <div className="bg-calm-50 border border-calm-200 text-calm-800 px-3 py-1 rounded-full">
            Tier: {level} / {maxLevels}
          </div>
          <button
            onClick={handleStartGame}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            title="Restart Flow"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {sequence.length === 0 && !isCompleted ? (
        <div className="py-12 flex flex-col items-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-full bg-calm-100 text-calm-700 flex items-center justify-center text-3xl shadow-inner">
            🔔
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-base font-bold text-slate-800">Ready to center your rhythm?</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              4 resonant chords synthesize in harmony. Watch the light, listen to the chord, and repeat.
            </p>
          </div>
          <button
            onClick={handleStartGame}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-sm shadow-md shadow-calm-700/20 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Flow</span>
          </button>
        </div>
      ) : (
        /* Stone Grid */
        <div className="w-full flex flex-col items-center space-y-4 py-2">
          {/* Progress sequence dots */}
          <div className="flex items-center gap-2">
            {sequence.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx < playerIndex
                    ? 'bg-calm-600 scale-110'
                    : idx === playerIndex && !isPlayingSequence
                    ? 'bg-calm-300 ring-2 ring-calm-400'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {stones.map((st) => {
              const isActive = activeStone === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleStoneClick(st.id)}
                  disabled={isPlayingSequence}
                  className={`h-24 sm:h-28 rounded-3xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center shadow-xs relative overflow-hidden ${
                    isActive ? st.active : st.bg
                  } ${
                    isPlayingSequence
                      ? 'cursor-not-allowed opacity-90'
                      : 'hover:scale-102 cursor-pointer active:scale-95'
                  }`}
                >
                  <span className="text-sm font-semibold">{st.label}</span>
                  <span className="text-[11px] opacity-75 font-mono mt-0.5">{st.note}</span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-3xl bg-white/20 animate-ping pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Status notification */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-4 py-1.5 rounded-full shadow-2xs">
            <Volume2 className="w-3.5 h-3.5 text-calm-700 animate-pulse" />
            <span>{feedbackMsg}</span>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl w-full text-center space-y-1 animate-fade-in shadow-xs">
          <Trophy className="w-7 h-7 text-emerald-600 mx-auto animate-bounce" />
          <h4 className="text-sm font-bold text-slate-800">Harmonic Flow Complete</h4>
          <p className="text-xs text-slate-600">
            Navigated all 5 rhythmic tiers in {seconds} seconds. Mind settled into peaceful rhythm.
          </p>
        </div>
      )}

      {/* Grounding Footer */}
      <div className="text-[11px] text-slate-400 text-center">
        Zero point penalties. Flow at your natural cadence to reset cognitive fatigue.
      </div>
    </div>
  );
};
