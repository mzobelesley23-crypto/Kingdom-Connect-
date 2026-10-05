import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  Tv,
  Headphones,
  Calendar,
  Compass,
  Users,
  ChevronRight
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { BIBLE_BOOKS, SCRIPTURE_CORPUS } from '../../data/bibleData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, meta?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  const sermons = useMemo(() => StorageService.getSermons().filter((s) => s.status === 'published'), []);
  const audioList = useMemo(() => StorageService.getAudioMessages().filter((a) => a.status === 'published'), []);
  const events = useMemo(() => StorageService.getEvents().filter((e) => e.status === 'published'), []);
  const ministries = useMemo(() => StorageService.getMinistries().filter((m) => m.status === 'active'), []);
  const connections = useMemo(() => StorageService.getConnections(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: Array<{
      id: string;
      category: 'bible' | 'sermon' | 'audio' | 'event' | 'ministry' | 'connection';
      title: string;
      subtitle: string;
      tab: string;
      meta?: any;
    }> = [];

    BIBLE_BOOKS.forEach((b) => {
      if (b.name.toLowerCase().includes(q)) {
        items.push({
          id: `bible_${b.id}`,
          category: 'bible',
          title: b.name,
          subtitle: `${b.testament === 'OT' ? 'Old Testament' : 'New Testament'} · ${b.chaptersCount} chapters`,
          tab: 'bible',
          meta: { bookId: b.id, chapter: 1 }
        });
      }
    });

    Object.entries(SCRIPTURE_CORPUS).forEach(([key, versions]) => {
      const [bookId, chapterStr] = key.split('_');
      const chapter = parseInt(chapterStr, 10);
      const book = BIBLE_BOOKS.find((b) => b.id === bookId);
      const bookName = book ? book.name : bookId;
      const kjvVerses = versions['KJV'] || [];

      kjvVerses.forEach((v) => {
        if (v.text.toLowerCase().includes(q) || `${bookName} ${chapter}:${v.verse}`.toLowerCase().includes(q)) {
          if (items.filter((i) => i.category === 'bible').length < 6) {
            items.push({
              id: `verse_${key}_${v.verse}`,
              category: 'bible',
              title: `${bookName} ${chapter}:${v.verse}`,
              subtitle: `"${v.text}"`,
              tab: 'bible',
              meta: { bookId, chapter, verse: v.verse }
            });
          }
        }
      });
    });

    sermons.forEach((s) => {
      if (
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.scriptureReferences.some((r) => r.toLowerCase().includes(q)) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          id: `sermon_${s.id}`,
          category: 'sermon',
          title: s.title,
          subtitle: `${s.speaker} · ${s.category}`,
          tab: 'watch',
          meta: { sermonId: s.id }
        });
      }
    });

    audioList.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        a.speaker.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.scriptureReferences.some((r) => r.toLowerCase().includes(q))
      ) {
        items.push({
          id: `audio_${a.id}`,
          category: 'audio',
          title: a.title,
          subtitle: `${a.speaker} · ${a.duration}`,
          tab: 'listen',
          meta: { audioId: a.id }
        });
      }
    });

    events.forEach((e) => {
      if (
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      ) {
        items.push({
          id: `event_${e.id}`,
          category: 'event',
          title: e.title,
          subtitle: `${e.date} at ${e.startTime} · ${e.location}`,
          tab: 'events',
          meta: { eventId: e.id }
        });
      }
    });

    ministries.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) {
        items.push({
          id: `min_${m.id}`,
          category: 'ministry',
          title: m.name,
          subtitle: `Leader: ${m.leader} · ${m.category}`,
          tab: 'ministries',
          meta: { ministryId: m.id }
        });
      }
    });

    connections.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        items.push({
          id: `conn_${c.id}`,
          category: 'connection',
          title: c.name,
          subtitle: `${c.meetingSchedule} · ${c.location}`,
          tab: 'connections',
          meta: { connectionId: c.id }
        });
      }
    });

    // Strictly no private prayer requests, notes, or bookmarks in search
    return items.slice(0, 15);
  }, [query, sermons, audioList, events, ministries, connections]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="h-5 w-5 text-teal-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Scripture, sermons, podcasts, events, communities..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white rounded border border-slate-700 ml-2"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="py-10 px-4 text-center">
              <p className="text-sm font-medium text-slate-300">Search Across Kingdom Connect</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Find passages like &ldquo;Psalm 23&rdquo;, teachings on &ldquo;grace&rdquo;, upcoming church gatherings, and ministries.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No public results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try another reference or keyword.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => {
                let Icon = BookOpen;
                if (item.category === 'sermon') Icon = Tv;
                if (item.category === 'audio') Icon = Headphones;
                if (item.category === 'event') Icon = Calendar;
                if (item.category === 'ministry') Icon = Compass;
                if (item.category === 'connection') Icon = Users;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.tab, item.meta);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0 group-hover:bg-teal-500/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-100 truncate group-hover:text-teal-300">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.category}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
