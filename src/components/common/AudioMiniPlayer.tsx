import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface AudioMiniPlayerProps {
  onOpenListenTab?: () => void;
}

export const AudioMiniPlayer: React.FC<AudioMiniPlayerProps> = ({ onOpenListenTab }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    seek,
    skipSeconds,
    setVolumeLevel,
    toggleMute,
    closePlayer
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 lg:bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-[440px] z-40 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-3.5 transition-all">
      <div
        className="group relative h-1.5 w-full bg-slate-800 rounded-full cursor-pointer mb-2.5 overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          seek(ratio * (duration || 1800));
        }}
      >
        <div
          className="h-full bg-teal-400 rounded-full transition-all group-hover:bg-teal-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover ring-1 ring-slate-800 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h4
              onClick={onOpenListenTab}
              className="text-xs sm:text-sm font-semibold text-slate-100 truncate cursor-pointer hover:text-teal-300"
            >
              {currentTrack.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
              <span>{currentTrack.speaker}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration || currentTrack.durationSeconds)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => skipSeconds(-15)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Rewind 15s"
            aria-label="Rewind 15 seconds"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlayPause}
            className="h-9 w-9 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center shadow-md active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(15)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Forward 15s"
            aria-label="Forward 15 seconds"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 pl-1.5">
            <button
              onClick={toggleMute}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-14 h-1 accent-teal-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={closePlayer}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors ml-1"
            title="Close Player"
            aria-label="Close audio player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
