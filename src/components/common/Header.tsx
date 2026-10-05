import React, { useState } from 'react';
import { Search, Shield, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch
}) => {
  const { currentUser, allUsers, switchUser, isAdminOrSuperAdmin, isLeaderOrAdmin } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

  const activeLive = StorageService.getActiveLiveStream();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'watch', label: 'Watch' },
    { id: 'listen', label: 'Listen' },
    { id: 'live', label: 'Live', isLive: !!activeLive },
    { id: 'prayer', label: 'Prayer' },
    { id: 'events', label: 'Events' },
    { id: 'bible', label: 'Bible' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element Brand Zone */}
          <button
            onClick={() => onTabChange('home')}
            className="group flex items-center gap-2 text-left focus:outline-none"
            aria-label="Kingdom Connect Home"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-100 transition-colors group-hover:text-teal-400">
              Kingdom Connect
            </span>
          </button>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-300">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative py-1 whitespace-nowrap transition-colors flex items-center gap-1.5 focus:outline-none ${
                    isActive ? 'text-teal-400 font-semibold' : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                  {item.isLive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Desktop More dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowMobileMore(!showMobileMore)}
                className={`flex items-center gap-1 py-1 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none ${
                  ['ministries', 'connections', 'gallery', 'plans', 'profile', 'admin'].includes(
                    currentTab
                  )
                    ? 'text-teal-400 font-semibold'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                More
                <ChevronDown className="h-4 w-4" />
              </button>

              {showMobileMore && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setShowMobileMore(false)}
                >
                  <button
                    onClick={() => onTabChange('ministries')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    Ministries
                  </button>
                  <button
                    onClick={() => onTabChange('connections')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    Connections & Small Groups
                  </button>
                  <button
                    onClick={() => onTabChange('gallery')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    Gallery & Moments
                  </button>
                  <button
                    onClick={() => onTabChange('plans')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    Bible Reading Plans
                  </button>
                  <div className="my-1 border-t border-slate-800"></div>
                  {isLeaderOrAdmin && (
                    <button
                      onClick={() => onTabChange('admin')}
                      className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Administration
                    </button>
                  )}
                  <button
                    onClick={() => onTabChange('profile')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    My Profile & Journal
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions + Authenticated Identity & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors focus:outline-none"
              aria-label="Search Kingdom Connect"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Authenticated Identity Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 transition-all text-left focus:outline-none"
                title="Verified Backend User Identity"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-teal-500/40"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-slate-200 leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-400 uppercase tracking-wider font-mono font-semibold">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-200">Backend Verified Identities</p>
                    <p className="text-[11px] text-slate-400">
                      Login as different church roles with server-authenticated session tokens:
                    </p>
                  </div>
                  <div className="py-1">
                    {allUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setShowRoleSwitcher(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                            isCurrent
                              ? 'bg-teal-500/10 text-teal-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-left truncate">
                            <img
                              src={u.avatar}
                              alt=""
                              className="h-5 w-5 rounded-full object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <span className="block truncate">{u.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{u.email}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded shrink-0 ${
                            u.role === 'SUPER_ADMIN' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            u.role === 'ADMIN' ? 'bg-teal-950 text-teal-300 border border-teal-800' :
                            u.role === 'LEADER' ? 'bg-purple-950 text-purple-300' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-800 pt-2 mt-1 flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        onTabChange('profile');
                      }}
                      className="text-xs text-slate-400 hover:text-teal-400 py-1 transition-colors"
                    >
                      Profile Settings
                    </button>
                    {isLeaderOrAdmin && (
                      <button
                        onClick={() => {
                          setShowRoleSwitcher(false);
                          onTabChange('admin');
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 py-1 flex items-center gap-1 transition-colors"
                      >
                        <Shield className="h-3 w-3" />
                        Admin Portal
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {(showRoleSwitcher || showMobileMore) && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => {
            setShowRoleSwitcher(false);
            setShowMobileMore(false);
          }}
        />
      )}
    </>
  );
};
