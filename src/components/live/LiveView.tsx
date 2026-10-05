import React, { useState } from 'react';
import {
  Radio,
  Calendar,
  Clock,
  Play,
  Share2,
  Bell,
  Check,
  Video
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { LiveStream, SermonVideo } from '../../types';

interface LiveViewProps {
  onSelectVideoToPlay: (sermon: SermonVideo) => void;
  onOpenShareModal: (reference: string, text: string, version: string) => void;
}

export const LiveView: React.FC<LiveViewProps> = ({ onSelectVideoToPlay, onOpenShareModal }) => {
  const { isLeaderOrAdmin } = useAuth();
  const [streams, setStreams] = useState<LiveStream[]>(() => StorageService.getLiveStreams());
  const [remindersSet, setRemindersSet] = useState<string[]>([]);
  const [liveChatMessage, setLiveChatMessage] = useState('');
  const [liveComments, setLiveComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'Elder Grace', text: 'Amen! Grace and peace to everyone joining online today.', time: '09:32' },
    { id: '2', user: 'Joshua M.', text: 'Greetings from the youth ministry fellowship hall!', time: '09:35' },
    { id: '3', user: 'Themba N.', text: 'Standing in faith for our families and cities.', time: '09:38' }
  ]);

  const activeStream = streams.find((s) => s.status === 'live');
  const upcomingStreams = streams.filter((s) => s.status === 'upcoming');
  const replays = streams.filter((s) => s.status === 'ended');

  const handleToggleLiveStatus = (streamId: string) => {
    const updated = streams.map((s) => {
      if (s.id === streamId) {
        return {
          ...s,
          status: s.status === 'live' ? ('ended' as const) : ('live' as const)
        };
      }
      return s;
    });
    setStreams(updated);
    updated.forEach((s) => StorageService.saveLiveStream(s));
  };

  const handleToggleReminder = (id: string) => {
    if (remindersSet.includes(id)) {
      setRemindersSet(remindersSet.filter((item) => item !== id));
    } else {
      setRemindersSet([...remindersSet, id]);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatMessage.trim()) return;
    setLiveComments([
      ...liveComments,
      {
        id: `c_${Date.now()}`,
        user: 'You',
        text: liveChatMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLiveChatMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-red-400">
                Live Sanctuary Broadcasts
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-100 mt-1">Live Services</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Worship with the worldwide family of Kingdom Connect wherever you are
            </p>
          </div>

          {isLeaderOrAdmin && streams.length > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Pastoral Broadcast:</span>
              <button
                onClick={() => handleToggleLiveStatus(streams[0].id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  streams[0].status === 'live'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                }`}
              >
                {streams[0].status === 'live' ? 'Stop Livestream' : 'Go Live Now'}
              </button>
            </div>
          )}
        </div>

        {/* 1. LIVE NOW SECTION */}
        <section className="mt-8">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Live Now
          </h2>

          {activeStream ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl border border-red-500/30 bg-slate-900 overflow-hidden shadow-2xl">
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    src={activeStream.streamUrl}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    LIVE
                  </div>
                  <div className="absolute top-3 right-3 text-xs font-mono px-2 py-1 rounded bg-black/60 text-slate-200">
                    {activeStream.viewerCount || 340} Watching
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs text-red-400 font-semibold tracking-wide">
                    {activeStream.serviceInfo}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-100 mt-1">
                    {activeStream.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{activeStream.speaker}</p>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {activeStream.description}
                  </p>
                </div>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between bg-slate-950/40">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-xs font-semibold text-slate-200">Live Fellowship Chat</span>
                    <span className="text-[10px] text-teal-400 font-mono">Real-time</span>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {liveComments.map((c) => (
                      <div key={c.id} className="text-xs">
                        <span className="font-semibold text-teal-300">{c.user}</span>
                        <span className="text-[10px] text-slate-500 ml-1.5 font-mono">{c.time}</span>
                        <p className="text-slate-300 mt-0.5">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={liveChatMessage}
                      onChange={(e) => setLiveChatMessage(e.target.value)}
                      placeholder="Share an encouraging word or amen..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
              <Radio className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <h3 className="font-serif text-lg font-bold text-slate-300">
                No livestream is currently active.
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Join our next scheduled service below or explore full replays from past services.
              </p>
            </div>
          )}
        </section>

        {/* 2. UPCOMING LIVESTREAMS */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-400" />
              Upcoming Broadcasts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingStreams.map((item) => {
              const hasReminder = remindersSet.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-24 w-28 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-teal-400">
                        {item.category}
                      </span>
                      <h3 className="font-serif text-base font-bold text-slate-100 mt-0.5 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{item.speaker}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2">
                        <Clock className="h-3.5 w-3.5 text-teal-400" />
                        <span>{item.serviceInfo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Live on Kingdom Connect & Apps</span>
                    <button
                      onClick={() => handleToggleReminder(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        hasReminder
                          ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                          : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {hasReminder ? <Check className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                      {hasReminder ? 'Reminder Set' : 'Set Reminder'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. REPLAYS */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Video className="h-4 w-4 text-teal-400" />
                Completed Broadcast Replays
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rewatch full services with sermon expositions and worship
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {replays.map((rep) => {
              const relatedSermon = StorageService.getSermons().find(
                (s) => s.id === rep.replayVideoId
              );

              return (
                <div
                  key={rep.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="aspect-16/9 w-full relative bg-slate-950">
                    <img
                      src={rep.thumbnail}
                      alt={rep.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <button
                      onClick={() => {
                        if (relatedSermon) {
                          onSelectVideoToPlay(relatedSermon);
                        } else {
                          onSelectVideoToPlay({
                            id: rep.id,
                            title: rep.title,
                            speaker: rep.speaker,
                            description: rep.description,
                            thumbnail: rep.thumbnail,
                            videoUrl: rep.streamUrl,
                            duration: '1:12:00',
                            date: 'Past Sunday',
                            scriptureReferences: ['Romans 8'],
                            category: rep.category,
                            tags: ['Service Replay'],
                            status: 'published'
                          });
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label="Play replay"
                    >
                      <div className="h-12 w-12 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </button>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/70 text-teal-300">
                      Replay
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-xs text-slate-400">{rep.serviceInfo}</div>
                    <h3 className="font-serif text-base font-bold text-slate-100 mt-0.5">
                      {rep.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{rep.speaker}</p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {rep.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
