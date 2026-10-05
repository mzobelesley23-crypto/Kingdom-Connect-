import React, { useState } from 'react';
import { Compass, Mail, Users, ArrowRight, Check, X, Calendar, Clock, Heart } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { Ministry } from '../../types';

export const MinistriesView: React.FC = () => {
  const { currentUser } = useAuth();
  const [ministries] = useState<Ministry[]>(() => StorageService.getMinistries());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null);
  const [volunteerNote, setVolunteerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Ministries' },
    { id: 'Worship & Arts', label: 'Worship & Arts' },
    { id: 'Outreach & Missions', label: 'Missions & Outreach' },
    { id: 'Youth & Children', label: 'Youth & NextGen' },
    { id: 'Pastoral & Care', label: 'Pastoral & Care' },
    { id: 'Marketplace', label: 'Marketplace' }
  ];

  const filtered = ministries.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinistry) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setConnectSuccess(selectedMinistry.name);
      setSelectedMinistry(null);
      setVolunteerNote('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wider uppercase">
            <Compass className="h-4 w-4" />
            <span>Kingdom Service</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-slate-100">
            Ministries & Service Departments
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            Discover opportunities to employ your gifts, serve the body of Christ, and touch lives in our city and abroad.
          </p>
        </div>

        {/* Success Toast */}
        {connectSuccess && (
          <div className="mb-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-teal-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-teal-400 shrink-0" />
              <p className="text-sm">
                Thank you! Your interest in serving with <strong>{connectSuccess}</strong> has been forwarded to the ministry leader.
              </p>
            </div>
            <button
              onClick={() => setConnectSuccess(null)}
              className="p-1 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                selectedCategory === c.id
                  ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all duration-200 shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-800 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-teal-400 border border-slate-700">
                    {m.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif font-bold text-xl text-white line-clamp-1">
                    {m.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {m.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">Leader: <strong className="text-slate-200">{m.leader}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{m.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{m.membersCount} Active Volunteers</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${m.contactEmail}`}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                    title={`Email ${m.contactEmail}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => setSelectedMinistry(m)}
                    className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-teal-600/90 text-white hover:bg-teal-500 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Volunteer & Serve</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Modal */}
      {selectedMinistry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedMinistry(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMinistry(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Join {selectedMinistry.name}</h3>
                <p className="text-xs text-slate-400">Led by {selectedMinistry.leader}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {selectedMinistry.description}
            </p>

            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Your Email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  How would you like to contribute? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={volunteerNote}
                  onChange={(e) => setVolunteerNote(e.target.value)}
                  placeholder="Share any background, skills, or specific days you are available..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMinistry(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-500 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Interest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
