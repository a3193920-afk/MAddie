import React, { useState, useEffect } from 'react';
import { CheckInEntry, BaselineMetric, WeeklyResilienceReport } from '../../types';
import { MoodStressChart } from './MoodStressChart';
import { TriggerBarChart } from './TriggerBarChart';
import { BaselineComparisonCard } from './BaselineComparisonCard';
import { WeeklyResilienceCard } from './WeeklyResilienceCard';
import { apiService } from '../../lib/api';
import { Users, Heart, Calendar, MessageSquare, ThumbsUp, Send } from 'lucide-react';

interface Props {
  checkins: CheckInEntry[];
}

export const TrackView: React.FC<Props> = ({ checkins }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'timeline' | 'community' | 'cycle'>('trends');
  const [baselineMetrics, setBaselineMetrics] = useState<BaselineMetric[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyResilienceReport | null>(null);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Exam stress');

  useEffect(() => {
    (async () => {
      const bMetrics = await apiService.getBaselineMetrics();
      setBaselineMetrics(bMetrics);
      const wReport = await apiService.getWeeklyReport();
      setWeeklyReport(wReport);
      const posts = await apiService.getCommunityPosts();
      setCommunityPosts(posts);
    })();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const res = await apiService.createCommunityPost({
        category: newPostCategory,
        content: newPostContent.trim(),
        author_alias: 'Anonymous Student',
      });
      setCommunityPosts([res, ...communityPosts]);
      setNewPostContent('');
    } catch (err: any) {
      alert(err.message || 'Error creating post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
            activeTab === 'trends'
              ? 'bg-calm-700 text-white border-calm-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Longitudinal Trends & Baselines
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
            activeTab === 'timeline'
              ? 'bg-calm-700 text-white border-calm-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Emotional Timeline Log
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
            activeTab === 'community'
              ? 'bg-calm-700 text-white border-calm-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Anonymous Peer Forum</span>
        </button>

        <button
          onClick={() => setActiveTab('cycle')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
            activeTab === 'cycle'
              ? 'bg-calm-700 text-white border-calm-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Menstrual Wellness (Opt-in)</span>
        </button>
      </div>

      {/* Tab 1: Trends & Baselines */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <MoodStressChart data={checkins} />
          <TriggerBarChart
            stressors={
              weeklyReport?.top_stressors || [
                { name: 'Academic Deadlines', count: 6, percentage: 42 },
                { name: 'Placement Uncertainty', count: 4, percentage: 28 },
                { name: 'Hostel Noise / Sleep', count: 3, percentage: 21 },
                { name: 'Relationships / Social', count: 1, percentage: 9 },
              ]
            }
          />
          <BaselineComparisonCard metrics={baselineMetrics} />
          {weeklyReport && <WeeklyResilienceCard report={weeklyReport} />}
        </div>
      )}

      {/* Tab 2: Emotional Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-800">Campus Emotional Timeline</h3>
            <p className="text-xs text-slate-500">Chronological history of stress events, interventions, and reported outcomes</p>
          </div>

          <div className="space-y-3 pt-2">
            {checkins.slice().reverse().map((entry, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{entry.date}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-calm-800">
                      Primary Stressor: {entry.stressors?.join(', ') || 'General'}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-slate-600 italic">"{entry.notes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-calm-100 text-calm-900 font-bold border border-calm-200">
                    Mood: {entry.mood}/5
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl font-bold border ${
                    entry.stress >= 4
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    Stress: {entry.stress}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Anonymous Peer Forum */}
      {activeTab === 'community' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800">Share Anonymous Encouragement</h3>
            <p className="text-xs text-slate-500">
              No roll numbers, no names. Auto-moderated with safety guardrails to maintain a supportive campus environment.
            </p>

            <form onSubmit={handlePostSubmit} className="space-y-3 pt-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share a word of encouragement or how you navigated a tough semester day..."
                rows={3}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-calm-500"
                required
              />
              <div className="flex items-center justify-between">
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700"
                >
                  <option value="Exam stress">Exam stress</option>
                  <option value="Hostel life">Hostel life</option>
                  <option value="Placement pressure">Placement pressure</option>
                  <option value="Loneliness">Loneliness</option>
                  <option value="Confidence">Confidence</option>
                </select>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Anonymously</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{post.author_avatar || '🌿'}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{post.author_alias}</div>
                      <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-calm-50 text-calm-800 border border-calm-200 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <button className="flex items-center gap-1 hover:text-calm-700 transition">
                    <span>🤗</span>
                    <span>Hug ({post.reactions?.hug || 12})</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-calm-700 transition">
                    <span>💙</span>
                    <span>Relate ({post.reactions?.relate || 24})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Menstrual Wellness Module */}
      {activeTab === 'cycle' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Optional Menstrual Wellness Module</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Hormonal & Mood Rhythm Synchronization</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Notice patterns between your cycle phase, fatigue, and academic focus. Completely optional and never shared with AI without explicit consent.
              </p>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-bold">
              Private / Local Only
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2 text-xs text-slate-700">
            <div className="font-bold text-rose-950 flex items-center gap-1.5">
              <span>Historical Pattern Observation:</span>
            </div>
            <p className="leading-relaxed">
              "You reported lower energy and mild irritability around days 23-26 in 3 recent cycles. 
              Scheduling lighter study blocks or taking gentle walking breaks during these days may support your focus."
            </p>
            <p className="text-[11px] text-slate-500 italic">
              Notice: We correlate self-reported mood with cycle days. We never state "your period caused clinical depression."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Cycle Length</span>
              <span className="text-lg font-extrabold text-slate-800">28 Days</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Phase</span>
              <span className="text-lg font-extrabold text-rose-700">Luteal</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Next</span>
              <span className="text-lg font-extrabold text-slate-800">In 4 Days</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tracked Symptoms</span>
              <span className="text-lg font-extrabold text-slate-800">Cramps, Fatigue</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
