import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Check,
  Search,
  Share2,
  X,
  ExternalLink,
  Download
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { ChurchEvent } from '../../types';

interface EventsViewProps {
  onOpenShareModal: (reference: string, text: string, version: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ onOpenShareModal }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<ChurchEvent[]>(() => StorageService.getEvents());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);

  const categories = [
    { id: 'all', label: 'All Gatherings' },
    { id: 'Worship', label: 'Worship & Prayer' },
    { id: 'Conference', label: 'Conferences' },
    { id: 'Community', label: 'Community & Fellowship' },
    { id: 'Outreach', label: 'Missions & Outreach' }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesDesc = e.description.toLowerCase().includes(q);
        const matchesLoc = e.location.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesLoc;
      }
      return true;
    });
  }, [events, selectedCategory, searchQuery]);

  const handleToggleRSVP = (eventId: string) => {
    const isNowRSVPed = StorageService.toggleEventRSVP(eventId, currentUser.id);
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextRsvps = isNowRSVPed
            ? [...ev.rsvps, currentUser.id]
            : ev.rsvps.filter((id) => id !== currentUser.id);
          return { ...ev, rsvps: nextRsvps };
        }
        return ev;
      })
    );

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              rsvps: isNowRSVPed
                ? [...prev.rsvps, currentUser.id]
                : prev.rsvps.filter((id) => id !== currentUser.id)
            }
          : null
      );
    }
  };

  const handleExportICS = (event: ChurchEvent) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kingdom Connect//Gatherings//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `DTSTART:${event.date.replace(/-/g, '')}T090000Z`,
      `DTEND:${event.date.replace(/-/g, '')}T120000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wider uppercase">
            <Calendar className="h-4 w-4" />
            <span>Gatherings & Assemblies</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-slate-100">
            Church Gatherings & Conferences
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            Join the fellowship of believers in regional summits, weekly prayer encounters, and outreach initiatives.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === c.id
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gatherings or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="font-serif text-lg font-bold text-slate-200">No Gatherings Found</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your category selection or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const hasRSVP = ev.rsvps.includes(currentUser.id);
              return (
                <div
                  key={ev.id}
                  className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all duration-200 shadow-lg"
                >
                  <div
                    className="relative aspect-video w-full bg-slate-800 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-teal-400 border border-slate-700">
                        {ev.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-teal-400" />
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-400" />
                        {ev.startTime}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => setSelectedEvent(ev)}
                        className="font-serif font-bold text-lg text-slate-100 hover:text-teal-300 cursor-pointer line-clamp-1 transition-colors"
                      >
                        {ev.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                        {ev.organizer && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">Organizer: {ev.organizer}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleToggleRSVP(ev.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          hasRSVP
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                            : 'bg-slate-800 text-slate-200 hover:bg-teal-600 hover:text-white'
                        }`}
                      >
                        {hasRSVP ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-teal-400" />
                            <span>RSVP Confirmed</span>
                          </>
                        ) : (
                          <span>RSVP Attendance</span>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-video w-full bg-slate-800 shrink-0">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {selectedEvent.category}
                </span>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-teal-400" />
                    <span>Date</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-100">{selectedEvent.date}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock className="h-3.5 w-3.5 text-teal-400" />
                    <span>Time</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-100">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Users className="h-3.5 w-3.5 text-teal-400" />
                    <span>Confirmed RSVPs</span>
                  </div>
                  <p className="text-sm font-semibold text-teal-300">
                    {selectedEvent.rsvps.length} attendees
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Location & Venue
                </h4>
                <div className="flex items-start gap-2 text-sm text-slate-200 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <MapPin className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Overview & Ministry Purpose
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.organizer && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Ministry Organizer
                  </h4>
                  <p className="text-sm font-medium text-slate-200">{selectedEvent.organizer}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleToggleRSVP(selectedEvent.id)}
                  className={`py-2.5 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                    selectedEvent.rsvps.includes(currentUser.id)
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-teal-600 text-white hover:bg-teal-500'
                  }`}
                >
                  {selectedEvent.rsvps.includes(currentUser.id) ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <span>Register / RSVP Now</span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportICS(selectedEvent)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Export to Apple/Google/Outlook Calendar (.ics)"
                  >
                    <Download className="h-4 w-4" />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenShareModal(
                        `${selectedEvent.title} - ${selectedEvent.date}`,
                        `Join us for ${selectedEvent.title} on ${selectedEvent.date} at ${selectedEvent.location}.`,
                        'Gathering'
                      );
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                    title="Share gathering"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
