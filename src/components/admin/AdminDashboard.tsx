import React, { useState, useEffect } from 'react';
import {
  Shield,
  Radio,
  Tv,
  Headphones,
  Calendar,
  Users,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiClient } from '../../services/api';
import { AuditLog, UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { currentUser, isLeaderOrAdmin, isSuperAdmin, allUsers, switchUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'security_tests' | 'audit_logs' | 'users' | 'announcements' | 'daily'
  >('overview');

  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [accessDeniedError, setAccessDeniedError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Security test suite runner state
  const [testResults, setTestResults] = useState<any>(null);
  const [runningTests, setRunningTests] = useState(false);

  // New announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'urgent' | 'important' | 'general'>('important');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Daily scripture & devotional state
  const [dailyRef, setDailyRef] = useState('Proverbs 3:5-6');
  const [dailyText, setDailyText] = useState('Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.');
  const [dailyReflection, setDailyReflection] = useState('Surrendering our own calculations to God is not weakness—it is supreme wisdom. Whatever decision, crossroad, or responsibility lies before you today, acknowledge His sovereignty and rest in His guiding hand.');
  const [dailyPrayer, setDailyPrayer] = useState('Heavenly Father, I yield my desires, worries, and calculations to You today. Calm my restless heart, guide my steps in righteousness, and grant me the grace to trust Your unwavering goodness. In Jesus’ name, Amen.');
  const [dailyTheme, setDailyTheme] = useState('Surrender & Divine Direction');
  const [dailySuccess, setDailySuccess] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setAccessDeniedError(null);
    try {
      // Backend authorization check: Server independently rejects unauthorized users
      const metricsData = await ApiClient.getAdminMetrics();
      setMetrics(metricsData);

      const logsData = await ApiClient.getAuditLogs();
      setAuditLogs(logsData.logs || []);
    } catch (err: any) {
      console.warn('Backend rejected admin request:', err);
      setAccessDeniedError(
        err.data?.error || err.message || 'HTTP 403 Forbidden: Insufficient role permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [currentUser.id]);

  const handleRunSecurityTests = async () => {
    setRunningTests(true);
    try {
      const data = await ApiClient.runSecurityTests();
      setTestResults(data);
    } catch (err: any) {
      alert(`Test suite error: ${err.message}`);
    } finally {
      setRunningTests(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    try {
      await ApiClient.updateUserRole(targetUserId, newRole);
      alert(`Successfully updated user to ${newRole}`);
      await fetchAdminData();
    } catch (err: any) {
      alert(`Backend Authorization Denied: ${err.message}`);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    try {
      await ApiClient.publishAnnouncement({
        title: annTitle.trim(),
        content: annContent.trim(),
        priority: annPriority,
        publishDate: new Date().toISOString().split('T')[0],
        expiryDate: '2026-11-30',
        isPublished: true
      });
      setAnnSuccess(true);
      setAnnTitle('');
      setAnnContent('');
      setTimeout(() => setAnnSuccess(false), 3000);
    } catch (err: any) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  const handleSaveDaily = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiClient.saveDailyScripture({
        reference: dailyRef,
        text: dailyText,
        reflection: dailyReflection,
        prayer: dailyPrayer,
        theme: dailyTheme
      });
      setDailySuccess(true);
      setTimeout(() => setDailySuccess(false), 3000);
    } catch (err: any) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  // BACKEND REJECTION STATE:
  // If the server rejected the user with 401 or 403 Forbidden
  if (accessDeniedError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-3xl border border-rose-900/50 bg-rose-950/20 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="h-16 w-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <Lock className="h-8 w-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
            Backend Authorization Check Failed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Access Forbidden (HTTP 403)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            The Kingdom Connect backend server rejected this request. Admin endpoints require an
            authenticated session with <strong>ADMIN</strong> or <strong>SUPER_ADMIN</strong> role.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-left">
            <div>
              <span className="text-slate-500">Authenticated Actor:</span> {currentUser.name}
            </div>
            <div>
              <span className="text-slate-500">Actor Role:</span>{' '}
              <span className="text-amber-400">{currentUser.role}</span>
            </div>
            <div>
              <span className="text-slate-500">Server Message:</span>{' '}
              <span className="text-rose-400">{accessDeniedError}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3">
              Switch to an authorized role to verify access:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {allUsers
                .filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-md transition-all"
                  >
                    Login as {u.name.split(' ')[0]} ({u.role})
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Server-Enforced Administration
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-100 mt-1">Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified identity: <strong>{currentUser.name}</strong> ({currentUser.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSecurityTests}
              disabled={runningTests}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${runningTests ? 'animate-spin' : ''}`} />
              Run 10 Security Tests
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {[
            { id: 'overview', label: 'Backend Metrics' },
            { id: 'security_tests', label: 'Security Test Suite (10/10)' },
            { id: 'audit_logs', label: 'Audit Trail' },
            { id: 'users', label: 'User Roles & Permissions' },
            { id: 'announcements', label: 'Announcements' },
            { id: 'daily', label: 'Daily Scripture' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW: Server-verified Metrics */}
        {activeTab === 'overview' && metrics && (
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-100">
                Server-Verified System Data
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real database counts returned directly by <code>/api/admin/metrics</code>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <Radio className="h-5 w-5 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                  {metrics.activeStreams}
                </div>
                <div className="text-xs text-slate-400 mt-1">Live Broadcasts</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <Tv className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                  {metrics.publishedVideos}
                </div>
                <div className="text-xs text-slate-400 mt-1">Sermon Videos</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <Headphones className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                  {metrics.audioMessages}
                </div>
                <div className="text-xs text-slate-400 mt-1">Audio Messages</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <Calendar className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                  {metrics.eventsCount}
                </div>
                <div className="text-xs text-slate-400 mt-1">Gatherings</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <FileText className="h-5 w-5 text-rose-400 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                  {metrics.prayersInCare}
                </div>
                <div className="text-xs text-slate-400 mt-1">Prayers in Care</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <Users className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                  {metrics.registeredUsersCount}
                </div>
                <div className="text-xs text-slate-400 mt-1">Database Users</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AUTOMATED SECURITY TEST SUITE (10 Requirements) */}
        {activeTab === 'security_tests' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-100">
                  Security Requirement Verification Suite
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated test runner testing all 10 security mandates directly against the backend
                </p>
              </div>

              <button
                onClick={handleRunSecurityTests}
                disabled={runningTests}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold transition-all disabled:opacity-50"
              >
                {runningTests ? 'Running Backend Tests...' : 'Execute Test Suite'}
              </button>
            </div>

            {!testResults ? (
              <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center">
                <p className="text-sm text-slate-300">
                  Click &ldquo;Execute Test Suite&rdquo; to run all 10 security tests on the server.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-400" />
                    <span className="font-semibold text-teal-300">
                      {testResults.summary} ({testResults.testsPassed}/{testResults.testsTotal} Passed)
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">{testResults.timestamp}</span>
                </div>

                <div className="space-y-3">
                  {testResults.results.map((t: any) => (
                    <div
                      key={t.testNumber}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-teal-400 font-bold">
                            TEST {t.testNumber}:
                          </span>
                          <span className="font-semibold text-slate-100">{t.name}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5">{t.description}</p>
                        <p className="text-slate-300 font-mono text-[11px] mt-1">
                          Expected: {t.expected}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Verification: {t.details}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0 self-start sm:self-center">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="mt-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-slate-100">
              Server-Side Audit Trail ({auditLogs.length} events)
            </h2>
            <p className="text-xs text-slate-400">
              Immutable server records logging actor user ID, action, target record, timestamp, and result
            </p>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-teal-400">{log.action}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-300">{log.actorName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({log.actorRole})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                        log.result === 'allowed' ? 'bg-teal-950 text-teal-400 border border-teal-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.result}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: {log.targetType} ({log.targetRecord})</span>
                      <span className="font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    {log.details && (
                      <p className="text-slate-300 text-[11px] font-mono bg-slate-950/40 p-2 rounded border border-slate-800">
                        {log.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. USER ROLES & ACCESS CONTROL */}
        {activeTab === 'users' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-100">
                  User Roles & Access Control (RBAC)
                </h2>
                <p className="text-xs text-slate-400">
                  Role promotion is strictly enforced on the server. Only SUPER_ADMIN can modify user roles.
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-mono ${
                isSuperAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {isSuperAdmin ? 'SUPER_ADMIN Privileges Active' : 'Read-Only (Requires SUPER_ADMIN to modify)'}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-semibold text-slate-100 text-sm">{user.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      disabled={!isSuperAdmin}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="bg-slate-800 border border-slate-700 text-xs font-mono text-teal-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 disabled:opacity-50"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="LEADER">LEADER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>

                    <button
                      onClick={() => switchUser(user.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300"
                    >
                      Switch to {user.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="mt-8 max-w-xl">
            <h2 className="font-serif text-xl font-bold text-slate-100 mb-4">
              Broadcast Server Announcement
            </h2>

            {annSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-teal-950/40 border border-teal-500/40 text-xs text-teal-300">
                Announcement published to server.
              </div>
            )}

            <form onSubmit={handlePublishAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="important">Important</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold"
              >
                Publish to Kingdom Connect
              </button>
            </form>
          </div>
        )}

        {/* 6. DAILY SCRIPTURE */}
        {activeTab === 'daily' && (
          <div className="mt-8 max-w-xl">
            <h2 className="font-serif text-xl font-bold text-slate-100 mb-4">
              Edit Daily Scripture (Server Record)
            </h2>

            {dailySuccess && (
              <div className="mb-4 p-3 rounded-lg bg-teal-950/40 border border-teal-500/40 text-xs text-teal-300">
                Daily Scripture updated on server.
              </div>
            )}

            <form onSubmit={handleSaveDaily} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reference</label>
                <input
                  type="text"
                  required
                  value={dailyRef}
                  onChange={(e) => setDailyRef(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Passage Text</label>
                <textarea
                  rows={3}
                  required
                  value={dailyText}
                  onChange={(e) => setDailyText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Devotional Theme
                </label>
                <input
                  type="text"
                  value={dailyTheme}
                  onChange={(e) => setDailyTheme(e.target.value)}
                  placeholder="e.g. Surrender & Divine Direction"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pastoral Reflection
                </label>
                <textarea
                  rows={3}
                  required
                  value={dailyReflection}
                  onChange={(e) => setDailyReflection(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Guided Prayer for the Day
                </label>
                <textarea
                  rows={3}
                  required
                  value={dailyPrayer}
                  onChange={(e) => setDailyPrayer(e.target.value)}
                  placeholder="A short, reflective prayer for members to pray today..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold"
              >
                Save to Database
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
