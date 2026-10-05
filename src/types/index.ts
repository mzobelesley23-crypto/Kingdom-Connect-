export type UserRole = 'MEMBER' | 'LEADER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  languagePref: string;
  notificationPrefs: {
    liveAlerts: boolean;
    eventReminders: boolean;
    newContent: boolean;
    dailyScripture: boolean;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetRecord: string;
  targetType: string;
  timestamp: string;
  result: 'allowed' | 'denied';
  ipAddress?: string;
  details?: string;
}

export type LiveStreamStatus = 'live' | 'upcoming' | 'ended';

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  speaker: string;
  serviceInfo: string;
  thumbnail: string;
  streamUrl: string;
  status: LiveStreamStatus;
  scheduledStartTime: string;
  scheduledEndTime: string;
  replayVideoId?: string;
  viewerCount?: number;
  category: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface SermonVideo {
  id: string;
  title: string;
  speaker: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  date: string;
  scriptureReferences: string[];
  category: string;
  tags: string[];
  status: ContentStatus;
  isFeatured?: boolean;
}

export interface AudioMessage {
  id: string;
  title: string;
  speaker: string;
  description: string;
  artwork: string;
  audioUrl: string;
  duration: string;
  durationSeconds: number;
  date: string;
  scriptureReferences: string[];
  category: string;
  status: ContentStatus;
  isFeatured?: boolean;
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  chaptersCount: number;
  abbreviation: string;
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleHighlight {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  color: 'gold' | 'teal' | 'rose' | 'amber';
  createdAt: string;
}

export interface BibleNote {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse?: number;
  noteText: string;
  createdAt: string;
  updatedAt: string;
}

export interface BibleBookmark {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse?: number;
  label?: string;
  createdAt: string;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  scriptureRefs: string[];
  passageText: string;
  reflection: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: string;
  coverImage?: string;
  days: ReadingPlanDay[];
}

export interface UserReadingPlanProgress {
  userId: string;
  planId: string;
  completedDays: number[];
  startedAt: string;
}

export type PrayerCategory =
  | 'healing'
  | 'family'
  | 'guidance'
  | 'salvation'
  | 'thanksgiving'
  | 'provision'
  | 'other';

export type PrayerStatus = 'received' | 'praying' | 'answered';

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  request: string;
  category: PrayerCategory;
  status: PrayerStatus;
  pastoralNotes?: string;
  createdAt: string;
  isPrivate: boolean; // true = pastoral care only
}

export type EventCategory = 'worship' | 'community' | 'outreach' | 'youth' | 'prayer' | 'conference';

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isOnline: boolean;
  onlineLink?: string;
  organizer: string;
  category: EventCategory;
  capacity?: number;
  rsvps: string[];
  status: ContentStatus;
}

export interface Ministry {
  id: string;
  name: string;
  image: string;
  description: string;
  leader: string;
  category: string;
  meetingSchedule: string;
  contactEmail: string;
  membersCount: number;
  status: 'active' | 'inactive';
}

export interface ConnectionGroup {
  id: string;
  name: string;
  image: string;
  description: string;
  leader: string;
  location: string;
  meetingSchedule: string;
  isOnline: boolean;
  category: 'small_group' | 'young_adults' | 'men' | 'women' | 'professionals' | 'bible_study';
  memberCount: number;
  contactEmail: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  images: {
    id: string;
    url: string;
    caption: string;
  }[];
}

export interface DailyScripture {
  id: string;
  reference: string;
  text: string;
  reflection: string;
  prayer?: string;
  theme?: string;
  date: string;
  publishDate: string;
  imageUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'important' | 'general';
  publishDate: string;
  expiryDate: string;
  isPublished: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'live' | 'event' | 'sermon' | 'prayer' | 'announcement';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}
