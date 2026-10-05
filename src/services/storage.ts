import {
  BibleHighlight,
  BibleNote,
  BibleBookmark,
  UserReadingPlanProgress,
  ChurchEvent,
  Ministry,
  ConnectionGroup,
  GalleryAlbum,
  DailyScripture,
  Announcement,
  SermonVideo,
  AudioMessage,
  LiveStream
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_MINISTRIES,
  INITIAL_CONNECTIONS,
  INITIAL_GALLERY_ALBUMS,
  INITIAL_DAILY_SCRIPTURE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SERMONS,
  INITIAL_AUDIO_MESSAGES,
  INITIAL_LIVESTREAMS
} from '../data/initialData';

const KEYS = {
  BIBLE_HIGHLIGHTS: 'kc_bible_highlights',
  BIBLE_NOTES: 'kc_bible_notes',
  BIBLE_BOOKMARKS: 'kc_bible_bookmarks',
  READING_PLANS_PROGRESS: 'kc_reading_plan_progress',
  EVENTS: 'kc_events',
  MINISTRIES: 'kc_ministries',
  CONNECTIONS: 'kc_connections',
  GALLERY: 'kc_gallery',
  DAILY_SCRIPTURE: 'kc_daily_scripture',
  ANNOUNCEMENTS: 'kc_announcements',
  SERMONS: 'kc_sermons',
  AUDIO_MESSAGES: 'kc_audio_messages',
  LIVESTREAMS: 'kc_livestreams'
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write key ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Sermons
  getSermons(): SermonVideo[] {
    return safeGet<SermonVideo[]>(KEYS.SERMONS, INITIAL_SERMONS);
  },

  // Audio
  getAudioMessages(): AudioMessage[] {
    return safeGet<AudioMessage[]>(KEYS.AUDIO_MESSAGES, INITIAL_AUDIO_MESSAGES);
  },

  saveAudioMessage(audio: AudioMessage): void {
    const items = this.getAudioMessages();
    const idx = items.findIndex((a) => a.id === audio.id);
    if (idx >= 0) items[idx] = audio;
    else items.unshift(audio);
    safeSet(KEYS.AUDIO_MESSAGES, items);
  },

  // Livestreams
  getLiveStreams(): LiveStream[] {
    return safeGet<LiveStream[]>(KEYS.LIVESTREAMS, INITIAL_LIVESTREAMS);
  },

  getActiveLiveStream(): LiveStream | null {
    const streams = this.getLiveStreams();
    return streams.find((s) => s.status === 'live') || null;
  },

  saveLiveStream(stream: LiveStream): void {
    const streams = this.getLiveStreams();
    const idx = streams.findIndex((s) => s.id === stream.id);
    if (idx >= 0) streams[idx] = stream;
    else streams.unshift(stream);
    safeSet(KEYS.LIVESTREAMS, streams);
  },

  // Events
  getEvents(): ChurchEvent[] {
    return safeGet<ChurchEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
  },

  saveEvent(event: ChurchEvent): void {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx >= 0) events[idx] = event;
    else events.unshift(event);
    safeSet(KEYS.EVENTS, events);
  },

  toggleEventRSVP(eventId: string, userId: string): boolean {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) return false;

    const hasRSVP = event.rsvps.includes(userId);
    if (hasRSVP) {
      event.rsvps = event.rsvps.filter((id) => id !== userId);
    } else {
      event.rsvps.push(userId);
    }
    this.saveEvent(event);
    return !hasRSVP;
  },

  // Ministries
  getMinistries(): Ministry[] {
    return safeGet<Ministry[]>(KEYS.MINISTRIES, INITIAL_MINISTRIES);
  },

  // Connections
  getConnections(): ConnectionGroup[] {
    return safeGet<ConnectionGroup[]>(KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
  },

  // Gallery
  getGalleryAlbums(): GalleryAlbum[] {
    return safeGet<GalleryAlbum[]>(KEYS.GALLERY, INITIAL_GALLERY_ALBUMS);
  },

  // Daily scripture
  getDailyScripture(): DailyScripture {
    return safeGet<DailyScripture>(KEYS.DAILY_SCRIPTURE, INITIAL_DAILY_SCRIPTURE);
  },

  saveDailyScripture(scripture: DailyScripture): void {
    safeSet(KEYS.DAILY_SCRIPTURE, scripture);
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return safeGet<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  // Bible Highlights (Private to user)
  getUserHighlights(userId: string): BibleHighlight[] {
    const all = safeGet<BibleHighlight[]>(KEYS.BIBLE_HIGHLIGHTS, []);
    return all.filter((h) => h.userId === userId);
  },

  saveHighlight(highlight: BibleHighlight): void {
    const all = safeGet<BibleHighlight[]>(KEYS.BIBLE_HIGHLIGHTS, []);
    const filtered = all.filter(
      (h) => !(h.userId === highlight.userId && h.book === highlight.book && h.chapter === highlight.chapter && h.verse === highlight.verse)
    );
    filtered.push(highlight);
    safeSet(KEYS.BIBLE_HIGHLIGHTS, filtered);
  },

  removeHighlight(userId: string, book: string, chapter: number, verse: number): void {
    const all = safeGet<BibleHighlight[]>(KEYS.BIBLE_HIGHLIGHTS, []);
    const filtered = all.filter(
      (h) => !(h.userId === userId && h.book === book && h.chapter === chapter && h.verse === verse)
    );
    safeSet(KEYS.BIBLE_HIGHLIGHTS, filtered);
  },

  // Bible Notes (Private to user)
  getUserNotes(userId: string): BibleNote[] {
    const all = safeGet<BibleNote[]>(KEYS.BIBLE_NOTES, []);
    return all.filter((n) => n.userId === userId);
  },

  saveNote(note: BibleNote): void {
    const all = safeGet<BibleNote[]>(KEYS.BIBLE_NOTES, []);
    const idx = all.findIndex((n) => n.id === note.id);
    if (idx >= 0) all[idx] = note;
    else all.unshift(note);
    safeSet(KEYS.BIBLE_NOTES, all);
  },

  deleteNote(noteId: string, userId: string): void {
    const all = safeGet<BibleNote[]>(KEYS.BIBLE_NOTES, []);
    const filtered = all.filter((n) => !(n.id === noteId && n.userId === userId));
    safeSet(KEYS.BIBLE_NOTES, filtered);
  },

  // Bible Bookmarks (Private to user)
  getUserBookmarks(userId: string): BibleBookmark[] {
    const all = safeGet<BibleBookmark[]>(KEYS.BIBLE_BOOKMARKS, []);
    return all.filter((b) => b.userId === userId);
  },

  saveBookmark(bookmark: BibleBookmark): void {
    const all = safeGet<BibleBookmark[]>(KEYS.BIBLE_BOOKMARKS, []);
    const idx = all.findIndex((b) => b.id === bookmark.id);
    if (idx >= 0) all[idx] = bookmark;
    else all.unshift(bookmark);
    safeSet(KEYS.BIBLE_BOOKMARKS, all);
  },

  removeBookmark(bookmarkId: string, userId: string): void {
    const all = safeGet<BibleBookmark[]>(KEYS.BIBLE_BOOKMARKS, []);
    const filtered = all.filter((b) => !(b.id === bookmarkId && b.userId === userId));
    safeSet(KEYS.BIBLE_BOOKMARKS, filtered);
  },

  // Reading Plans
  getUserReadingPlanProgress(userId: string, planId: string): UserReadingPlanProgress {
    const all = safeGet<UserReadingPlanProgress[]>(KEYS.READING_PLANS_PROGRESS, []);
    const found = all.find((p) => p.userId === userId && p.planId === planId);
    if (found) return found;

    return {
      userId,
      planId,
      completedDays: [],
      startedAt: new Date().toISOString()
    };
  },

  toggleReadingPlanDay(userId: string, planId: string, day: number): number[] {
    const all = safeGet<UserReadingPlanProgress[]>(KEYS.READING_PLANS_PROGRESS, []);
    let item = all.find((p) => p.userId === userId && p.planId === planId);
    if (!item) {
      item = {
        userId,
        planId,
        completedDays: [day],
        startedAt: new Date().toISOString()
      };
      all.push(item);
    } else {
      if (item.completedDays.includes(day)) {
        item.completedDays = item.completedDays.filter((d) => d !== day);
      } else {
        item.completedDays.push(day);
      }
    }
    safeSet(KEYS.READING_PLANS_PROGRESS, all);
    return item.completedDays;
  }
};
