import React, { useState } from 'react';
import { Sparkles, Headphones, BookOpen, Lamp, Wind, Gamepad2, Volume2, VolumeX, Heart, MessageSquare } from 'lucide-react';
import { webAudioService, SoundscapeType } from '../../lib/webAudio';

interface Props {
  onOpenJournal?: () => void;
  onOpenGame?: () => void;
  onTalkToMaddy?: () => void;
}

export const MaddySpaceRoom: React.FC<Props> = ({
  onOpenJournal,
  onOpenGame,
  onTalkToMaddy,
}) => {
  const [isLampOn, setIsLampOn] = useState<boolean>(true);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const [activeSound, setActiveSound] = useState<SoundscapeType>('rain');
  const [environment, setEnvironment] = useState<'rainy' | 'sunset' | 'night' | 'forest'>('rainy');
  const [maddyBubbleMsg, setMaddyBubbleMsg] = useState<string>(
    "I'm right here with you. No need to explain anything or do any work right now. Just rest."
  );

  const environments = [
    { id: 'rainy', label: 'Rainy Window', icon: '🌧️', bg: 'from-slate-900 via-slate-800 to-teal-950', sound: 'rain' as SoundscapeType },
    { id: 'sunset', label: 'Campus Sunset', icon: '🌅', bg: 'from-amber-900 via-stone-800 to-calm-950', sound: 'zen_bowl' as SoundscapeType },
    { id: 'night', label: 'Cozy Bedroom', icon: '🌙', bg: 'from-indigo-950 via-slate-900 to-slate-950', sound: 'campfire' as SoundscapeType },
    { id: 'forest', label: 'Quiet Garden', icon: '🍃', bg: 'from-emerald-950 via-teal-950 to-slate-900', sound: 'forest' as SoundscapeType }
  ];

  const handleToggleSound = () => {
    if (isPlayingSound) {
      webAudioService.stopSoundscape();
      setIsPlayingSound(false);
    } else {
      webAudioService.playSoundscape(activeSound);
      setIsPlayingSound(true);
    }
  };

  const handleSwitchEnvironment = (env: typeof environments[0]) => {
    setEnvironment(env.id as any);
    setActiveSound(env.sound);
    if (isPlayingSound) {
      webAudioService.playSoundscape(env.sound);
    }
  };

  const maddyWhispers = [
    "I'm right here with you. No need to explain anything or do any work right now. Just rest.",
    "Your worth is not measured by how productive you were today. Breathe easy.",
    "Notice the sound around you. You don't have to carry tomorrow's burdens tonight.",
    "Even sitting quietly and doing nothing is a form of healing.",
    "Drop your shoulders away from your ears, unclamp your jaw. You're safe here."
  ];

  const handleMaddyClick = () => {
    webAudioService.playHarmonicChord(1);
    const nextMsg = maddyWhispers[Math.floor(Math.random() * maddyWhispers.length)];
    setMaddyBubbleMsg(nextMsg);
  };

  const currentEnv = environments.find((e) => e.id === environment) || environments[0];

  return (
    <div className="rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm space-y-4 bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-calm-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Comfort World</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Maddy Space
          </h3>
          <p className="text-xs text-slate-500">
            A quiet interactive room to just exist. Click on the objects to change the atmosphere.
          </p>
        </div>

        {/* Environment Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {environments.map((env) => (
            <button
              key={env.id}
              onClick={() => handleSwitchEnvironment(env)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                environment === env.id
                  ? 'bg-calm-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{env.icon}</span>
              <span>{env.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* The 2D Interactive Room Canvas */}
      <div
        className={`relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b ${currentEnv.bg} overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between p-6 transition-all duration-700 select-none ${
          isLampOn ? 'brightness-105' : 'brightness-75'
        }`}
      >
        {/* Soft Ambient Light Glow from Lamp */}
        {isLampOn && (
          <div className="absolute top-12 left-16 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl pointer-events-none animate-pulse" />
        )}

        {/* Weather Rain Streaks Effect if rainy */}
        {environment === 'rainy' && (
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40 animate-pulse" />
        )}

        {/* Top Floating Controls Bar inside room */}
        <div className="flex items-center justify-between z-10">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs font-medium border border-white/10 flex items-center gap-2">
            <span>{currentEnv.icon} {currentEnv.label}</span>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-teal-300">Room Active</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Lamp Toggle */}
            <button
              onClick={() => {
                setIsLampOn(!isLampOn);
                webAudioService.playHarmonicChord(0);
              }}
              className={`p-2 rounded-full border transition cursor-pointer backdrop-blur-md ${
                isLampOn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-xs shadow-amber-500/30'
                  : 'bg-black/40 text-white/60 border-white/10 hover:bg-black/60'
              }`}
              title={isLampOn ? 'Turn lamp off' : 'Turn lamp on'}
            >
              <Lamp className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-full border transition cursor-pointer backdrop-blur-md ${
                isPlayingSound
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs shadow-emerald-500/30'
                  : 'bg-black/40 text-white/60 border-white/10 hover:bg-black/60'
              }`}
              title={isPlayingSound ? 'Mute room audio' : 'Play ambient audio'}
            >
              {isPlayingSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Middle: Maddy Companion & Speech Bubble */}
        <div className="flex flex-col items-center my-auto z-10 max-w-sm mx-auto text-center space-y-3">
          {/* Comfort Speech Bubble */}
          <div className="bg-white/95 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-white/40 leading-relaxed animate-fade-in relative">
            "{maddyBubbleMsg}"
            <div className="w-3 h-3 bg-white/95 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-white/40" />
          </div>

          {/* Maddy Avatar Icon (Interactive) */}
          <button
            onClick={handleMaddyClick}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-calm-400 flex items-center justify-center text-3xl shadow-lg shadow-teal-500/30 border-2 border-white/80 cursor-pointer transform hover:scale-105 active:scale-95 transition"
            title="Click Maddy for a quiet whisper"
          >
            <span>🫂</span>
          </button>
        </div>

        {/* Bottom Interactive Objects Dock */}
        <div className="flex items-center justify-center gap-3 z-10 flex-wrap">
          {/* Headphones */}
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium border border-white/15 transition cursor-pointer"
            title="Toggle synthesized ambient soundscape"
          >
            <Headphones className="w-3.5 h-3.5 text-teal-300" />
            <span>{isPlayingSound ? 'Audio Playing' : 'Headphones'}</span>
          </button>

          {/* Journal */}
          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium border border-white/15 transition cursor-pointer"
              title="Open Encrypted Journal to write thoughts"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Write in Journal</span>
            </button>
          )}

          {/* Mini-Game Desk */}
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium border border-white/15 transition cursor-pointer"
              title="Play a mindful mini-game"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-purple-300" />
              <span>Calm Game</span>
            </button>
          )}

          {/* Talk to Maddy */}
          {onTalkToMaddy && (
            <button
              onClick={onTalkToMaddy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-calm-700/80 hover:bg-calm-700 backdrop-blur-md text-white text-xs font-semibold border border-calm-400/40 transition cursor-pointer"
              title="Open chat with Maddy"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to Maddy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
