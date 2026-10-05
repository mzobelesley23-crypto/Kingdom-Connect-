import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { AudioMiniPlayer } from './components/common/AudioMiniPlayer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ShareScriptureModal } from './components/common/ShareScriptureModal';
import { VideoModal } from './components/watch/VideoModal';

// Views
import { HomeView } from './components/home/HomeView';
import { WatchView } from './components/watch/WatchView';
import { ListenView } from './components/listen/ListenView';
import { LiveView } from './components/live/LiveView';
import { PrayerView } from './components/prayer/PrayerView';
import { EventsView } from './components/events/EventsView';
import { BibleView } from './components/bible/BibleView';
import { ReadingPlansView } from './components/bible/ReadingPlansView';
import { MinistriesView } from './components/ministries/MinistriesView';
import { ConnectionsView } from './components/connections/ConnectionsView';
import { GalleryView } from './components/gallery/GalleryView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SermonVideo } from './types';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Video Modal State
  const [activeVideo, setActiveVideo] = useState<SermonVideo | null>(null);

  // Share Scripture Modal State
  const [shareData, setShareData] = useState<{
    isOpen: boolean;
    reference: string;
    text: string;
    version: string;
  }>({
    isOpen: false,
    reference: '',
    text: '',
    version: 'KJV'
  });

  // Deep linking Bible state
  const [bibleNav, setBibleNav] = useState<{
    bookId: string;
    chapter: number;
    verse?: number;
  }>({
    bookId: 'PSA',
    chapter: 23,
    verse: 1
  });

  const handleOpenShare = (reference: string, text: string, version: string = 'KJV') => {
    setShareData({
      isOpen: true,
      reference,
      text,
      version
    });
  };

  const handleNavigate = (tab: string, meta?: any) => {
    if (tab === 'bible' && meta) {
      if (meta.bookId) setBibleNav({ bookId: meta.bookId, chapter: meta.chapter || 1, verse: meta.verse });
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToBible = (bookId: string, chapter: number, verse?: number) => {
    setBibleNav({ bookId, chapter, verse });
    setCurrentTab('bible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Primary Top Header following the one-row, 3-zone contract */}
      <Header
        currentTab={currentTab}
        onTabChange={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenShareModal={handleOpenShare}
            onSelectVideoToPlay={(video) => setActiveVideo(video)}
          />
        )}

        {currentTab === 'watch' && (
          <WatchView
            onSelectVideoToPlay={(video) => setActiveVideo(video)}
            onOpenShareModal={handleOpenShare}
          />
        )}

        {currentTab === 'listen' && (
          <ListenView onOpenShareModal={handleOpenShare} />
        )}

        {currentTab === 'live' && (
          <LiveView
            onSelectVideoToPlay={(video) => setActiveVideo(video)}
            onOpenShareModal={handleOpenShare}
          />
        )}

        {currentTab === 'prayer' && <PrayerView />}

        {currentTab === 'events' && (
          <EventsView onOpenShareModal={handleOpenShare} />
        )}

        {currentTab === 'bible' && (
          <BibleView
            initialBookId={bibleNav.bookId}
            initialChapter={bibleNav.chapter}
            initialVerse={bibleNav.verse}
            onOpenShareModal={handleOpenShare}
            onOpenPlans={() => setCurrentTab('plans')}
          />
        )}

        {currentTab === 'plans' && (
          <ReadingPlansView
            onBackToBible={() => setCurrentTab('bible')}
            onNavigateToScripture={handleNavigateToBible}
          />
        )}

        {currentTab === 'ministries' && <MinistriesView />}

        {currentTab === 'connections' && <ConnectionsView />}

        {currentTab === 'gallery' && (
          <GalleryView onOpenShareModal={handleOpenShare} />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            onNavigateToBible={handleNavigateToBible}
            onNavigateToPlans={() => setCurrentTab('plans')}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Audio Mini-Player (persistent across route changes) */}
      <AudioMiniPlayer />

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <BottomNav currentTab={currentTab} onTabChange={handleNavigate} />

      {/* Global Privacy-Compliant Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Share Scripture & Content Card Modal */}
      <ShareScriptureModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData((prev) => ({ ...prev, isOpen: false }))}
        reference={shareData.reference}
        text={shareData.text}
        version={shareData.version}
      />

      {/* Full Video Modal */}
      <VideoModal
        sermon={activeVideo}
        onClose={() => setActiveVideo(null)}
        onOpenShareModal={handleOpenShare}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <AppContent />
      </AudioPlayerProvider>
    </AuthProvider>
  );
}
