import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Moon, Sun, Wind, Play, Pause, Coffee, CloudRain, Trees } from 'lucide-react';
import { webAudioService } from '../../lib/webAudio';

interface VideoLoop {
  id: string;
  title: string;
  category: string;
  description: string;
  soundscapeKey: string;
  palette: {
    bg: string;
    ambient: string;
    accent: string;
    text: string;
  };
  duration: string;
  renderType: 'rain' | 'banyan' | 'clouds' | 'chai' | 'fireflies';
}

export const LowStimVideosView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('rainy-hostel');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const videoLoops: VideoLoop[] = [
    {
      id: 'rainy-hostel',
      title: 'Cozy Rainy Hostel Window',
      category: 'Lo-Fi Rain & Warm Glow',
      description: 'Gentle raindrops tracing down a warm hostel window while soft amber lamplight glows inside. No harsh flashes, just rhythmic comfort.',
      soundscapeKey: 'rain',
      palette: { bg: '#1E293B', ambient: '#334155', accent: '#FDE047', text: '#E2E8F0' },
      duration: 'Infinite Relax Loop',
      renderType: 'rain',
    },
    {
      id: 'banyan-river',
      title: 'Ancient Banyan & Floating River',
      category: 'Pastel Nature Sway',
      description: 'Hypnotic, slow-motion swaying of leafy banyan branches over a calm river where pastel leaves drift effortlessly downstream.',
      soundscapeKey: 'forest',
      palette: { bg: '#0F2C24', ambient: '#1E4E42', accent: '#6EE7B7', text: '#ECFDF5' },
      duration: 'Infinite Relax Loop',
      renderType: 'banyan',
    },
    {
      id: 'cloud-shepherd',
      title: 'The Cloud Shepherd & Soft Hills',
      category: 'Pastel Cartoon Rest',
      description: 'Low-contrast pastel watercolor animation of fluffy sheep resting peacefully on rolling green hills beneath slow-moving clouds.',
      soundscapeKey: 'waves',
      palette: { bg: '#E0F2FE', ambient: '#BAE6FD', accent: '#38BDF8', text: '#0369A1' },
      duration: 'Infinite Relax Loop',
      renderType: 'clouds',
    },
    {
      id: 'steaming-chai',
      title: 'Warm Clay Cup of Steaming Chai',
      category: 'Claymation Comfort',
      description: 'A cozy terracotta kullhad of hot cardamom tea with gentle, rhythmic wisps of steam curling into the quiet evening air.',
      soundscapeKey: 'campfire',
      palette: { bg: '#291811', ambient: '#4A2B1D', accent: '#FB923C', text: '#FED7AA' },
      duration: 'Infinite Relax Loop',
      renderType: 'chai',
    },
    {
      id: 'midnight-fireflies',
      title: 'Midnight Fireflies in Bamboo Woods',
      category: 'Deep Sleep Dark Mode',
      description: 'A deeply soothing nighttime scene of soft, pulsating amber fireflies floating through dark bamboo stalks. Zero eye strain.',
      soundscapeKey: 'binaural',
      palette: { bg: '#090D16', ambient: '#111827', accent: '#FACC15', text: '#CBD5E1' },
      duration: 'Infinite Relax Loop',
      renderType: 'fireflies',
    },
  ];

  const activeLoop = videoLoops.find((v) => v.id === selectedId) || videoLoops[0];

  // Soundscape synchronization
  useEffect(() => {
    if (isPlayingAudio) {
      webAudioService.playSoundscape(activeLoop.soundscapeKey as any);
    } else {
      webAudioService.stopSoundscape();
    }
    return () => {
      webAudioService.stopSoundscape();
    };
  }, [selectedId, isPlayingAudio]);

  // Breathing pacer cycle (4s in, 4s hold, 4s out)
  useEffect(() => {
    const cycle = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  // HTML5 Procedural Cartoon Canvas Renderer (Smooth 60fps, zero flicker)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Responsive sizing
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 450;

    const render = () => {
      t += 0.015;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (activeLoop.renderType === 'rain') {
        // Rainy window gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1E293B');
        grad.addColorStop(1, '#0F172A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Warm cozy interior window sill light
        ctx.fillStyle = 'rgba(253, 224, 71, 0.12)';
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.4, 180 + Math.sin(t * 1.5) * 10, 0, Math.PI * 2);
        ctx.fill();

        // Soft raindrops tracing down
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 40; i++) {
          const x = (i * 27 + Math.sin(i) * 50) % w;
          const y = ((t * 120 + i * 45) % (h + 80)) - 40;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 2, y + 18);
          ctx.stroke();

          // Droplet ring on impact
          if (y > h - 30) {
            ctx.strokeStyle = 'rgba(203, 213, 225, 0.2)';
            ctx.beginPath();
            ctx.ellipse(x, h - 15, 6, 2, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      } else if (activeLoop.renderType === 'banyan') {
        // Nature river green
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#042F2E');
        grad.addColorStop(0.6, '#0D9488');
        grad.addColorStop(1, '#115E59');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Calm water ripples
        ctx.fillStyle = 'rgba(204, 251, 241, 0.15)';
        for (let r = 0; r < 5; r++) {
          ctx.beginPath();
          const yWave = h * 0.55 + r * 30 + Math.sin(t + r) * 6;
          ctx.ellipse(w * 0.5, yWave, w * 0.45, 8, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swaying leaves
        ctx.fillStyle = '#6EE7B7';
        for (let j = 0; j < 6; j++) {
          const lx = (j * 150 + t * 30) % (w + 60) - 30;
          const ly = h * 0.65 + Math.sin(t * 2 + j) * 12;
          ctx.beginPath();
          ctx.ellipse(lx, ly, 14, 6, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeLoop.renderType === 'clouds') {
        // Pastel sky
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#BAE6FD');
        grad.addColorStop(1, '#F0FDF4');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Soft green rolling hills
        ctx.fillStyle = '#86EFAC';
        ctx.beginPath();
        ctx.arc(w * 0.3, h * 1.3, h * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4ADE80';
        ctx.beginPath();
        ctx.arc(w * 0.75, h * 1.35, h * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Slow drifting cartoon clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let c = 0; c < 3; c++) {
          const cx = (c * 280 + t * 15) % (w + 160) - 80;
          const cy = 60 + c * 35 + Math.sin(t + c) * 4;
          ctx.beginPath();
          ctx.arc(cx, cy, 32, 0, Math.PI * 2);
          ctx.arc(cx + 25, cy - 10, 26, 0, Math.PI * 2);
          ctx.arc(cx + 50, cy, 28, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeLoop.renderType === 'chai') {
        // Dark warm amber room
        ctx.fillStyle = '#1C120C';
        ctx.fillRect(0, 0, w, h);

        // Wooden table surface
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(0, h * 0.7, w, h * 0.3);

        // Clay cup (Kullhad)
        const mx = w * 0.5;
        const my = h * 0.65;
        ctx.fillStyle = '#C27D53';
        ctx.beginPath();
        ctx.moveTo(mx - 40, my - 60);
        ctx.lineTo(mx + 40, my - 60);
        ctx.lineTo(mx + 28, my + 40);
        ctx.lineTo(mx - 28, my + 40);
        ctx.closePath();
        ctx.fill();

        // Warm Chai inside
        ctx.fillStyle = '#8D4925';
        ctx.beginPath();
        ctx.ellipse(mx, my - 60, 40, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Curling wisps of steam
        ctx.strokeStyle = 'rgba(254, 215, 170, 0.35)';
        ctx.lineWidth = 3;
        for (let s = 0; s < 3; s++) {
          const sx = mx - 15 + s * 15;
          ctx.beginPath();
          ctx.moveTo(sx, my - 70);
          ctx.bezierCurveTo(
            sx + Math.sin(t * 3 + s) * 20, my - 120,
            sx - Math.cos(t * 2 + s) * 20, my - 160,
            sx + Math.sin(t * 2.5 + s) * 15, my - 210
          );
          ctx.stroke();
        }
      } else if (activeLoop.renderType === 'fireflies') {
        // Deep night black/indigo
        ctx.fillStyle = '#070A10';
        ctx.fillRect(0, 0, w, h);

        // Soft bamboo silhouettes
        ctx.fillStyle = '#0F172A';
        for (let b = 0; b < 6; b++) {
          const bx = b * (w / 5) + 30;
          ctx.fillRect(bx, 0, 12, h);
        }

        // Floating pulsating fireflies
        for (let f = 0; f < 18; f++) {
          const fx = (f * 65 + Math.sin(t * 1.5 + f) * 45) % w;
          const fy = (f * 40 + Math.cos(t * 1.2 + f) * 35) % h;
          const pulse = (Math.sin(t * 4 + f) + 1) / 2;

          // Glow ring
          ctx.fillStyle = `rgba(250, 204, 21, ${0.1 + pulse * 0.25})`;
          ctx.beginPath();
          ctx.arc(fx, fy, 14 * pulse + 4, 0, Math.PI * 2);
          ctx.fill();

          // Bright center
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeLoop]);

  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4 flex flex-col justify-center' : ''}`}>
      {/* Header Info */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-calm-700">
                Low-Stimulation Rest Room
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Calming Cartoon & Sensory Video Distraction
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Slow-paced, low-contrast visual loops created for sensory rest. Zero jump cuts, zero bright flashes, and zero algorithmic noise.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-xs transition ${
                isPlayingAudio
                  ? 'bg-calm-700 text-white hover:bg-calm-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Audio Synced' : 'Muted'}</span>
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Video Screen */}
      <div className={`relative rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 ${isFullscreen ? 'h-full flex flex-col' : 'aspect-video w-full'}`}>
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Breathing Guide Overlay (Subtle, non-intrusive) */}
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white">
          <Wind className={`w-4 h-4 text-calm-300 transition-transform duration-1000 ${breathingPhase === 'inhale' ? 'scale-125' : 'scale-90'}`} />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-calm-200 block">
              Parasympathetic Guide
            </span>
            <span className="text-xs font-bold capitalize">
              {breathingPhase === 'inhale' ? 'Slow Inhale (4s)' : breathingPhase === 'hold' ? 'Gently Hold (4s)' : 'Long Exhale (4s)'}
            </span>
          </div>
        </div>

        {/* Video Title in player */}
        <div className="absolute top-5 left-5 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white">
          <span className="text-xs font-bold">{activeLoop.title}</span>
          <span className="text-[10px] text-white/70 block">{activeLoop.category}</span>
        </div>

        {/* Exit Fullscreen Button */}
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-md"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Video Loop Playlist Selector */}
      {!isFullscreen && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Choose a Gentle Sensory Scene
            </h3>
            <span className="text-xs text-slate-400">Click any loop to switch scene & audio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {videoLoops.map((loop) => {
              const isSelected = loop.id === selectedId;
              return (
                <button
                  key={loop.id}
                  onClick={() => setSelectedId(loop.id)}
                  className={`p-3.5 rounded-2xl text-left border transition flex flex-col justify-between space-y-2 cursor-pointer ${
                    isSelected
                      ? 'bg-calm-50 border-2 border-calm-700 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-calm-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">
                      {loop.renderType === 'rain' ? '🌧️' : loop.renderType === 'banyan' ? '🌿' : loop.renderType === 'clouds' ? '☁️' : loop.renderType === 'chai' ? '☕' : '✨'}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold text-calm-700 bg-calm-200/80 px-2 py-0.5 rounded-full">
                        Playing
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{loop.title}</h4>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{loop.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
