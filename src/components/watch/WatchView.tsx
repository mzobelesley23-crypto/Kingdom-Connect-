import React, { useState, useMemo } from 'react';
import {
  Tv,
  Play,
  Search,
  User,
  BookOpen,
  Share2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { SermonVideo } from '../../types';

interface WatchViewProps {
  onSelectVideoToPlay: (sermon: SermonVideo) => void;
  onOpenShareModal: (reference: string, text: string, version: string) => void;
}

export const WatchView: React.FC<WatchViewProps> = ({
  onSelectVideoToPlay,
  onOpenShareModal
}) => {
  const { isLeaderOrAdmin } = useAuth();
  const [sermons] = useState<SermonVideo[]>(() => StorageService.getSermons());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'Sunday Sermon', label: 'Sunday Sermons' },
    { id: 'Teaching', label: 'Bible Teachings' },
    { id: 'Leadership', label: 'Marketplace & Leadership' }
  ];

  const visibleSermons = useMemo(() => {
    return sermons.filter((s) => {
      if (!isLeaderOrAdmin && s.status !== 'published') return false;

      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesSpeaker = s.speaker.toLowerCase().includes(q);
        const matchesScripture = s.scriptureReferences.some((r) => r.toLowerCase().includes(q));
        const matchesTags = s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSpeaker && !matchesScripture && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [sermons, selectedCategory, searchQuery, isLeaderOrAdmin]);

  const featured = visibleSermons.find((s) => s.isFeatured) || visibleSermons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Tv className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400">
              Video Messages & Expositions
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-100 mt-1">Watch</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Preaching, verse-by-verse teachings, and ministry replays grounded in Scripture
          </p>
        </div>

        {featured && (
          <section className="mt-8 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative aspect-video bg-black overflow-hidden group">
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <button
                  onClick={() => onSelectVideoToPlay(featured)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Play featured sermon"
                >
                  <div className="h-16 w-16 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 fill-current ml-1" />
                  </div>
                </button>
                <div className="absolute bottom-3 right-3 text-xs font-mono px-2.5 py-1 rounded bg-black/75 text-slate-200">
                  {featured.duration}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-2">
                    <span>{featured.category}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
                    {featured.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-teal-400" />
                    <span>{featured.speaker}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-mono block mb-1.5">
                      Scripture Texts:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {featured.scriptureReferences.map((ref) => (
                        <span
                          key={ref}
                          className="text-xs font-serif italic text-teal-300 bg-teal-950/40 border border-teal-500/20 px-2 py-0.5 rounded-md"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onSelectVideoToPlay(featured)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-lg shadow-teal-500/10 active:scale-95 transition-all"
                  >
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                    Watch Now
                  </button>

                  <button
                    onClick={() =>
                      onOpenShareModal(
                        featured.title,
                        `Watch "${featured.title}" by ${featured.speaker} on Kingdom Connect.`,
                        'Kingdom Connect'
                      )
                    }
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Share Video"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter & Search Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sermons, speakers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Sermons Video Grid */}
        <section className="mt-8">
          {visibleSermons.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-slate-800 rounded-2xl bg-slate-900/40">
              <Tv className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-base font-semibold text-slate-300">No messages available yet.</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-16/9 w-full relative bg-slate-950 overflow-hidden">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <button
                      onClick={() => onSelectVideoToPlay(sermon)}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label="Play video"
                    >
                      <div className="h-12 w-12 rounded-full bg-teal-500/90 hover:bg-teal-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </button>
                    <div className="absolute bottom-2.5 right-2.5 text-[11px] font-mono px-2 py-0.5 rounded bg-black/80 text-slate-200">
                      {sermon.duration}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{sermon.category}</span>
                        <span>{sermon.date}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-1">
                        {sermon.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-0.5">{sermon.speaker}</p>

                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {sermon.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-teal-400" />
                        <span className="text-xs text-slate-300 truncate max-w-[180px]">
                          {sermon.scriptureReferences[0]}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectVideoToPlay(sermon)}
                        className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                      >
                        Watch →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
