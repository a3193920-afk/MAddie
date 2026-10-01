import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const AISettingsModal: React.FC<Props> = ({ isOpen, onClose, onConfigChanged }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [currentConfig, setCurrentConfig] = useState<{
    is_configured: boolean;
    model: string;
    masked_key: string;
    engine: string;
  }>({
    is_configured: false,
    model: 'gemini-3.8-flash',
    masked_key: '',
    engine: 'Checking...'
  });

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const cfg = await apiService.getAIConfig();
      setCurrentConfig(cfg);
      if (cfg.is_configured) {
        setStatusMsg({
          type: 'success',
          text: `Connected to Google Gemini (${cfg.model}). Live conversational AI is fully active.`
        });
      } else {
        setStatusMsg({
          type: 'info',
          text: 'Using local offline empathetic peer engine. Enter your Gemini API key below to unlock live AI.'
        });
      }
    } catch {
      setStatusMsg({
        type: 'error',
        text: 'Could not connect to backend server. Make sure FastAPI server is running on port 8000.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid Gemini API key.' });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await apiService.setAIConfig(apiKey.trim());
      if (res.status === 'success' || res.is_configured) {
        setStatusMsg({
          type: 'success',
          text: '✓ Gemini API Key successfully verified and connected! Live Gemini 3.8 Flash is active.'
        });
        setApiKey('');
        await loadConfig();
        if (onConfigChanged) onConfigChanged();
      } else {
        setStatusMsg({
          type: 'error',
          text: res.message || 'Key was received but verification failed. Check that your Gemini API key is valid.'
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to update Gemini API key.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-calm-100 flex items-center justify-center text-calm-700 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">AI Bot & API Integration</h2>
              <p className="text-xs text-slate-500">Google Gemini 3.8 Flash & Safety Guardrail Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-5">
          {/* Active Engine Status Badge */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            currentConfig.is_configured
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            {currentConfig.is_configured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Cpu className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">Current Engine:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  currentConfig.is_configured
                    ? 'bg-emerald-200/70 text-emerald-800'
                    : 'bg-amber-200/70 text-amber-800'
                }`}>
                  {currentConfig.is_configured ? 'Live Gemini 3.8 Flash API' : 'Local Offline Intelligence Engine'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentConfig.is_configured
                  ? `Google Gemini is actively generating dynamic, culturally nuanced empathetic replies with multi-turn memory.`
                  : `Currently running on the local 20+ campus scenario intelligence tree. Provide a Gemini API key below to activate live LLM generation.`}
              </p>
              {currentConfig.masked_key && (
                <p className="text-[11px] font-mono text-slate-500">Active Key: {currentConfig.masked_key}</p>
              )}
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMsg && (
            <div className={`text-xs p-3 rounded-xl border flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : statusMsg.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : statusMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Form to enter or update API key */}
          <form onSubmit={handleSaveKey} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={currentConfig.is_configured ? "Paste new key to replace existing..." : "AIzaSy..."}
                  className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-calm-500/20 focus:border-calm-600 transition font-mono"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded bg-slate-100 cursor-pointer"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-calm-700 hover:text-calm-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Get a free Gemini API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadConfig}
                  disabled={isLoading}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !apiKey.trim()}
                  className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 ${
                    apiKey.trim()
                      ? 'bg-calm-700 hover:bg-calm-800 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Verifying...' : 'Connect Gemini API'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Architecture Guardrail Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Responsible AI Architecture & Safety Guarantee</span>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Deterministic Crisis Interception:</strong> All messages pass through local regex & sentiment safety filters <em>before</em> touching the Gemini API. Crisis triggers execute a 100% hard stop without LLM latency.
              </li>
              <li>
                <strong>Multi-Turn Context:</strong> Up to 6 conversational turns are maintained so Maddy remembers roommate names, exam schedules, and emotional states throughout your session.
              </li>
              <li>
                <strong>Complete Privacy:</strong> Your AES-GCM encrypted journal vault is stored strictly in your browser and is <em>never</em> sent to Gemini or any third-party server.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
