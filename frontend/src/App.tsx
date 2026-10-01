import React, { useState, useEffect } from 'react';
import { TabType, ChatMode, ChatMessage, CheckInEntry, Persona } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { PersonaSwitcherBar } from './components/demo/PersonaSwitcherBar';
import { HomeView } from './components/home/HomeView';
import { ChatBox } from './components/chat/ChatBox';
import { RelaxHub } from './components/relax/RelaxHub';
import { TrackView } from './components/track/TrackView';
import { CampusHelpDirectory } from './components/help/CampusHelpDirectory';
import { EncryptedVault } from './components/journal/EncryptedVault';
import { PrivacyCenterModal } from './components/privacy/PrivacyCenterModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { AISettingsModal } from './components/settings/AISettingsModal';
import { LoopBreakerModal } from './components/recovery/LoopBreakerModal';
import { WhatHelpsMeModal } from './components/recovery/WhatHelpsMeModal';
import { AskForHelpModal } from './components/recovery/AskForHelpModal';
import { ProfessionalHandoffModal } from './components/recovery/ProfessionalHandoffModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { MenstrualTrackerView } from './components/cycle/MenstrualTrackerView';
import { UserProfile, MenstrualCycleData } from './types';
import { apiService } from './lib/api';
import { webAudioService } from './lib/webAudio';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [activeMode, setActiveMode] = useState<ChatMode>('Adaptive (Auto)');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  // Authenticated User & Profile State (Default to Ananya demo for instant showcase)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('maddy_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'usr_ananya',
      name: 'Ananya Sen',
      email: 'ananya@campus.edu',
      age: 20,
      gender: 'female',
      college: 'IIT Kharagpur / JU, 3rd Year',
    };
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cycleData, setCycleData] = useState<MenstrualCycleData | null>(null);

  const [checkins, setCheckins] = useState<CheckInEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [isAiConfigured, setIsAiConfigured] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [hasBaselineDeviation, setHasBaselineDeviation] = useState(true);

  // Recovery Architecture State
  const [isLoopBreakerOpen, setIsLoopBreakerOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isAskHelpOpen, setIsAskHelpOpen] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isLowStimulation, setIsLowStimulation] = useState(false);

  const refreshCycleData = async () => {
    if (currentUser?.id && currentUser?.gender === 'female') {
      try {
        const c = await apiService.getCurrentCycle(currentUser.id);
        setCycleData(c);
      } catch (e) {
        console.warn('Could not load cycle data:', e);
      }
    } else {
      setCycleData(null);
    }
  };

  useEffect(() => {
    refreshCycleData();
  }, [currentUser?.id, currentUser?.gender]);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('maddy_user', JSON.stringify(user));
  };

  const handleSignOut = () => {
    localStorage.removeItem('maddy_user');
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  const refreshAiConfig = async () => {
    try {
      const cfg = await apiService.getAIConfig();
      setIsAiConfigured(cfg.is_configured);
    } catch (e) {
      console.warn('Could not check AI config', e);
    }
  };

  // Initialize initial state & load personas
  useEffect(() => {
    (async () => {
      // Check onboarding
      const seenOnboarding = localStorage.getItem('cc_seen_onboarding');
      if (!seenOnboarding) {
        setIsOnboardingOpen(true);
      }

      // Check live AI configuration
      refreshAiConfig();

      // Load check-in history
      const history = await apiService.getCheckinHistory();
      setCheckins(history);

      // Load personas
      const pList = await apiService.getPersonas();
      setPersonas(pList);
      if (pList.length > 0) {
        setActivePersona(pList[0]); // Default to Persona A
      }
    })();
  }, []);

  // Audio Toggle
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      webAudioService.stopSoundscape();
      setIsPlayingAudio(false);
    } else {
      webAudioService.playSoundscape('rain');
      setIsPlayingAudio(true);
    }
  };

  // Persona Selection Handler
  const handleSelectPersona = async (p: Persona) => {
    setActivePersona(p);
    await apiService.selectPersona(p.id);

    if (p.id === 'persona_e') {
      setHasBaselineDeviation(true);
      setActiveTab('HOME');
    } else if (p.id === 'persona_f') {
      // Test Crisis Guardrail
      setActiveTab('CHAT');
      handleSendMessage(p.sample_chat, p.recommended_mode);
    } else if (p.sample_chat) {
      setActiveTab('CHAT');
      setActiveMode(p.recommended_mode);
      handleSendMessage(p.sample_chat, p.recommended_mode);
    }
  };

  // Send Message Handler
  const handleSendMessage = async (text: string, mode: ChatMode) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const latestCheckin = checkins[checkins.length - 1];
      // Build session history from existing chat for multi-turn memory
      const sessionHistory = chatMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));
      const res = await apiService.sendChatMessage({
        message: text,
        mode: mode,
        current_mood: latestCheckin?.mood,
        current_stress: latestCheckin?.stress,
        primary_stressor: latestCheckin?.stressors?.[0],
        session_history: sessionHistory,
        consent_ai_context: true,
        user_id: currentUser?.id,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        safetyVerdict: res.safety_verdict,
        slangNormalized: res.slang_normalized,
        nextQuestions: res.next_questions,
        studyPlan: res.study_plan,
        suggestedIntervention: res.suggested_intervention,
        contextUsed: res.context_used,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNavigateWithPrompt = (tab: TabType, prompt?: string) => {
    setActiveTab(tab);
    if (tab === 'CHAT' && prompt) {
      handleSendMessage(prompt, activeMode);
    }
  };

  const latestCheckin = checkins[checkins.length - 1] || { mood: 3, stress: 3, stressors: ['Academic'] };

  return (
    <div className={`min-h-screen bg-[#F8FAF9] flex flex-col font-sans transition-colors duration-300 ${isLowStimulation ? 'low-stimulation' : ''}`}>
      {/* Top Demo Bar for Hackathon Presentation */}
      <PersonaSwitcherBar
        personas={personas}
        activePersona={activePersona}
        onSelectPersona={handleSelectPersona}
      />

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSOS={() => setActiveTab('HELP')}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
        isVaultUnlocked={isVaultUnlocked}
        isAiConfigured={isAiConfigured}
        onOpenAISettings={() => setIsAiSettingsOpen(true)}
        isLowStimulation={isLowStimulation}
        onToggleLowStimulation={() => setIsLowStimulation(!isLowStimulation)}
        onOpenManual={() => setIsManualOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        cycleData={cycleData}
        onOpenCycleTracker={() => setActiveTab('CYCLE')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          currentUser={currentUser}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 md:pb-8">
          {activeTab === 'HOME' && (
            <HomeView
              onNavigate={handleNavigateWithPrompt}
              checkins={checkins}
              onNewCheckin={(newEntry) => setCheckins([...checkins, newEntry])}
              hasBaselineDeviation={hasBaselineDeviation}
              onOpenLoopBreaker={() => setIsLoopBreakerOpen(true)}
              onSelectMode={(mode) => setActiveMode(mode)}
            />
          )}

          {activeTab === 'CHAT' && (
            <ChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              onNavigateTab={setActiveTab}
              currentMood={latestCheckin.mood}
              currentStress={latestCheckin.stress}
              primaryStressor={latestCheckin.stressors?.[0]}
              isAiLoading={isAiLoading}
              isAiConfigured={isAiConfigured}
              onOpenAISettings={() => setIsAiSettingsOpen(true)}
            />
          )}

          {activeTab === 'RELAX' && <RelaxHub onTalkToMaddy={() => handleNavigateWithPrompt('CHAT')} />}

          {activeTab === 'TRACK' && <TrackView checkins={checkins} />}

          {activeTab === 'CYCLE' && currentUser && (
            <MenstrualTrackerView
              currentUser={currentUser}
              onNavigateChat={(prompt) => handleNavigateWithPrompt('CHAT', prompt)}
            />
          )}

          {activeTab === 'HELP' && (
            <CampusHelpDirectory
              onOpenSafetyTriage={() => {}}
              onOpenAskForHelp={() => setIsAskHelpOpen(true)}
              onOpenProfessionalHandoff={() => setIsHandoffOpen(true)}
              currentUser={currentUser}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === 'JOURNAL' && (
            <EncryptedVault
              isUnlocked={isVaultUnlocked}
              onUnlockStateChange={setIsVaultUnlocked}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
      />

      {/* Auth & User Profile Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            localStorage.setItem('maddy_user', JSON.stringify(updated));
            refreshCycleData();
          }}
          onSignOut={handleSignOut}
        />
      )}

      {/* Recovery Modals */}
      <LoopBreakerModal
        isOpen={isLoopBreakerOpen}
        onClose={() => setIsLoopBreakerOpen(false)}
        onStartAction={(actionPrompt: string) => {
          setIsLoopBreakerOpen(false);
          handleNavigateWithPrompt('CHAT', actionPrompt);
        }}
      />

      <WhatHelpsMeModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <AskForHelpModal
        isOpen={isAskHelpOpen}
        onClose={() => setIsAskHelpOpen(false)}
      />

      <ProfessionalHandoffModal
        isOpen={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
      />

      {/* AI Bot & API Integration Modal */}
      <AISettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
        onConfigChanged={refreshAiConfig}
      />

      {/* Privacy Center Modal */}
      <PrivacyCenterModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        currentContext={{
          mood: latestCheckin.mood,
          stress: latestCheckin.stress,
          primaryStressor: latestCheckin.stressors?.[0],
          mode: activeMode,
        }}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => {
          localStorage.setItem('cc_seen_onboarding', 'true');
          setIsOnboardingOpen(false);
        }}
      />
    </div>
  );
};

export default App;
