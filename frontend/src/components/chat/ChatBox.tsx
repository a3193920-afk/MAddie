import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Bot, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { ChatMessage, ChatMode, SafetyVerdict, TabType } from '../../types';
import { ModeSelector } from './ModeSelector';
import { DynamicQuestionPills } from './DynamicQuestionPills';
import { CrisisAlertOverlay } from './CrisisAlertOverlay';
import { StudyActionCard } from './StudyActionCard';
import { apiService } from '../../lib/api';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string, mode: ChatMode) => void;
  activeMode: ChatMode;
  setActiveMode: (mode: ChatMode) => void;
  onNavigateTab: (tab: TabType) => void;
  currentMood?: number;
  currentStress?: number;
  primaryStressor?: string;
  isAiLoading: boolean;
  isAiConfigured?: boolean;
  onOpenAISettings?: () => void;
}

export const ChatBox: React.FC<Props> = ({
  messages,
  onSendMessage,
  activeMode,
  setActiveMode,
  onNavigateTab,
  currentMood,
  currentStress,
  primaryStressor,
  isAiLoading,
  isAiConfigured = false,
  onOpenAISettings,
}) => {
  const [inputText, setInputText] = useState('');
  const [ratedMessages, setRatedMessages] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleRateMessage = async (msgId: string, rating: string) => {
    setRatedMessages((prev) => ({ ...prev, [msgId]: rating }));
    await apiService.submitRecoveryFeedback({
      interaction_type: 'companion_reply',
      rating,
      factor_helped: rating === 'helped a lot' ? 'Empathetic conversation' : undefined
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiLoading) return;
    onSendMessage(inputText.trim(), activeMode);
    setInputText('');
  };

  const samplePrompts = [
    { text: "I've been feeling really low.", label: "Discover First" },
    { text: "Bhai placement ne maar rakhi hai, I am cooked", label: "Gen-Z Hinglish" },
    { text: "I have an exam tomorrow and four assignments due", label: "Study Overwhelm" },
    { text: "Eating alone at the hostel mess is making me homesick", label: "Hostel Loneliness" },
    { text: "I want to die right now", label: "Safety Hard-Stop Test", isRisk: true },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white md:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Chat Header & Mode Bar */}
      <div className="p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-calm-100 flex items-center justify-center text-calm-800">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Maddy Companion</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active & Listening</span>
                <span className="text-slate-300">•</span>
                <span className="text-calm-700 font-medium">Data Minimized</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAISettings}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                isAiConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title="Click to configure Gemini API or view AI Engine details"
            >
              <Sparkles className={`w-3 h-3 ${isAiConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>{isAiConfigured ? 'Gemini 3.8 Live' : 'AI: Offline Engine'}</span>
            </button>
            <ModeSelector currentMode={activeMode} onSelectMode={setActiveMode} />
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-calm-600" />
              <span>Safety Interceptor Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-500">
            <div className="w-14 h-14 rounded-3xl bg-calm-100 flex items-center justify-center text-2xl shadow-inner">
              💬
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-slate-700">What's on your mind today?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Whether you want to vent about exams, discuss hostel life, or just need someone to listen in English or Hinglish without judgment.
              </p>
            </div>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg pt-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(p.text);
                    onSendMessage(p.text, activeMode);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 ${
                    p.isRisk
                      ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-calm-50 hover:border-calm-300'
                  }`}
                >
                  <span className="font-semibold text-[10px] uppercase opacity-75">{p.label}:</span>
                  <span>"{p.text}"</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isHardStop = msg.safetyVerdict?.hard_stop;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-calm-100 flex items-center justify-center text-calm-800 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                {/* Slang Normalized Badge */}
                {msg.slangNormalized && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-calm-800 bg-calm-50 border border-calm-200 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-calm-600" />
                    <span>{msg.slangNormalized}</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-calm-700 text-white rounded-tr-sm shadow-sm'
                      : isHardStop
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-sm'
                      : 'bg-slate-100/90 text-slate-800 rounded-tl-sm border border-slate-200/60'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Study Planner Card */}
                  {msg.studyPlan && (
                    <StudyActionCard
                      plan={msg.studyPlan}
                      onStartBreathing={() => onNavigateTab('RELAX')}
                    />
                  )}

                  {/* Dynamic Question Pills */}
                  {msg.nextQuestions && msg.nextQuestions.length > 0 && (
                    <DynamicQuestionPills
                      questions={msg.nextQuestions}
                      onSelectOption={(opt) => onSendMessage(opt, activeMode)}
                    />
                  )}
                </div>

                {/* Hard Stop Crisis Overlay */}
                {isHardStop && msg.safetyVerdict && (
                  <CrisisAlertOverlay
                    verdict={msg.safetyVerdict}
                    onDismissToHelp={() => onNavigateTab('HELP')}
                  />
                )}

                {/* Did that help? Subtle Feedback Loop */}
                {!isUser && !isHardStop && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                    {ratedMessages[msg.id] ? (
                      <span className="text-calm-700 font-medium">✓ Feedback saved to your manual</span>
                    ) : (
                      <>
                        <span>Did that help?</span>
                        <button
                          onClick={() => handleRateMessage(msg.id, 'helped a lot')}
                          className="hover:text-calm-700 px-1 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          A lot
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleRateMessage(msg.id, 'helped a little')}
                          className="hover:text-calm-700 px-1 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          A little
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleRateMessage(msg.id, 'no change')}
                          className="hover:text-slate-600 px-1 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          No change
                        </button>
                      </>
                    )}
                  </div>
                )}

                <div className={`text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAiLoading && (
          <div className="flex gap-3 justify-start items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-calm-100 flex items-center justify-center text-calm-800 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-calm-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-calm-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-calm-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200/80">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-calm-500/20 focus-within:border-calm-500 transition">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message Maddy... (e.g. 'I am feeling overwhelmed with exams', or just vent freely)"
            className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none py-1.5"
            disabled={isAiLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAiLoading}
            className="p-2 rounded-xl bg-calm-700 hover:bg-calm-800 disabled:bg-slate-200 text-white disabled:text-slate-400 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
