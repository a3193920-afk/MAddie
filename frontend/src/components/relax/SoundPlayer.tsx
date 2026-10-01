import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Trees, 
  Radio, 
  Play, 
  Pause, 
  Bell, 
  Flame, 
  Zap, 
  CloudLightning,
  Sparkles,
  Sliders
} from 'lucide-react';
import { webAudioService, SoundscapeType } from '../../lib/webAudio';

export const SoundPlayer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<SoundscapeType | null>(webAudioService.getTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(webAudioService.getIsPlaying());
  const [volume, setVolume] = useState<number>(webAudioService.getVolume());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tracks: Array<{
    id: SoundscapeType;
    label: string;
    icon: React.FC<{ className?: string }>;
    desc: string;
    category: 'focus' | 'sleep' | 'relax' | 'nature';
    benefit: string;
  }> = [
    {
      id: 'rain',
      label: 'Monsoon Rain',
      icon: CloudRain,
      desc: 'Steady soothing rain patter on foliage',
      category: 'nature',
      benefit: 'Aids sleep & reduces tension',
    },
    {
      id: 'waves',
      label: 'Ocean Tide',
      icon: Waves,
      desc: 'Rhythmic 8-second wave breath swells',
      category: 'relax',
      benefit: 'Synchronizes slow breathing',
    },
    {
      id: 'forest',
      label: 'Forest Canopy',
      icon: Trees,
      desc: 'Gentle rustling leaves and birdsong',
      category: 'nature',
      benefit: 'Grounds racing thoughts',
    },
    {
      id: 'pink_noise',
      label: 'Lo-Fi Pink Noise',
      icon: Radio,
      desc: 'Balanced acoustic masking for hostels',
      category: 'focus',
      benefit: 'Blocks noisy roommates',
    },
    {
      id: 'zen_bowl',
      label: '432Hz Zen Bowl',
      icon: Bell,
      desc: 'Meditative drone with singing bowl harmonics',
      category: 'relax',
      benefit: 'Deep parasympathetic calm',
    },
    {
      id: 'campfire',
      label: 'Campfire Crackle',
      icon: Flame,
      desc: 'Warm crackling embers and night air',
      category: 'sleep',
      benefit: 'Cozy comforting atmosphere',
    },
    {
      id: 'alpha_waves',
      label: '10Hz Alpha Waves',
      icon: Zap,
      desc: 'Binaural study focus frequency (use headphones)',
      category: 'focus',
      benefit: 'Sharpens exam revision',
    },
    {
      id: 'thunder_rain',
      label: 'Midnight Thunder',
      icon: CloudLightning,
      desc: 'Soft distant rumbles and heavy downpour',
      category: 'sleep',
      benefit: 'Deep sleep transition',
    },
  ];

  const handleSelectTrack = (trackId: SoundscapeType) => {
    if (activeTrack === trackId && isPlaying) {
      webAudioService.stopSoundscape();
      setIsPlaying(false);
      setActiveTrack(null);
    } else {
      webAudioService.playSoundscape(trackId);
      setIsPlaying(true);
      setActiveTrack(trackId);
    }
  };

  const handleStopAll = () => {
    webAudioService.stopSoundscape();
    setIsPlaying(false);
    setActiveTrack(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    webAudioService.setVolume(val);
  };

  const filteredTracks = selectedCategory === 'all' 
    ? tracks 
    : tracks.filter(t => t.category === selectedCategory);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-sm">
      {/* Header with Visualizer and Global Mute */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-calm-700 bg-calm-50 border border-calm-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-calm-600" />
              8 Web Audio Soundscapes
            </span>
            {isPlaying && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-pulse">
                Playing Live
              </span>
            )}
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1">
            Calming Synthesized Ambient Soundscapes
          </h3>
          <p className="text-xs text-slate-500">
            Synthesized directly in your browser with zero bandwidth, no external audio downloads, and zero buffering.
          </p>
        </div>

        {/* Live Audio Visualizer Animation */}
        <div className="flex items-center gap-4 shrink-0">
          {isPlaying && (
            <div className="flex items-end gap-1 h-6 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite] h-3"></span>
              <span className="w-1 bg-emerald-600 rounded-full animate-[bounce_0.6s_infinite] h-5"></span>
              <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_0.9s_infinite] h-4"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.7s_infinite] h-6"></span>
              <span className="w-1 bg-emerald-600 rounded-full animate-[bounce_1.0s_infinite] h-3"></span>
            </div>
          )}

          {isPlaying && (
            <button
              onClick={handleStopAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-2xs"
            >
              <VolumeX className="w-4 h-4" />
              <span>Stop Audio</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Volume Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'focus', 'relax', 'sleep', 'nature'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition capitalize border ${
                selectedCategory === cat
                  ? 'bg-calm-700 text-white border-calm-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Soundscapes' : cat}
            </button>
          ))}
        </div>

        {/* Master Volume Slider */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl shrink-0">
          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-calm-600"
            title="Volume"
          />
          <span className="text-[10px] font-bold text-slate-500 w-7 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* 8 Soundscape Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredTracks.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTrack === t.id && isPlaying;
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTrack(t.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition transform hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-calm-50 border-calm-500 shadow-sm text-calm-950 ring-2 ring-calm-500/20'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-calm-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  isSelected ? 'bg-calm-600 text-white animate-pulse' : 'bg-slate-200/70 text-slate-500'
                }`}>
                  {isSelected ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t.label}</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{t.desc}</div>
                <span className="inline-block mt-2 text-[10px] font-semibold text-calm-800 bg-white border border-calm-200/60 px-2 py-0.5 rounded-md">
                  {t.benefit}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
