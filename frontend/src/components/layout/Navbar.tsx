import React from 'react';
import { ShieldCheck, PhoneCall, Volume2, VolumeX, Lock, Key, Sparkles, Moon, Sun, BookOpen, User } from 'lucide-react';
import { TabType, UserProfile, MenstrualCycleData } from '../../types';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenPrivacy: () => void;
  onOpenSOS: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  isVaultUnlocked: boolean;
  isAiConfigured?: boolean;
  onOpenAISettings?: () => void;
  isLowStimulation?: boolean;
  onToggleLowStimulation?: () => void;
  onOpenManual?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  cycleData?: MenstrualCycleData | null;
  onOpenCycleTracker?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenPrivacy,
  onOpenSOS,
  isPlayingAudio,
  onToggleAudio,
  isVaultUnlocked,
  isAiConfigured = false,
  onOpenAISettings,
  isLowStimulation = false,
  onToggleLowStimulation,
  onOpenManual,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  cycleData,
  onOpenCycleTracker,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
      {/* Brand */}
      <div 
        onClick={() => setActiveTab('HOME')} 
        className="flex items-center gap-2.5 cursor-pointer select-none"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-calm-700 to-calm-500 flex items-center justify-center text-white shadow-sm shadow-calm-600/20">
          <span className="text-lg">🌿</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-slate-800">Maddy</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-calm-100 text-calm-800 border border-calm-200">
              Wellness
            </span>
          </div>
          <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">Private Student Digital Companion</p>
        </div>
      </div>

      {/* Action Badges & Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ambient Audio Pill */}
        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition ${
            isPlayingAudio 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title={isPlayingAudio ? 'Monsoon Rain playing (Click to mute)' : 'Play Calming Monsoon Audio'}
        >
          {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden md:inline">{isPlayingAudio ? 'Rain Audio Playing' : 'Calm Sound'}</span>
        </button>

        {/* AI & Gemini Status Pill */}
        <button
          onClick={onOpenAISettings}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition ${
            isAiConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 cursor-pointer'
          }`}
          title="Google Gemini API Status & Configuration"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="hidden sm:inline">
            {isAiConfigured ? 'Gemini 3.8 Live' : 'AI: Offline Engine'}
          </span>
        </button>

        {/* Keep It Quiet (Low-Stimulation Mode) Toggle */}
        {onToggleLowStimulation && (
          <button
            onClick={onToggleLowStimulation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
              isLowStimulation
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-2 ring-indigo-400/20'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isLowStimulation ? 'Low-Stimulation Mode active (Click to return to normal)' : 'Enable Keep It Quiet (Low-Stimulation Mode)'}
          >
            {isLowStimulation ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden xl:inline">{isLowStimulation ? 'Quiet Mode On' : 'Keep It Quiet'}</span>
          </button>
        )}

        {/* My Manual Quick Button */}
        {onOpenManual && (
          <button
            onClick={onOpenManual}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-calm-50 text-slate-700 border border-slate-200 hover:border-calm-300 transition cursor-pointer"
            title="Open 'What Helps Me' Personal Support Manual"
          >
            <BookOpen className="w-3.5 h-3.5 text-calm-600" />
            <span className="hidden md:inline">My Manual</span>
          </button>
        )}

        {/* Privacy Shield */}
        <button
          onClick={onOpenPrivacy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-calm-50 hover:bg-calm-100 text-calm-800 border border-calm-200 transition"
          title="Inspect live context passed to AI (Data Minimization)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-calm-600" />
          <span className="hidden sm:inline">Privacy Center</span>
        </button>

        {/* Journal Encryption Status */}
        <button
          onClick={() => setActiveTab('JOURNAL')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition ${
            isVaultUnlocked
              ? 'bg-teal-50 text-teal-800 border-teal-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
          title="Encrypted Journal Vault"
        >
          {isVaultUnlocked ? <Key className="w-3.5 h-3.5 text-teal-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden lg:inline">{isVaultUnlocked ? 'Vault Unlocked' : 'Vault Locked'}</span>
        </button>

        {/* Female Cycle Phase Quick Pill */}
        {currentUser?.gender === 'female' && cycleData && cycleData.has_data && onOpenCycleTracker && (
          <button
            onClick={onOpenCycleTracker}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              cycleData.is_pms
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                : cycleData.phase_key === 'menstrual'
                ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={`Day ${cycleData.current_day}: ${cycleData.phase_name} (Click to open cycle tracker)`}
          >
            <span>🌸</span>
            <span className="hidden md:inline font-bold">
              Day {cycleData.current_day}: {cycleData.phase_name?.split(' ')[0]}
            </span>
          </button>
        )}

        {/* User Account / Profile Badge */}
        {currentUser ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-calm-50 text-slate-800 border border-slate-200 transition cursor-pointer shadow-xs"
            title="Manage profile & emergency contacts"
          >
            <span className="text-sm">
              {currentUser.gender === 'female' ? '🌸' : currentUser.gender === 'male' ? '🌿' : '✨'}
            </span>
            <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-calm-700 hover:bg-calm-800 text-white shadow-xs transition cursor-pointer"
          >
            <span>Sign In</span>
          </button>
        )}

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/30 transition"
          title="Immediate Emergency / Crisis Support (Tele-MANAS & 112)"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span>HELP / SOS</span>
        </button>
      </div>
    </header>
  );
};
