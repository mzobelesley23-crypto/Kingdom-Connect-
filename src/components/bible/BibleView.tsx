import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Highlighter,
  MessageSquare,
  Share2,
  Volume2,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Trash2,
  Check
} from 'lucide-react';
import {
  BIBLE_BOOKS,
  AVAILABLE_VERSIONS,
  AVAILABLE_LANGUAGES,
  getScriptureVerses,
  SCRIPTURE_CORPUS
} from '../../data/bibleData';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { BibleHighlight, BibleNote, BibleBookmark } from '../../types';

interface BibleViewProps {
  initialBookId?: string;
  initialChapter?: number;
  initialVerse?: number;
  onOpenShareModal: (reference: string, text: string, version: string) => void;
  onOpenPlans: () => void;
}

export const BibleView: React.FC<BibleViewProps> = ({
  initialBookId = 'PSA',
  initialChapter = 23,
  initialVerse,
  onOpenShareModal,
  onOpenPlans
}) => {
  const { currentUser } = useAuth();

  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedVersion, setSelectedVersion] = useState('KJV');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [showVersionSelector, setShowVersionSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [isAudioReading, setIsAudioReading] = useState(false);
  const [audioSpeechRate] = useState(0.95);

  const [highlights, setHighlights] = useState<BibleHighlight[]>(() =>
    StorageService.getUserHighlights(currentUser.id)
  );
  const [notes, setNotes] = useState<BibleNote[]>(() =>
    StorageService.getUserNotes(currentUser.id)
  );
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>(() =>
    StorageService.getUserBookmarks(currentUser.id)
  );

  const [activeVerseNum, setActiveVerseNum] = useState<number | null>(initialVerse || null);
  const [noteInputText, setNoteInputText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    setHighlights(StorageService.getUserHighlights(currentUser.id));
    setNotes(StorageService.getUserNotes(currentUser.id));
    setBookmarks(StorageService.getUserBookmarks(currentUser.id));
  }, [currentUser.id]);

  const currentBook = useMemo(
    () => BIBLE_BOOKS.find((b) => b.id === selectedBookId) || BIBLE_BOOKS[18],
    [selectedBookId]
  );

  const verses = useMemo(
    () => getScriptureVerses(selectedBookId, selectedChapter, selectedVersion),
    [selectedBookId, selectedChapter, selectedVersion]
  );

  useEffect(() => {
    if (initialVerse) {
      setActiveVerseNum(initialVerse);
      const el = document.getElementById(`verse-${initialVerse}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [initialVerse]);

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isAudioReading) {
      window.speechSynthesis.cancel();
      setIsAudioReading(false);
    } else {
      window.speechSynthesis.cancel();
      const chapterText = `${currentBook.name}, Chapter ${selectedChapter}. ${verses
        .map((v) => `${v.verse}. ${v.text}`)
        .join(' ')}`;

      const utterance = new SpeechSynthesisUtterance(chapterText);
      utterance.rate = audioSpeechRate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => setIsAudioReading(false);
      utterance.onerror = () => setIsAudioReading(false);

      window.speechSynthesis.speak(utterance);
      setIsAudioReading(true);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedBookId, selectedChapter]);

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter((prev) => prev - 1);
      setActiveVerseNum(null);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === selectedBookId);
      if (idx > 0) {
        const prevBook = BIBLE_BOOKS[idx - 1];
        setSelectedBookId(prevBook.id);
        setSelectedChapter(prevBook.chaptersCount);
        setActiveVerseNum(null);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < currentBook.chaptersCount) {
      setSelectedChapter((prev) => prev + 1);
      setActiveVerseNum(null);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === selectedBookId);
      if (idx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[idx + 1];
        setSelectedBookId(nextBook.id);
        setSelectedChapter(1);
        setActiveVerseNum(null);
      }
    }
  };

  const getHighlightForVerse = (verseNum: number) => {
    return highlights.find(
      (h) => h.book === selectedBookId && h.chapter === selectedChapter && h.verse === verseNum
    );
  };

  const setVerseHighlight = (verseNum: number, color: 'gold' | 'teal' | 'rose' | 'amber') => {
    const existing = getHighlightForVerse(verseNum);
    if (existing && existing.color === color) {
      StorageService.removeHighlight(currentUser.id, selectedBookId, selectedChapter, verseNum);
    } else {
      const newHighlight: BibleHighlight = {
        id: `hl_${Date.now()}`,
        userId: currentUser.id,
        book: selectedBookId,
        chapter: selectedChapter,
        verse: verseNum,
        color,
        createdAt: new Date().toISOString()
      };
      StorageService.saveHighlight(newHighlight);
    }
    setHighlights(StorageService.getUserHighlights(currentUser.id));
  };

  const isVerseBookmarked = (verseNum: number) => {
    return bookmarks.some(
      (b) => b.book === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum
    );
  };

  const toggleBookmark = (verseNum: number) => {
    const existing = bookmarks.find(
      (b) => b.book === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum
    );
    if (existing) {
      StorageService.removeBookmark(existing.id, currentUser.id);
    } else {
      const newBm: BibleBookmark = {
        id: `bm_${Date.now()}`,
        userId: currentUser.id,
        book: selectedBookId,
        chapter: selectedChapter,
        verse: verseNum,
        label: `${currentBook.name} ${selectedChapter}:${verseNum}`,
        createdAt: new Date().toISOString()
      };
      StorageService.saveBookmark(newBm);
    }
    setBookmarks(StorageService.getUserBookmarks(currentUser.id));
  };

  const getNotesForVerse = (verseNum: number) => {
    return notes.filter(
      (n) => n.book === selectedBookId && n.chapter === selectedChapter && n.verse === verseNum
    );
  };

  const handleSaveNote = () => {
    if (!noteInputText.trim() || activeVerseNum === null) return;
    const newNote: BibleNote = {
      id: `note_${Date.now()}`,
      userId: currentUser.id,
      book: selectedBookId,
      chapter: selectedChapter,
      verse: activeVerseNum,
      noteText: noteInputText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveNote(newNote);
    setNotes(StorageService.getUserNotes(currentUser.id));
    setNoteInputText('');
    setIsAddingNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    StorageService.deleteNote(noteId, currentUser.id);
    setNotes(StorageService.getUserNotes(currentUser.id));
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const matches: Array<{
      bookId: string;
      chapter: number;
      verse: number;
      text: string;
      bookName: string;
    }> = [];

    Object.entries(SCRIPTURE_CORPUS).forEach(([key, versionsDict]) => {
      const [bId, chStr] = key.split('_');
      const chNum = parseInt(chStr, 10);
      const bObj = BIBLE_BOOKS.find((b) => b.id === bId);
      const bName = bObj ? bObj.name : bId;
      const vList = versionsDict[selectedVersion] || versionsDict['KJV'] || [];

      vList.forEach((v) => {
        if (
          v.text.toLowerCase().includes(q) ||
          `${bName} ${chNum}:${v.verse}`.toLowerCase().includes(q)
        ) {
          matches.push({
            bookId: bId,
            chapter: chNum,
            verse: v.verse,
            text: v.text,
            bookName: bName
          });
        }
      });
    });

    return matches.slice(0, 20);
  }, [searchQuery, selectedVersion]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Sticky Bible Reader Control Bar */}
      <div className="sticky top-16 z-30 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowBookSelector(!showBookSelector);
                setShowChapterSelector(false);
                setShowVersionSelector(false);
                setShowLanguageSelector(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-100 transition-all"
            >
              <span>{currentBook.name}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setShowChapterSelector(!showChapterSelector);
                setShowBookSelector(false);
                setShowVersionSelector(false);
                setShowLanguageSelector(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-100 transition-all"
            >
              <span>Ch. {selectedChapter}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <div className="flex items-center gap-1 ml-1 border-l border-slate-800 pl-2">
              <button
                onClick={handlePrevChapter}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Previous chapter"
                aria-label="Previous Chapter"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextChapter}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Next chapter"
                aria-label="Next Chapter"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowVersionSelector(!showVersionSelector);
                setShowBookSelector(false);
                setShowChapterSelector(false);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-mono font-medium text-teal-400 hover:bg-slate-800 transition-colors"
              title="Change translation"
            >
              {selectedVersion}
            </button>

            <button
              onClick={() => {
                setShowLanguageSelector(!showLanguageSelector);
                setShowBookSelector(false);
                setShowChapterSelector(false);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:bg-slate-800 transition-colors hidden sm:block"
              title="Change language"
            >
              {AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguage)?.name || 'Language'}
            </button>

            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isAudioReading
                  ? 'border-teal-500 bg-teal-500/20 text-teal-300 animate-pulse'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
              title={isAudioReading ? 'Stop Audio' : 'Listen to Chapter'}
            >
              {isAudioReading ? <Pause className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isAudioReading ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={() => setIsSearching(!isSearching)}
              className={`p-1.5 rounded-lg border text-slate-300 hover:bg-slate-800 transition-colors ${
                isSearching ? 'border-teal-500 bg-teal-500/10 text-teal-300' : 'border-slate-800 bg-slate-900/80'
              }`}
              title="Search Scripture"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenPlans}
              className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold transition-colors"
            >
              Reading Plans
            </button>
          </div>
        </div>

        {/* 1. Book Selector Dropdown */}
        {showBookSelector && (
          <div className="border-t border-slate-800 bg-slate-900/98 max-h-96 overflow-y-auto p-4 animate-in fade-in duration-150">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-mono uppercase text-slate-400">Select Book</span>
                <button
                  onClick={() => setShowBookSelector(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                    Old Testament (39)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBookId(b.id);
                          setSelectedChapter(1);
                          setShowBookSelector(false);
                          setShowChapterSelector(true);
                        }}
                        className={`px-2 py-1.5 text-xs rounded-md text-left truncate transition-colors ${
                          b.id === selectedBookId
                            ? 'bg-teal-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                    New Testament (27)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBookId(b.id);
                          setSelectedChapter(1);
                          setShowBookSelector(false);
                          setShowChapterSelector(true);
                        }}
                        className={`px-2 py-1.5 text-xs rounded-md text-left truncate transition-colors ${
                          b.id === selectedBookId
                            ? 'bg-teal-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Chapter Selector Dropdown */}
        {showChapterSelector && (
          <div className="border-t border-slate-800 bg-slate-900/98 max-h-80 overflow-y-auto p-4 animate-in fade-in duration-150">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-semibold text-slate-200">
                  {currentBook.name} — Select Chapter
                </span>
                <button
                  onClick={() => setShowChapterSelector(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
                {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => {
                      setSelectedChapter(ch);
                      setShowChapterSelector(false);
                      setActiveVerseNum(null);
                    }}
                    className={`h-10 rounded-lg flex items-center justify-center font-mono text-sm transition-colors ${
                      ch === selectedChapter
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Version Selector */}
        {showVersionSelector && (
          <div className="border-t border-slate-800 bg-slate-900/98 p-4 animate-in fade-in duration-150">
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono uppercase text-slate-400">
                  Bible Translations & Texts
                </span>
                <button
                  onClick={() => setShowVersionSelector(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {AVAILABLE_VERSIONS.map((ver) => (
                  <button
                    key={ver.id}
                    onClick={() => {
                      setSelectedVersion(ver.id);
                      setShowVersionSelector(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                      selectedVersion === ver.id
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{ver.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{ver.notes}</div>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-400">
                      {ver.abbreviation}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Language Selector */}
        {showLanguageSelector && (
          <div className="border-t border-slate-800 bg-slate-900/98 p-4 animate-in fade-in duration-150">
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono uppercase text-slate-400">Select Language</span>
                <button
                  onClick={() => setShowLanguageSelector(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      if (lang.code === 'zu') setSelectedVersion('ZULU');
                      if (lang.code === 'af') setSelectedVersion('AFR');
                      if (lang.code === 'en') setSelectedVersion('KJV');
                      setShowLanguageSelector(false);
                    }}
                    className={`p-2.5 rounded-lg border text-xs text-left transition-colors ${
                      selectedLanguage === lang.code
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. In-Bible Search */}
        {isSearching && (
          <div className="border-t border-slate-800 bg-slate-900/95 p-4 animate-in fade-in duration-150">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-teal-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search book, chapter or verse (e.g. John 3:16, Psalm 23, faith)..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={() => {
                    setIsSearching(false);
                    setSearchQuery('');
                  }}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {searchQuery && (
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {searchResults.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      No scripture verses found for &ldquo;{searchQuery}&rdquo;.
                    </p>
                  ) : (
                    searchResults.map((r) => (
                      <button
                        key={`${r.bookId}_${r.chapter}_${r.verse}`}
                        onClick={() => {
                          setSelectedBookId(r.bookId);
                          setSelectedChapter(r.chapter);
                          setActiveVerseNum(r.verse);
                          setIsSearching(false);
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="text-xs font-semibold text-teal-300">
                          {r.bookName} {r.chapter}:{r.verse}
                        </div>
                        <div className="text-xs text-slate-300 line-clamp-1 mt-0.5 group-hover:text-white">
                          {r.text}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Scripture Text Reader */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 pb-16">
        <header className="mb-10 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-1">
            {currentBook.testament === 'OT' ? 'Old Testament' : 'New Testament'} · {selectedVersion}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            {currentBook.name} {selectedChapter}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Tap any verse to highlight, bookmark, take notes, or share</p>
        </header>

        <article className="space-y-4 font-serif text-lg sm:text-xl text-slate-200 leading-relaxed sm:leading-loose select-text">
          {verses.map((verse) => {
            const highlight = getHighlightForVerse(verse.verse);
            const bookmarked = isVerseBookmarked(verse.verse);
            const verseNotes = getNotesForVerse(verse.verse);
            const isSelected = activeVerseNum === verse.verse;

            let highlightStyle = '';
            if (highlight?.color === 'gold') highlightStyle = 'bg-amber-500/25 border-l-2 border-amber-400 pl-2 rounded-r';
            if (highlight?.color === 'teal') highlightStyle = 'bg-teal-500/25 border-l-2 border-teal-400 pl-2 rounded-r';
            if (highlight?.color === 'rose') highlightStyle = 'bg-rose-500/25 border-l-2 border-rose-400 pl-2 rounded-r';
            if (highlight?.color === 'amber') highlightStyle = 'bg-amber-600/30 border-l-2 border-amber-500 pl-2 rounded-r';

            return (
              <div
                key={verse.verse}
                id={`verse-${verse.verse}`}
                onClick={() => setActiveVerseNum(verse.verse === activeVerseNum ? null : verse.verse)}
                className={`relative group cursor-pointer p-1.5 rounded-lg transition-colors ${
                  isSelected ? 'bg-slate-800/80 ring-1 ring-teal-500/40' : 'hover:bg-slate-900/60'
                } ${highlightStyle}`}
              >
                <div className="flex items-baseline gap-2">
                  <sup className="font-sans font-mono text-xs text-teal-400/90 select-none shrink-0 font-medium">
                    {verse.verse}
                  </sup>
                  <span className="flex-1">{verse.text}</span>
                  {bookmarked && (
                    <Bookmark className="h-3.5 w-3.5 text-amber-400 fill-current shrink-0 self-center" />
                  )}
                  {verseNotes.length > 0 && (
                    <span className="h-2 w-2 rounded-full bg-teal-400 shrink-0 self-center" title={`${verseNotes.length} private note(s)`} />
                  )}
                </div>
              </div>
            );
          })}
        </article>

        <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevChapter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Chapter
          </button>

          <span className="text-xs font-mono text-slate-500">
            {currentBook.name} {selectedChapter} / {currentBook.chaptersCount}
          </span>

          <button
            onClick={handleNextChapter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            Next Chapter
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      {/* Selected Verse Context Action Sheet */}
      {activeVerseNum !== null && (
        <div className="fixed bottom-16 lg:bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[580px] z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-teal-400">
                {currentBook.name} {selectedChapter}:{activeVerseNum}
              </span>
              <span className="text-xs text-slate-400">· Personal Scripture Tools</span>
            </div>
            <button
              onClick={() => setActiveVerseNum(null)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Highlighter className="h-3.5 w-3.5" /> Highlight:
              </span>
              {(['gold', 'teal', 'rose', 'amber'] as const).map((color) => {
                const isSelected = getHighlightForVerse(activeVerseNum)?.color === color;
                let bg = 'bg-amber-400';
                if (color === 'teal') bg = 'bg-teal-400';
                if (color === 'rose') bg = 'bg-rose-400';
                if (color === 'amber') bg = 'bg-amber-600';

                return (
                  <button
                    key={color}
                    onClick={() => setVerseHighlight(activeVerseNum, color)}
                    className={`h-6 w-6 rounded-full ${bg} transition-transform flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                    }`}
                    title={`Highlight ${color}`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-slate-950 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => toggleBookmark(activeVerseNum)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isVerseBookmarked(activeVerseNum)
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              {isVerseBookmarked(activeVerseNum) ? 'Saved' : 'Bookmark'}
            </button>

            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isAddingNote
                  ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                  : 'border-slate-800 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Note
            </button>

            <button
              onClick={() => {
                const v = verses.find((item) => item.verse === activeVerseNum);
                if (v) {
                  onOpenShareModal(
                    `${currentBook.name} ${selectedChapter}:${v.verse}`,
                    v.text,
                    selectedVersion
                  );
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold shadow-md transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>

          {(isAddingNote || getNotesForVerse(activeVerseNum).length > 0) && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              {getNotesForVerse(activeVerseNum).map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-lg bg-slate-800/80 mb-2 flex items-start justify-between gap-2"
                >
                  <p className="text-xs text-slate-200 leading-relaxed">{n.noteText}</p>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                    title="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {isAddingNote && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={noteInputText}
                    onChange={(e) => setNoteInputText(e.target.value)}
                    placeholder="Write a private reflection or study note..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                  />
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-semibold hover:bg-teal-400"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
