import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Wind, HelpCircle } from 'lucide-react';
import { webAudioService } from '../../lib/webAudio';
import { GameGuideModal } from './GameGuideModal';

interface Props {
  onComplete: () => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
}

export const BubbleZenGame: React.FC<Props> = ({ onComplete }) => {
  const [showGuide, setShowGuide] = useState(true);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [target] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Exhale'>('Inhale');

  const bubbleColors = [
    'bg-teal-200/70 border-teal-300 shadow-teal-200/50',
    'bg-calm-200/70 border-calm-300 shadow-calm-200/50',
    'bg-emerald-200/70 border-emerald-300 shadow-emerald-200/50',
    'bg-cyan-200/70 border-cyan-300 shadow-cyan-200/50',
    'bg-indigo-200/70 border-indigo-300 shadow-indigo-200/50',
  ];

  // Breath rhythm timer: 4s inhale, 4s exhale
  useEffect(() => {
    if (showGuide || isCompleted) return;
    const bTimer = setInterval(() => {
      setBreathPhase((p) => (p === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000);
    return () => clearInterval(bTimer);
  }, [showGuide, isCompleted]);

  // Session duration timer
  useEffect(() => {
    if (showGuide || isCompleted) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [showGuide, isCompleted]);

  // Spawn bubbles
  useEffect(() => {
    if (showGuide || isCompleted) return;
    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length >= 8) return prev;
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: 92,
          size: Math.floor(Math.random() * 26) + 48,
          speed: Math.random() * 1.2 + 0.7,
          color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        };
        return [...prev, newBubble];
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [showGuide, isCompleted]);

  // Float animation & particle update
  useEffect(() => {
    if (showGuide || isCompleted) return;
    const frame = setInterval(() => {
      // Float bubbles
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -10)
      );

      // Move burst particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.05,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 40);

    return () => clearInterval(frame);
  }, [showGuide, isCompleted]);

  const popBubble = (bubble: Bubble) => {
    const sizeRatio = bubble.size / 70;
    webAudioService.playBubblePopSound(sizeRatio);

    // Create 6 burst sparkle particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const speed = Math.random() * 2 + 1.5;
      newParticles.push({
        id: Date.now() + i,
        x: bubble.x,
        y: bubble.y,
        vx: Math.cos(angle) * speed * 0.4,
        vy: Math.sin(angle) * speed * 0.4,
        color: bubble.color.split(' ')[0],
        opacity: 1,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
    setScore((s) => {
      const next = s + 1;
      if (next >= target && !isCompleted) {
        setIsCompleted(true);
        setTimeout(() => onComplete(), 1500);
      }
      return next;
    });
  };

  const handleReset = () => {
    setScore(0);
    setBubbles([]);
    setParticles([]);
    setSeconds(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden select-none min-h-[460px]">
      {/* Pre-Game Mindfulness Guide Modal */}
      <GameGuideModal
        isOpen={showGuide}
        onStart={() => setShowGuide(false)}
        title="Bubble Zen: Somatic Tension Release"
        subtitle="Rhythmic visual popping synchronized with slow exhalations"
        icon="🫧"
        neurosciencePurpose="Popping visually floating bubbles activates the orienting reflex of your brain, breaking the repetitive loop of cortisol-driven rumination while regulating your breath."
        steps={[
          "Observe the floating bubbles as they rise smoothly across your screen.",
          "Breathe in as the guide bar fills, and pop gently on your slow exhale.",
          "Notice the delicate sound and spark burst. Let each pop release one tight worry."
        ]}
        recommendedDuration="2 - 3 minutes"
      />

      {/* Top Header & Stats */}
      <div className="w-full flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Game 1: Bubble Zen
            </span>
            <button
              onClick={() => setShowGuide(true)}
              className="p-1 text-slate-400 hover:text-calm-700 rounded-full hover:bg-slate-100 transition"
              title="View Mindful Purpose & Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-base font-bold text-slate-800 mt-1">Pop bubbles with slow, conscious exhalations</h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
            {seconds}s
          </div>
          <div className="bg-calm-50 border border-calm-200 text-calm-800 px-3 py-1 rounded-xl">
            Popped: {score} / {target}
          </div>
          <button onClick={handleReset} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Synchronized Breathing Guide Bar */}
      <div className="w-full bg-slate-100 rounded-2xl p-2.5 flex items-center justify-between gap-3 border border-slate-200/80 z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-calm-800 shrink-0">
          <Wind className={`w-4 h-4 ${breathPhase === 'Inhale' ? 'text-teal-600 animate-pulse' : 'text-emerald-600'}`} />
          <span>{breathPhase}: {breathPhase === 'Inhale' ? 'Fill your lungs slowly' : 'Exhale & pop a bubble'}</span>
        </div>
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-[4000ms] ease-in-out ${
              breathPhase === 'Inhale' ? 'w-full bg-teal-500' : 'w-0 bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Bubble Canvas Field */}
      <div className="w-full h-80 rounded-2xl bg-gradient-to-b from-calm-50/40 via-teal-50/30 to-emerald-50/30 relative border border-slate-200 overflow-hidden cursor-crosshair">
        {/* Render Bubbles */}
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => popBubble(b)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
            }}
            className={`absolute rounded-full border shadow-md backdrop-blur-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-75 ${b.color}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/80 absolute top-2 left-2"></span>
          </button>
        ))}

        {/* Render Burst Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
            }}
            className="absolute w-2 h-2 rounded-full bg-teal-400 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          />
        ))}

        {isCompleted && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-2 animate-fade-in z-20">
            <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
            <h4 className="text-xl font-extrabold text-slate-800">Mindful Rhythm Reached</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Completed 15 gentle pops across {seconds} seconds. Notice how your breathing pace feels steadier now.
            </p>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        Tip: Sync popping with your slow exhalations. Zero point penalties, take all the time you need.
      </div>
    </div>
  );
};
