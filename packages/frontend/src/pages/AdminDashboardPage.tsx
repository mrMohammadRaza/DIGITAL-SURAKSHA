import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/apiClient.js';
import { Topic, FeedbackItem } from '@digital-suraksha/shared';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  History,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'feedback' | 'audit'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Topic Form State
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicSlug, setNewTopicSlug] = useState('');
  const [newTopicTitleEn, setNewTopicTitleEn] = useState('');
  const [newTopicTitleHi, setNewTopicTitleHi] = useState('');
  const [newTopicTitleMr, setNewTopicTitleMr] = useState('');
  const [newTopicDefHi, setNewTopicDefHi] = useState('');
  const [newTopicSeverity, setNewTopicSeverity] = useState('high');

  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate('/admin/login');
      return;
    }

    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        if (token) {
          const [dash, tops, fb] = await Promise.all([
            api.getAdminDashboard(token),
            api.getTopics(),
            api.adminGetFeedback(token),
          ]);
          setDashboardData(dash);
          setTopics(tops);
          setFeedbackList(fb);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [isAuthenticated, token, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleDeleteTopic = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete topic: ${slug}?`)) return;
    try {
      if (token) {
        await api.adminDeleteTopic(token, id);
        setTopics((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleToggleFeedback = async (id: string) => {
    try {
      if (token) {
        const updated = await api.adminToggleFeedback(token, id);
        setFeedbackList((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isApproved: updated.isApproved } : f))
        );
      }
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const created = await api.adminCreateTopic(token, {
        slug: newTopicSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        categoryId: topics[0]?.categoryId || 'c1',
        severity: newTopicSeverity,
        titleEn: newTopicTitleEn,
        titleHi: newTopicTitleHi,
        titleMr: newTopicTitleMr,
        definitionEn: newTopicTitleEn,
        definitionHi: newTopicDefHi,
        definitionMr: newTopicTitleMr,
        howItWorksEn: 'Detailed how it works description.',
        howItWorksHi: 'ठग किस प्रकार से लोगों को फंसाते हैं उसका विवरण।',
        howItWorksMr: 'भामटे कसे फसवतात याचे सविस्तर वर्णन.',
        fictionalExampleEn: 'Fictional scenario example.',
        fictionalExampleHi: 'काल्पनिक उदाहरण।',
        fictionalExampleMr: 'काल्पनिक उदाहरण.',
        warningSignsEn: ['Suspicious requests'],
        safeActionsEn: ['Never share OTP'],
        victimGuidanceEn: ['Call 1930 immediately'],
        warningSignsHi: ['संदिग्ध कॉल या संदेश'],
        safeActionsHi: ['कभी भी किसी को पिन न बताएं'],
        victimGuidanceHi: ['तुरंत 1930 पर शिकायत करें'],
        warningSignsMr: ['संशयास्पद मेसेज'],
        safeActionsMr: ['कोणालाही ओटीपी सांगू नका'],
        victimGuidanceMr: ['१९३० वर तात्काळ तक्रार करा'],
      });

      setTopics((prev) => [created, ...prev]);
      setShowAddTopic(false);
      setNewTopicSlug('');
      setNewTopicTitleEn('');
      setNewTopicTitleHi('');
      setNewTopicTitleMr('');
      setNewTopicDefHi('');
      alert('Topic created successfully!');
    } catch (err: any) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Loading Administrator Dashboard...</p>
      </div>
    );
  }

  const { stats, recentLogs } = dashboardData;

  return (
    <div className="py-10 bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              CEP Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Logged in as: <strong className="text-emerald-600 dark:text-emerald-400">{user?.email}</strong> ({user?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 font-bold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'topics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curriculum Topics ({topics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'feedback'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback Moderation ({feedbackList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block">Topics</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.topicsCount}
                </span>
              </div>
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block">Categories</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.categoriesCount}
                </span>
              </div>
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block">Quizzes</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.quizzesCount}
                </span>
              </div>
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block">Attempts</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.attemptsCount}
                </span>
              </div>
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block">Quiz Pass Rate</span>
                <span className="text-2xl font-black text-emerald-500">
                  {stats.passRate}%
                </span>
              </div>
              <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block">Feedback</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.feedbackCount}
                </span>
              </div>
            </div>

            {/* Recent Audit Activity */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-500" />
                <span>Recent System Audit Activity</span>
              </h2>

              <div className="space-y-2">
                {recentLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white mr-2">[{log.action}]</strong>
                      <span className="text-slate-600 dark:text-slate-300">{log.details}</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-2">
                      <span>{log.performedBy}</span>
                      <span>•</span>
                      <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Topics Management */}
        {activeTab === 'topics' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Educational Fraud Topics
              </h2>
              <button
                onClick={() => setShowAddTopic(!showAddTopic)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddTopic ? 'Close Form' : 'Add New Topic'}</span>
              </button>
            </div>

            {/* Add Topic Form Modal/Section */}
            {showAddTopic && (
              <form onSubmit={handleCreateTopic} className="bg-white dark:bg-navy-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Curriculum Topic</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Slug (URL friendly)</label>
                    <input
                      required
                      value={newTopicSlug}
                      onChange={(e) => setNewTopicSlug(e.target.value)}
                      placeholder="e.g. fastag-recharge-scam"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Title (English)</label>
                    <input
                      required
                      value={newTopicTitleEn}
                      onChange={(e) => setNewTopicTitleEn(e.target.value)}
                      placeholder="Fake FASTag Recharge Scam"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Title (हिन्दी)</label>
                    <input
                      required
                      value={newTopicTitleHi}
                      onChange={(e) => setNewTopicTitleHi(e.target.value)}
                      placeholder="फास्टैग फर्जी रिचार्ज फ्रॉड"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Title (मराठी)</label>
                    <input
                      required
                      value={newTopicTitleMr}
                      onChange={(e) => setNewTopicTitleMr(e.target.value)}
                      placeholder="फास्टॅग बनावट रिचार्ज फसवणूक"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Severity</label>
                    <select
                      value={newTopicSeverity}
                      onChange={(e) => setNewTopicSeverity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                      <option value="medium">Medium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Hindi Definition (सरल व्याख्या)</label>
                  <textarea
                    rows={2}
                    required
                    value={newTopicDefHi}
                    onChange={(e) => setNewTopicDefHi(e.target.value)}
                    placeholder="इस फ्रॉड की संक्षिप्त व्याख्या..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
                >
                  Publish Topic to Database
                </button>
              </form>
            )}

            {/* Topics Table */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-navy-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Title (EN / HI)</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topics.map((tItem) => (
                    <tr key={tItem.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50">
                      <td className="p-4 font-mono text-xs">{tItem.slug}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{tItem.titleEn}</div>
                        <div className="text-xs text-slate-400">{tItem.titleHi}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tItem.severity === 'critical'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {tItem.severity}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteTopic(tItem.id, tItem.slug)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete topic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Feedback Moderation */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Citizen Feedback Moderation
            </h2>

            <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-navy-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="p-4">Citizen</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {feedbackList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50">
                      <td className="p-4 font-bold">{item.name || 'Anonymous'}</td>
                      <td className="p-4 text-slate-500">{item.villageOrCity || 'Rural'}</td>
                      <td className="p-4 max-w-xs truncate">{item.comment}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.isApproved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.isApproved ? 'Approved / Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleFeedback(item.id)}
                          className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold"
                        >
                          {item.isApproved ? 'Hide' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Security & Action Audit Trail
            </h2>

            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              {recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {log.action}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{log.details}</p>
                  </div>
                  <div className="text-slate-400 text-right">
                    <div>{log.performedBy}</div>
                    <div>{new Date(log.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
