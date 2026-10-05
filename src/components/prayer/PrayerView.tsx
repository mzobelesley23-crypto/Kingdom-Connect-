import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Lock,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ApiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PrayerRequest, PrayerCategory } from '../../types';

export const PrayerView: React.FC = () => {
  const { currentUser, isLeaderOrAdmin } = useAuth();

  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my_prayers' | 'pastoral_desk'>('my_prayers');

  const [title, setTitle] = useState('');
  const [requestText, setRequestText] = useState('');
  const [category, setCategory] = useState<PrayerCategory>('guidance');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.getPrayers();
      setPrayers(res.prayers || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load prayer requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrayers();
  }, [currentUser.id]);

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requestText.trim()) return;

    try {
      await ApiClient.submitPrayer({
        title: title.trim(),
        request: requestText.trim(),
        category
      });
      setTitle('');
      setRequestText('');
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
      await loadPrayers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed');
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: PrayerRequest['status'],
    pastoralNotes?: string
  ) => {
    try {
      await ApiClient.updatePrayer(id, status, pastoralNotes);
      await loadPrayers();
    } catch (err: any) {
      alert(`Backend authorization error: ${err.message}`);
    }
  };

  const myPrayers = prayers.filter((p) => p.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-teal-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400">
                Confidential Intercession & Pastoral Care
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-100 mt-1">Prayer</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit confidential prayer requests to be carried before the Lord by pastoral elders
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-950/20 text-teal-300 text-xs font-medium">
            <Lock className="h-3.5 w-3.5" />
            <span>Database-Isolated & Private</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLeaderOrAdmin && (
          <div className="mt-6 flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 w-fit">
            <button
              onClick={() => setActiveTab('my_prayers')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'my_prayers'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Submit & My Requests ({myPrayers.length})
            </button>
            <button
              onClick={() => setActiveTab('pastoral_desk')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'pastoral_desk'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-teal-400 hover:text-teal-300'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Pastoral Intercession Desk ({prayers.length})
            </button>
          </div>
        )}

        {/* Member View */}
        {activeTab === 'my_prayers' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl">
              <h2 className="font-serif text-xl font-bold text-slate-100 mb-1">
                Submit a Prayer Request
              </h2>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Your request is stored privately in the backend and only accessible to verified
                pastoral elders.
              </p>

              {submittedSuccess && (
                <div className="mb-4 p-4 rounded-xl bg-teal-950/40 border border-teal-500/40 text-xs text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-400" />
                  <span>
                    Your prayer request has been securely recorded on the server.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmitPrayer} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Request Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Healing for family member, Wisdom in decision..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PrayerCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="guidance">Guidance & Wisdom</option>
                    <option value="healing">Physical / Emotional Healing</option>
                    <option value="family">Family & Marriage</option>
                    <option value="provision">Financial & Provision</option>
                    <option value="salvation">Salvation of Loved Ones</option>
                    <option value="thanksgiving">Thanksgiving & Praise</option>
                    <option value="other">Other Need</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Prayer Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Share your prayer burden..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-lg shadow-teal-500/10 active:scale-[0.99] transition-all"
                  >
                    <Send className="h-4 w-4" />
                    Submit Private Prayer Request
                  </button>
                </div>
              </form>
            </div>

            {/* My Requests (Isolated by server) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-slate-100">
                  My Requests ({myPrayers.length})
                </h2>
                <span className="text-[11px] text-slate-500">Only visible to you</span>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading prayer records...</div>
              ) : myPrayers.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                  <HeartHandshake className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    You have not submitted any prayer requests yet.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Submit your request using the form to be carried in prayer.
                  </p>
                </div>
              ) : (
                myPrayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-teal-400">
                          {prayer.category}
                        </span>
                        <h3 className="font-serif text-base font-bold text-slate-100 mt-0.5">
                          {prayer.title}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        prayer.status === 'praying' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        prayer.status === 'answered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {prayer.status === 'praying' ? 'In Prayer' : prayer.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{prayer.request}</p>

                    {prayer.pastoralNotes && (
                      <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/20 text-xs">
                        <span className="text-[10px] font-semibold text-teal-400 block mb-0.5">
                          Note from Pastoral Team:
                        </span>
                        <p className="text-slate-300">{prayer.pastoralNotes}</p>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                      Submitted on {new Date(prayer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Pastoral Intercession Desk */}
        {activeTab === 'pastoral_desk' && isLeaderOrAdmin && (
          <div className="mt-8 space-y-5">
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-xs text-teal-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-400" />
                <span>
                  <strong>Pastoral Care Authorization:</strong> You are accessing the intercession
                  stream via your verified role (<strong>{currentUser.role}</strong>). All reads are
                  audit-logged.
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {prayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-200">{prayer.userName}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({prayer.userEmail})
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-teal-400">
                          {prayer.category}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-slate-100 mt-1">
                        {prayer.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={prayer.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            prayer.id,
                            e.target.value as PrayerRequest['status'],
                            prayer.pastoralNotes
                          )
                        }
                        className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
                      >
                        <option value="received">Status: Received</option>
                        <option value="praying">Status: In Prayer</option>
                        <option value="answered">Status: Answered</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                    {prayer.request}
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={prayer.pastoralNotes || ''}
                      placeholder="Add an encouraging pastoral note or update..."
                      onBlur={(e) => {
                        if (e.target.value !== prayer.pastoralNotes) {
                          handleUpdateStatus(prayer.id, prayer.status, e.target.value);
                        }
                      }}
                      className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    <span className="text-[11px] text-slate-500">Auto-saved on blur</span>
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
