import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Bookmark,
  MessageSquare,
  Highlighter,
  Calendar,
  Bell,
  Globe,
  Save,
  Check,
  Trash2,
  BookOpen,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { READING_PLANS } from '../../data/bibleData';
import { BibleHighlight, BibleNote, BibleBookmark, UserReadingPlanProgress } from '../../types';

interface ProfileViewProps {
  onNavigateToBible: (bookId: string, chapter: number, verse?: number) => void;
  onNavigateToPlans: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigateToBible,
  onNavigateToPlans
}) => {
  const { currentUser, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'journal' | 'notes' | 'bookmarks' | 'plans' | 'settings'>('journal');

  // Profile edit state
  const [name, setName] = useState(currentUser.name);
  const [languagePref, setLanguagePref] = useState(currentUser.languagePref || 'en');
  const [notifications, setNotifications] = useState(currentUser.notificationPrefs);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Spiritual Journal Data
  const [highlights, setHighlights] = useState<BibleHighlight[]>([]);
  const [notes, setNotes] = useState<BibleNote[]>([]);
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);
  const [planProgresses, setPlanProgresses] = useState<{ plan: any; progress: UserReadingPlanProgress }[]>([]);

  const loadUserData = () => {
    const userH = StorageService.getUserHighlights(currentUser.id);
    const userN = StorageService.getUserNotes(currentUser.id);
    const userB = StorageService.getUserBookmarks(currentUser.id);

    setHighlights(userH);
    setNotes(userN);
    setBookmarks(userB);

    const activePlans = READING_PLANS.map((plan) => {
      const progress = StorageService.getUserReadingPlanProgress(currentUser.id, plan.id);
      return { plan, progress };
    });
    setPlanProgresses(activePlans);
  };

  useEffect(() => {
    loadUserData();
    setName(currentUser.name);
    setLanguagePref(currentUser.languagePref || 'en');
    setNotifications(currentUser.notificationPrefs);
  }, [currentUser.id]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      languagePref,
      notificationPrefs: notifications
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteNote = (noteId: string) => {
    StorageService.deleteNote(noteId, currentUser.id);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleDeleteBookmark = (bmId: string) => {
    StorageService.removeBookmark(bmId, currentUser.id);
    setBookmarks((prev) => prev.filter((b) => b.id !== bmId));
  };

  const handleDeleteHighlight = (h: BibleHighlight) => {
    StorageService.removeHighlight(currentUser.id, h.book, h.chapter, h.verse);
    setHighlights((prev) =>
      prev.filter(
        (x) => !(x.book === h.book && x.chapter === h.chapter && x.verse === h.verse)
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header Banner */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
                />
                <span
                  className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white border border-slate-800 ${
                    currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN'
                      ? 'bg-amber-600'
                      : currentUser.role === 'LEADER'
                      ? 'bg-teal-600'
                      : 'bg-slate-700'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                  {currentUser.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    Active Member
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ID: {currentUser.id.substring(0, 10)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pt-2 sm:pt-0">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-center min-w-[70px]">
                <p className="text-xs text-slate-400">Notes</p>
                <p className="text-lg font-bold text-teal-300">{notes.length}</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-center min-w-[70px]">
                <p className="text-xs text-slate-400">Highlights</p>
                <p className="text-lg font-bold text-amber-300">{highlights.length}</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-center min-w-[70px]">
                <p className="text-xs text-slate-400">Bookmarks</p>
                <p className="text-lg font-bold text-slate-100">{bookmarks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'journal'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Spiritual Journal ({notes.length + highlights.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Verse Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'plans'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Reading Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab Content: Journal (Combined Highlights & Notes) */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-100">Personal Spiritual Journal</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your private reflections and saved scripture highlights, stored confidentially.
              </p>
            </div>

            {highlights.length === 0 && notes.length === 0 ? (
              <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                <h4 className="font-serif text-lg font-bold text-slate-200">No Journal Entries Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  As you read the Bible, tap any verse to highlight it or attach a personal reflection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-teal-400">
                          {n.book} {n.chapter}:{n.verse || 1}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed italic mb-4">
                        "{n.noteText}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => onNavigateToBible(n.book, n.chapter, n.verse)}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                      >
                        <span>Open in Bible</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {highlights.map((h, i) => (
                  <div
                    key={`${h.book}-${h.chapter}-${h.verse}-${i}`}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-amber-400">
                          {h.book} {h.chapter}:{h.verse} (Highlighted)
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      </div>
                      <p className="text-xs text-slate-400">
                        Marked in Scripture for contemplation.
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => onNavigateToBible(h.book, h.chapter, h.verse)}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                      >
                        <span>Read Passage</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteHighlight(h)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-100">Saved Scripture Notes</h3>
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400">No notes saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-teal-400">
                          {n.book} {n.chapter}:{n.verse || 1}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed mb-4">{n.noteText}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => onNavigateToBible(n.book, n.chapter, n.verse)}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                      >
                        <span>View in Bible</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-100">Bookmarked Chapters</h3>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-400">No bookmarked chapters yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-slate-100">
                        {b.book} Chapter {b.chapter}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Saved {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToBible(b.book, b.chapter, b.verse)}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 text-xs font-semibold hover:bg-teal-500/20"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleDeleteBookmark(b.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Reading Plans Progress */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100">Reading Plans Progress</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Keep track of your daily scripture journeys.
                </p>
              </div>
              <button
                onClick={onNavigateToPlans}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-500"
              >
                Browse All Plans
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {planProgresses.map(({ plan, progress }) => {
                const completedCount = progress.completedDays.length;
                const totalCount = plan.durationDays;
                const percent = Math.round((completedCount / totalCount) * 100);

                return (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                          {plan.category}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{percent}% Done</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-slate-100">{plan.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{plan.description}</p>

                      <div className="mt-4 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Completed {completedCount} of {totalCount} days
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={onNavigateToPlans}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
                      >
                        <span>Continue Reading Plan</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Preferences */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-slate-100 mb-6">
              Account & Notification Settings
            </h3>

            {savedSuccess && (
              <div className="mb-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-teal-300 flex items-center gap-2 text-sm">
                <Check className="h-4 w-4" />
                <span>Your preferences have been saved.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400 opacity-60 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-500 mt-1">Managed via server authentication session.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Language Preference</label>
                <select
                  value={languagePref}
                  onChange={(e) => setLanguagePref(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="en">English</option>
                  <option value="zu">isiZulu</option>
                  <option value="af">Afrikaans</option>
                  <option value="nso">Sepedi</option>
                  <option value="st">Sesotho</option>
                  <option value="xh">isiXhosa</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Notification Alerts
                </h4>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Livestream Broadcast Alerts</p>
                    <p className="text-xs text-slate-400">Receive alerts when services or events go live</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.liveAlerts}
                    onChange={(e) =>
                      setNotifications({ ...notifications, liveAlerts: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-700 bg-slate-900"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Event & Gathering Reminders</p>
                    <p className="text-xs text-slate-400">Timely notifications for gatherings you RSVP'd for</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.eventReminders}
                    onChange={(e) =>
                      setNotifications({ ...notifications, eventReminders: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-700 bg-slate-900"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Daily Scripture Meditation</p>
                    <p className="text-xs text-slate-400">Daily dawn devotional text & pastoral reflection</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.dailyScripture}
                    onChange={(e) =>
                      setNotifications({ ...notifications, dailyScripture: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-700 bg-slate-900"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-200">New Sermons & Audio Releases</p>
                    <p className="text-xs text-slate-400">Get notified when new video messages or audio podcasts are uploaded</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newContent}
                    onChange={(e) =>
                      setNotifications({ ...notifications, newContent: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-700 bg-slate-900"
                  />
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-500 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
