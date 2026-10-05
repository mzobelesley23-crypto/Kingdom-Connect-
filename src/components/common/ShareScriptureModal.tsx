import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareScriptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  text: string;
  version: string;
}

export const ShareScriptureModal: React.FC<ShareScriptureModalProps> = ({
  isOpen,
  onClose,
  reference,
  text,
  version
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `"${text}"\n— ${reference} (${version})\nKingdom Connect · Connect with God. Connect with People.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: reference,
        text: shareText
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          Scripture Share Card
        </h3>

        <div className="relative overflow-hidden rounded-xl border border-teal-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-inner text-center">
          <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center text-amber-400/70">
            <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none stroke-2">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="5" y1="8" x2="19" y2="8" />
            </svg>
          </div>

          <p className="font-serif text-lg sm:text-xl italic text-slate-100 leading-relaxed mb-4">
            &ldquo;{text}&rdquo;
          </p>

          <div className="text-sm font-semibold text-teal-300 tracking-wide">
            {reference} <span className="text-xs text-slate-400 font-normal">({version})</span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2">
            <span className="text-[11px] font-serif font-bold text-slate-300 tracking-wider">
              KINGDOM CONNECT
            </span>
            <span className="text-[10px] text-slate-500">· Connect · Grow · Belong · Serve</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-teal-400" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Scripture Card
              </>
            )}
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-lg shadow-teal-500/10 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share Card
          </button>
        </div>
      </div>
    </div>
  );
};
