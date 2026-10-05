import React from 'react';
import {
  Radio,
  Play,
  Calendar,
  Compass,
  Users,
  Image as ImageIcon,
  Headphones,
  ArrowRight,
  Tv,
  Share2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useAuth } from '../../context/AuthContext';
import { ChurchEvent, Ministry, ConnectionGroup, SermonVideo, AudioMessage } from '../../types';
import { DailyDevotional } from './DailyDevotional';

interface HomeViewProps {
  onNavigate: (tab: string, meta?: any) => void;
  onOpenShareModal: (reference: string, text: string, version: string) => void;
  onSelectVideoToPlay: (sermon: SermonVideo) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenShareModal,
  onSelectVideoToPlay
}) => {
  const { playTrack } = useAudioPlayer();
  const { isLeaderOrAdmin } = useAuth();

  const activeLive = StorageService.getActiveLiveStream();
  const dailyScripture = StorageService.getDailyScripture();
  const announcements = StorageService.getAnnouncements().filter((a) => a.isPublished);

  const events = StorageService.getEvents()
    .filter((e) => e.status === 'published')
    .slice(0, 3);

  const sermons = StorageService.getSermons()
    .filter((s) => s.status === 'published');
  const latestWatch = sermons[0];

  const audioList = StorageService.getAudioMessages()
    .filter((a) => a.status === 'published');
  const latestListen = audioList[0];

  const ministries = StorageService.getMinistries()
    .filter((m) => m.status === 'active')
    .slice(0, 3);

  const connections = StorageService.getConnections().slice(0, 3);
  const galleryAlbums = StorageService.getGalleryAlbums().slice(0, 2);

  const toggleLiveDemo = () => {
    const streams = StorageService.getLiveStreams();
    if (streams.length > 0) {
      streams[0].status = streams[0].status === 'live' ? 'ended' : 'live';
      StorageService.saveLiveStream(streams[0]);
      window.dispatchEvent(new Event('storage'));
      window.location.hash = window.location.hash;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* 1. LIVE NOW — ONLY when activeLive exists! */}
      {activeLive && (
        <section className="border-b border-red-500/20 bg-gradient-to-r from-red-950/40 via-slate-900 to-red-950/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-red-950/30 border border-red-500/30 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={activeLive.thumbnail}
                    alt={activeLive.title}
                    className="h-16 w-24 sm:h-20 sm:w-32 rounded-xl object-cover ring-2 ring-red-500/40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    LIVE NOW
                  </div>
                </div>

                <div>
                  <div className="text-xs text-red-400 font-semibold tracking-wide">
                    {activeLive.serviceInfo}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 mt-0.5 line-clamp-1">
                    {activeLive.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeLive.speaker}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onNavigate('live')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                >
                  <Radio className="h-4 w-4 animate-pulse" />
                  Watch Live Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Atmosphere Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-900/40">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80"
            alt="Kingdom Worship"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-2">
              Welcome to Kingdom Connect
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-100 text-balance leading-tight">
              Connect with God. Connect with People.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Grow in truth, belong in community, and serve with purpose across generations.
            </p>

            {isLeaderOrAdmin && (
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
                <span className="text-slate-400">Pastoral Controls:</span>
                <button
                  onClick={toggleLiveDemo}
                  className={`font-semibold underline ${activeLive ? 'text-red-400' : 'text-teal-400'}`}
                >
                  {activeLive ? 'End Active Livestream' : 'Start Simulated Livestream'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="border-b border-slate-800/60 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  Announcement
                </span>
                <span className="text-xs sm:text-sm text-slate-200 font-medium">
                  {announcements[0].title}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{announcements[0].content}</p>
            </div>
          </div>
        </section>
      )}

      {/* 2. DAILY DEVOTIONAL & PRAYER */}
      <DailyDevotional
        onOpenShareModal={onOpenShareModal}
        onNavigateToBible={(bookId, chapter, verse) =>
          onNavigate('bible', { bookId, chapter, verse })
        }
      />

      {/* WATCH & LISTEN ON HOME */}
      <section className="py-10 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {latestWatch && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tv className="h-4 w-4 text-teal-400" />
                    <h2 className="font-serif text-xl font-bold text-slate-100">Featured Message</h2>
                  </div>
                  <button
                    onClick={() => onNavigate('watch')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                  >
                    Watch Library <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 transition-all hover:border-slate-700">
                  <div className="aspect-video w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={latestWatch.thumbnail}
                      alt={latestWatch.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <button
                      onClick={() => onSelectVideoToPlay(latestWatch)}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label="Play video sermon"
                    >
                      <div className="h-14 w-14 rounded-full bg-teal-500/90 hover:bg-teal-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 fill-current ml-1" />
                      </div>
                    </button>
                    <div className="absolute bottom-3 right-3 text-xs font-mono px-2 py-0.5 rounded bg-black/70 text-slate-200">
                      {latestWatch.duration}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs text-slate-400 mb-1">
                      {latestWatch.speaker} · {latestWatch.date}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-100 line-clamp-1">
                      {latestWatch.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {latestWatch.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {latestListen && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-teal-400" />
                    <h2 className="font-serif text-xl font-bold text-slate-100">Latest Audio Word</h2>
                  </div>
                  <button
                    onClick={() => onNavigate('listen')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                  >
                    Audio Archive <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between h-[calc(100%-2.5rem)]">
                  <div className="flex gap-4">
                    <img
                      src={latestListen.artwork}
                      alt={latestListen.title}
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                        {latestListen.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-slate-100 mt-1 line-clamp-2">
                        {latestListen.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{latestListen.speaker}</p>
                      <div className="text-[11px] text-slate-500 mt-1 font-mono">
                        Duration: {latestListen.duration} · {latestListen.date}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => playTrack(latestListen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-md active:scale-95 transition-all"
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                      Listen Now
                    </button>
                    <span className="text-xs text-slate-400">
                      {latestListen.scriptureReferences.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS ON HOME */}
      <section className="py-10 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-100">Upcoming Gatherings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Worship services, city outreaches & fellowships</p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              All Events <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((event) => (
              <div
                key={event.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-slate-700 transition-colors"
              >
                <div className="aspect-16/9 w-full overflow-hidden bg-slate-950">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-teal-400 uppercase tracking-wider mb-1">
                      {event.date} · {event.startTime}
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-100 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {event.location}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{event.category}</span>
                    <button
                      onClick={() => onNavigate('events', { eventId: event.id })}
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium"
                    >
                      View Event →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECTIONS ON HOME */}
      <section className="py-10 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-100">Connect with People</h2>
              <p className="text-xs text-slate-400 mt-0.5">Find your small group, life circle, and community</p>
            </div>
            <button
              onClick={() => onNavigate('connections')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              Explore All Groups <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {connections.map((conn) => (
              <div
                key={conn.id}
                onClick={() => onNavigate('connections')}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-teal-500/40 transition-all flex items-center gap-4"
              >
                <img
                  src={conn.image}
                  alt={conn.name}
                  className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-teal-300">
                    {conn.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{conn.meetingSchedule}</p>
                  <p className="text-[11px] text-teal-400/80 mt-1 truncate">{conn.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINISTRIES ON HOME */}
      <section className="py-10 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-100">Active Ministries</h2>
              <p className="text-xs text-slate-400 mt-0.5">Places of service, discipleship, and impact</p>
            </div>
            <button
              onClick={() => onNavigate('ministries')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              All Ministries <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ministries.map((min) => (
              <div
                key={min.id}
                onClick={() => onNavigate('ministries')}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="aspect-16/9 w-full overflow-hidden bg-slate-950">
                  <img
                    src={min.image}
                    alt={min.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">
                    {min.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-slate-100 mt-1 line-clamp-1">
                    {min.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {min.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY ON HOME */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-100">Moments & Memories</h2>
              <p className="text-xs text-slate-400 mt-0.5">Capturing the life and witness of the church</p>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              Full Gallery <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {galleryAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => onNavigate('gallery')}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 relative aspect-16/9"
              >
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-mono uppercase text-teal-400 tracking-wider">
                    {album.date} · {album.images.length} photos
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-100 mt-0.5">
                    {album.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
