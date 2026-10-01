import React, { useState } from 'react';
import { X, Lock, Mail, User, Calendar, Shield, Sparkles, Heart, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<'female' | 'male' | 'non-binary' | 'prefer_not_to_say'>('female');
  const [college, setCollege] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Mother');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await apiService.login(email, password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await apiService.signup({
        name,
        email,
        password,
        age,
        gender,
        college: college || 'Campus Scholar',
        emergency_contact_name: emergencyName || undefined,
        emergency_contact_relation: emergencyRelation || undefined,
        emergency_contact_phone: emergencyPhone || undefined,
      });
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoUser: 'ananya' | 'rohan') => {
    setError(null);
    setLoading(true);
    try {
      const demoEmail = demoUser === 'ananya' ? 'ananya@campus.edu' : 'rohan@campus.edu';
      const user = await apiService.login(demoEmail, 'maddy123');
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200/80 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-calm-800 via-teal-800 to-calm-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌿</span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-300">
              Maddy Companion Profile
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'signin' ? 'Welcome back, friend' : 'Create your safe space'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {mode === 'signin'
              ? 'Log in to sync your personalized recovery manual, menstrual logs, and chats.'
              : 'Tell Maddy a little about yourself so your companion can tailor care with deep personal empathy.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold transition text-center ${
              mode === 'signin'
                ? 'text-calm-800 border-b-2 border-calm-700 bg-white'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold transition text-center ${
              mode === 'signup'
                ? 'text-calm-800 border-b-2 border-calm-700 bg-white'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Instant Demo Profiles (Hackathon Preview)</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Switch immediately to test female cycle tracking, family contacts, and personalized chat:
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ananya')}
                disabled={loading}
                className="flex-1 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-800 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>🌸 Ananya (Female, 20)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rohan')}
                disabled={loading}
                className="flex-1 px-3 py-2 rounded-xl bg-white hover:bg-teal-50 border border-teal-200 text-[11px] font-bold text-teal-800 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>🌿 Rohan (Male, 21)</span>
              </button>
            </div>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / Student ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@campus.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-md shadow-calm-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In to Maddy'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min={15}
                      max={65}
                      required
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Selection (Crucial for Menstrual Tracking conditional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender * <span className="text-[10px] text-slate-400 font-normal">(enables female cycle tracker)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      gender === 'female'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🌸 Female</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      gender === 'male'
                        ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🌿 Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('non-binary')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      gender === 'non-binary'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>✨ Non-Binary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('prefer_not_to_say')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      gender === 'prefer_not_to_say'
                        ? 'bg-slate-100 border-slate-300 text-slate-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🔒 Prefer not to say</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / Student ID *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College & Year (Optional)</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. IIT Kharagpur / JU, 3rd Year"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                />
              </div>

              {/* Optional Primary Emergency Contact */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Family / Emergency Contact (Optional for Safe Dialing)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contact Name (e.g. Maa)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Phone (e.g. +91 98300...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-md shadow-calm-700/20 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? 'Creating account...' : 'Create Account & Start Journey'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict privacy. Password hashed with SHA-256 in local SQLite database.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
