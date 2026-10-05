import React from 'react';
import { X, Share2, User } from 'lucide-react';
import { SermonVideo } from '../../types';

interface VideoModalProps {
  sermon: SermonVideo | null;
  onClose: () => void;
  onOpenShareModal: (reference: string, text: string, version: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  sermon,
  onClose,
  onOpenShareModal
}) => {
  if (!sermon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
          aria-label="Close video player"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-video w-full bg-black shrink-0">
          <video
            controls
            autoPlay
            playsInline
            src={sermon.videoUrl}
            poster={sermon.thumbnail}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-teal-400 tracking-wider">
                {sermon.category} · {sermon.date}
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-100 mt-0.5">
                {sermon.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <User className="h-3.5 w-3.5 text-teal-400" />
                <span>{sermon.speaker}</span>
                <span>·</span>
                <span className="font-mono">{sermon.duration}</span>
              </div>
            </div>

            <button
              onClick={() =>
                onOpenShareModal(
                  sermon.title,
                  `Watch "${sermon.title}" by ${sermon.speaker} on Kingdom Connect.`,
                  'Kingdom Connect'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">
              Primary Scripture References
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {sermon.scriptureReferences.map((ref) => (
                <span
                  key={ref}
                  className="px-2.5 py-1 rounded-lg bg-teal-950/40 border border-teal-500/30 text-teal-300 font-serif italic text-xs"
                >
                  {ref}
                </span>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {sermon.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
