import React, { useState, useMemo, useRef } from 'react';
import {
  Headphones,
  Play,
  Pause,
  Upload,
  Search,
  BookOpen,
  Share2,
  X,
  FileAudio,
  Check
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useAuth } from '../../context/AuthContext';
import { AudioMessage } from '../../types';

interface ListenViewProps {
  onOpenShareModal: (reference: string, text: string, version: string) => void;
}

export const ListenView: React.FC<ListenViewProps> = ({ onOpenShareModal }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer();
  const { isLeaderOrAdmin, currentUser } = useAuth();

  const [audioItems, setAudioItems] = useState<AudioMessage[]>(() =>
    StorageService.getAudioMessages()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSpeaker, setUploadSpeaker] = useState(currentUser.name);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Expository Audio');
  const [uploadScripture, setUploadScripture] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { id: 'all', label: 'All Audio' },
    { id: 'Meditation & Word', label: 'Meditations' },
    { id: 'Expository Audio', label: 'Expository Preaching' },
    { id: 'Pastoral Care', label: 'Pastoral Care' },
    { id: 'Discipleship', label: 'Discipleship' }
  ];

  const visibleAudio = useMemo(() => {
    return audioItems.filter((item) => {
      if (!isLeaderOrAdmin && item.status !== 'published') return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSpeaker = item.speaker.toLowerCase().includes(q);
        const matchesScripture = item.scriptureReferences.some((r) => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSpeaker && !matchesScripture) {
          return false;
        }
      }

      return true;
    });
  }, [audioItems, selectedCategory, searchQuery, isLeaderOrAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    const isAudio =
      file.type.includes('audio') ||
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.wav');

    if (!isAudio) {
      setUploadError('Invalid format: Please choose an MP3 or WAV audio file.');
      return;
    }

    const MAX_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setUploadError(
        `File exceeds 50 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a file under 50 MB.`
      );
      return;
    }

    setSelectedFile(file);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select an audio file (MP3/WAV).');
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError('Please provide a message title.');
      return;
    }

    setIsUploading(true);
    const audioUrl = URL.createObjectURL(selectedFile);

    setTimeout(() => {
      const newAudio: AudioMessage = {
        id: `audio_${Date.now()}`,
        title: uploadTitle.trim(),
        speaker: uploadSpeaker.trim() || currentUser.name,
        description: uploadDescription.trim() || 'Uploaded audio recording.',
        artwork: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
        audioUrl,
        duration: '32:00',
        durationSeconds: 1920,
        date: new Date().toISOString().split('T')[0],
        scriptureReferences: uploadScripture ? [uploadScripture.trim()] : ['Psalm 119:105'],
        category: uploadCategory,
        status: 'published'
      };

      StorageService.saveAudioMessage(newAudio);
      setAudioItems(StorageService.getAudioMessages());

      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadScripture('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-teal-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400">
                Audio Sermons & Teachings
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-100 mt-1">Listen</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Listen to expository sermons, morning prayers, and audio reflections
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Upload className="h-4 w-4 text-teal-400" />
            Upload Audio Recording (50 MB)
          </button>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
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
              placeholder="Search audio messages..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {visibleAudio.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-slate-800 rounded-2xl bg-slate-900/40">
              <Headphones className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-base font-semibold text-slate-300">No audio messages available.</p>
              <p className="text-xs text-slate-500 mt-1">Upload an audio recording or check back soon.</p>
            </div>
          ) : (
            visibleAudio.map((item) => {
              const isThisTrackPlaying = currentTrack?.id === item.id && isPlaying;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    currentTrack?.id === item.id
                      ? 'border-teal-500/50 bg-teal-950/20 shadow-lg'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={item.artwork}
                        alt={item.title}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover ring-1 ring-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => {
                          if (currentTrack?.id === item.id) {
                            togglePlayPause();
                          } else {
                            playTrack(item);
                          }
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl hover:bg-black/20 transition-colors"
                        aria-label={isThisTrackPlaying ? 'Pause' : 'Play'}
                      >
                        <div className="h-9 w-9 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow-md">
                          {isThisTrackPlaying ? (
                            <Pause className="h-4 w-4 fill-current" />
                          ) : (
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-teal-400">
                        <span>{item.category}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 mt-0.5 line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-400">{item.speaker}</p>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
                        <BookOpen className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        <span className="truncate">{item.scriptureReferences.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {item.duration}
                    </span>

                    <button
                      onClick={() => {
                        if (currentTrack?.id === item.id) {
                          togglePlayPause();
                        } else {
                          playTrack(item);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isThisTrackPlaying
                          ? 'bg-teal-500 text-slate-950'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {isThisTrackPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Listen
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        onOpenShareModal(
                          item.title,
                          `Listen to "${item.title}" by ${item.speaker} on Kingdom Connect.`,
                          'Kingdom Connect'
                        )
                      }
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Share Audio"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Upload Audio Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <FileAudio className="h-5 w-5 text-teal-400" />
                <h3 className="font-serif text-xl font-bold text-slate-100">
                  Upload Audio Message
                </h3>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {uploadError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                    {uploadError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Audio File (MP3 or WAV, max 50 MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".mp3,.wav,audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-xl p-4 text-center bg-slate-950/40 transition-colors"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-teal-300">
                        <Check className="h-4 w-4 text-teal-400" />
                        <span className="font-semibold">{selectedFile.name}</span>
                        <span className="text-slate-500 font-mono">
                          ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                        <span className="text-xs text-slate-300">
                          Click to select audio file (MP3 / WAV)
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Up to 50 MB supported
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Message Title
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Walking in Kingdom Authority"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Speaker / Teacher
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadSpeaker}
                      onChange={(e) => setUploadSpeaker(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    >
                      <option value="Expository Audio">Expository Audio</option>
                      <option value="Meditation & Word">Meditation & Word</option>
                      <option value="Pastoral Care">Pastoral Care</option>
                      <option value="Discipleship">Discipleship</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-md disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading...' : 'Publish Audio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
