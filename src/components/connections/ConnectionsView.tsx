import React, { useState } from 'react';
import { Users, MapPin, Clock, Globe, Mail, ArrowRight, Check, X, Shield } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { ConnectionGroup } from '../../types';

export const ConnectionsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [connections] = useState<ConnectionGroup[]>(() => StorageService.getConnections());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<ConnectionGroup | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [memberMessage, setMemberMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Groups' },
    { id: 'small_group', label: 'Life Groups' },
    { id: 'young_adults', label: 'Young Adults' },
    { id: 'professionals', label: 'Professionals' },
    { id: 'bible_study', label: 'Bible Study' },
    { id: 'men', label: "Men's Ministry" },
    { id: 'women', label: "Women's Fellowship" }
  ];

  const filtered = connections.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setJoinSuccess(selectedGroup.name);
      setSelectedGroup(null);
      setMemberMessage('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wider uppercase">
            <Users className="h-4 w-4" />
            <span>Fellowship & Community</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-slate-100">
            Connections & Small Groups
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            Faith is lived in community. Find a local small group, home fellowship, or professional cohort near you.
          </p>
        </div>

        {/* Join Success Alert */}
        {joinSuccess && (
          <div className="mb-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-teal-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-teal-400 shrink-0" />
              <p className="text-sm">
                Welcome! Your request to join <strong>{joinSuccess}</strong> has been received. The group leader will reach out to welcome you.
              </p>
            </div>
            <button onClick={() => setJoinSuccess(null)} className="p-1 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Category Filters */}
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

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((g) => (
            <div
              key={g.id}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all duration-200 shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-800 overflow-hidden">
                <img
                  src={g.image}
                  alt={g.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-teal-400 border border-slate-700 uppercase tracking-wider">
                    {g.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif font-bold text-xl text-white line-clamp-1">
                    {g.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {g.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">Host: <strong className="text-slate-200">{g.leader}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{g.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{g.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${g.contactEmail}`}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                    title={`Email ${g.contactEmail}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => setSelectedGroup(g)}
                    className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-teal-600/90 text-white hover:bg-teal-500 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Connect & Join</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Connection Modal */}
      {selectedGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedGroup(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGroup(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Join {selectedGroup.name}</h3>
                <p className="text-xs text-slate-400">Facilitated by {selectedGroup.leader}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-5">
              <p><strong>Location:</strong> {selectedGroup.location}</p>
              <p><strong>Schedule:</strong> {selectedGroup.meetingSchedule}</p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
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
                  Introductory Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={memberMessage}
                  onChange={(e) => setMemberMessage(e.target.value)}
                  placeholder="Share what area of town you are in, or any questions for the group leader..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-500 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Connecting...' : 'Request to Join Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
