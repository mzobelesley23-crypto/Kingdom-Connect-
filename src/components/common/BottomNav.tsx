import React, { useState } from 'react';
import {
  Home,
  Tv,
  BookOpen,
  Calendar,
  MoreHorizontal,
  Radio,
  HeartHandshake,
  Users,
  Compass,
  Image,
  Shield,
  User as UserIcon,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { isLeaderOrAdmin } = useAuth();
  const activeLive = StorageService.getActiveLiveStream();

  const handleSelectTab = (tab: string) => {
    onTabChange(tab);
    setIsMoreOpen(false);
  };

  return (
    <>
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-900 border-t border-slate-800 rounded-t-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-100">All Destinations</h3>
                <p className="text-xs text-slate-400">Kingdom Connect Community</p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pb-6">
              <button
                onClick={() => handleSelectTab('live')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'live'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="relative p-2 rounded-lg bg-slate-800 text-teal-400">
                  <Radio className="h-4 w-4" />
                  {activeLive && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">Live Services</div>
                  <div className="text-[11px] text-slate-400">
                    {activeLive ? 'Streaming now' : 'Schedule & replays'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('prayer')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'prayer'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Prayer</div>
                  <div className="text-[11px] text-slate-400">Confidential pastoral care</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('ministries')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'ministries'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Ministries</div>
                  <div className="text-[11px] text-slate-400">Serve & grow</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('connections')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'connections'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Connections</div>
                  <div className="text-[11px] text-slate-400">Small groups & fellowship</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('gallery')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'gallery'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                  <Image className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Gallery</div>
                  <div className="text-[11px] text-slate-400">Moments & albums</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('plans')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'plans'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Reading Plans</div>
                  <div className="text-[11px] text-slate-400">Daily guided Scripture</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('profile')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  currentTab === 'profile'
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">My Profile</div>
                  <div className="text-[11px] text-slate-400">Notes, bookmarks, RSVPs</div>
                </div>
              </button>

              {isLeaderOrAdmin && (
                <button
                  onClick={() => handleSelectTab('admin')}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                    currentTab === 'admin'
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : 'border-amber-900/40 bg-amber-950/20 text-amber-200 hover:bg-amber-950/40'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-amber-900/40 text-amber-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Administration</div>
                    <div className="text-[11px] text-amber-400/80">Manage portal & care</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 pb-safe">
        <div className="grid grid-cols-5 h-16 items-center">
          <button
            onClick={() => handleSelectTab('home')}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
              currentTab === 'home' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
          </button>

          <button
            onClick={() => handleSelectTab('watch')}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
              currentTab === 'watch' || currentTab === 'listen'
                ? 'text-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Watch</span>
          </button>

          <button
            onClick={() => handleSelectTab('bible')}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
              currentTab === 'bible' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Bible</span>
          </button>

          <button
            onClick={() => handleSelectTab('events')}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
              currentTab === 'events' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Events</span>
          </button>

          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative ${
              isMoreOpen ||
              ['live', 'prayer', 'ministries', 'connections', 'gallery', 'plans', 'profile', 'admin'].includes(
                currentTab
              )
                ? 'text-teal-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">More</span>
            {activeLive && (
              <span className="absolute top-2 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
