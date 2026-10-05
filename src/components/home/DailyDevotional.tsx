import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Heart,
  RefreshCw
} from 'lucide-react';
import { DailyScripture } from '../../types';
import { ApiClient } from '../../services/api';
import { StorageService } from '../../services/storage';

interface DailyDevotionalProps {
  onOpenShareModal: (reference: string, text: string, version: string) => void;
  onNavigateToBible?: (bookId: string, chapter: number, verse?: number) => void;
}

export const DailyDevotional: React.FC<DailyDevotionalProps> = ({
  onOpenShareModal,
  onNavigateToBible
}) => {
  const [devotional, setDevotional] = useState<DailyScripture>(() =>
    StorageService.getDailyScripture()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const fetchDevotional = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.getDailyDevotional();
      if (res.devotional) {
        setDevotional(res.devotional);
        StorageService.saveDailyScripture(res.devotional);
      }
    } catch (err) {
      console.info('Using locally cached daily scripture and devotional:', err);
      setDevotional(StorageService.getDailyScripture());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotional();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = async () => {
    const prayerText = devotional.prayer ? `\n\nPrayer for Today:\n${devotional.prayer}` : '';
    const shareText = `"${devotional.text}" — ${devotional.reference}\n\nReflection:\n${devotional.reflection}${prayerText}\n\nShared via Kingdom Connect`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed', err);
    }
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `Scripture of the Day: ${devotional.reference}. ${devotional.text}. Reflection: ${devotional.reflection}. ${
      devotional.prayer ? `Prayer for Today: ${devotional.prayer}` : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const parseBookAndChapter = (ref: string) => {
    const parts = ref.split(' ');
    let bookName = parts[0];
    let ch = 1;
    let v: number | undefined = undefined;

    if (parts.length >= 2) {
      const match = parts[1].match(/(\d+):?(\d+)?/);
      if (match) {
        ch = parseInt(match[1], 10);
        if (match[2]) v = parseInt(match[2], 10);
      }
    }

    let bookId = 'PSA';
    const bLower = ref.toLowerCase();
    if (bLower.includes('proverb')) bookId = 'PRO';
    else if (bLower.includes('psalm')) bookId = 'PSA';
    else if (bLower.includes('roman')) bookId = 'ROM';
    else if (bLower.includes('john')) bookId = 'JHN';
    else if (bLower.includes('matthew')) bookId = 'MAT';
    else if (bLower.includes('genesis')) bookId = 'GEN';

    return { bookId, chapter: ch, verse: v };
  };

  const bibleLink = parseBookAndChapter(devotional.reference);

  return (
    <section className="py-8 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 p-6 sm:p-9 shadow-xl backdrop-blur-md">
          {/* Subtle atmospheric gold/teal lighting */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          {/* Top metadata row */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                <span>Daily Devotional</span>
              </span>
              {devotional.theme && (
                <span className="hidden sm:inline-block text-xs font-medium text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  {devotional.theme}
                </span>
              )}
              <span className="text-xs text-slate-400">{devotional.date}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  isPlayingAudio
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md animate-pulse'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
                }`}
                title={isPlayingAudio ? 'Stop reading' : 'Listen to Devotional'}
                aria-label={isPlayingAudio ? 'Stop audio' : 'Listen to daily devotional'}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Playing</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Listen</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Copy devotional and prayer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-teal-300 hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  onOpenShareModal(
                    devotional.reference,
                    `${devotional.text}\n\nReflection: ${devotional.reflection}${
                      devotional.prayer ? `\n\nPrayer: ${devotional.prayer}` : ''
                    }`,
                    'Daily Devotional'
                  )
                }
                className="p-2 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Share Scripture card"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={fetchDevotional}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
                title="Refresh devotional"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Scripture Passage Quote */}
          <div className="relative z-10 my-6">
            <blockquote className="font-serif text-2xl sm:text-3xl italic text-slate-100 leading-relaxed text-balance">
              &ldquo;{devotional.text}&rdquo;
            </blockquote>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-teal-300 tracking-wide">
                — {devotional.reference}
              </span>

              {onNavigateToBible && (
                <button
                  onClick={() =>
                    onNavigateToBible(bibleLink.bookId, bibleLink.chapter, bibleLink.verse)
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <span>Read Full Chapter in Bible</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Devotional Reflection */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Today's Meditation
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              {devotional.reflection}
            </p>
          </div>

          {/* Guided Prayer for Today */}
          {devotional.prayer && (
            <div className="relative z-10 mt-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Heart className="h-4 w-4 text-amber-400 fill-amber-400/20" />
                <span>Prayer for Today</span>
              </div>
              <p className="font-serif text-sm sm:text-base italic text-amber-100/90 leading-relaxed">
                "{devotional.prayer}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
