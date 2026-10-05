import {
  User,
  LiveStream,
  SermonVideo,
  AudioMessage,
  ChurchEvent,
  Ministry,
  ConnectionGroup,
  GalleryAlbum,
  DailyScripture,
  Announcement,
  PrayerRequest
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_member',
    name: 'Sarah Jenkins',
    email: 'sarah.j@kingdomconnect.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    role: 'MEMBER',
    languagePref: 'en',
    notificationPrefs: {
      liveAlerts: true,
      eventReminders: true,
      newContent: true,
      dailyScripture: true
    },
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'user_pastor',
    name: 'Pastor David Mthethwa',
    email: 'pastor.david@kingdomconnect.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    role: 'LEADER',
    languagePref: 'en',
    notificationPrefs: {
      liveAlerts: true,
      eventReminders: true,
      newContent: true,
      dailyScripture: true
    },
    createdAt: '2025-10-01T08:00:00.000Z'
  },
  {
    id: 'user_admin',
    name: 'Grace Ndlovu',
    email: 'grace.admin@kingdomconnect.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'ADMIN',
    languagePref: 'en',
    notificationPrefs: {
      liveAlerts: true,
      eventReminders: true,
      newContent: true,
      dailyScripture: true
    },
    createdAt: '2025-08-12T08:00:00.000Z'
  },
  {
    id: 'user_superadmin',
    name: 'Michael Khumalo',
    email: 'michael.k@kingdomconnect.org',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    role: 'SUPER_ADMIN',
    languagePref: 'en',
    notificationPrefs: {
      liveAlerts: true,
      eventReminders: true,
      newContent: true,
      dailyScripture: true
    },
    createdAt: '2025-06-01T08:00:00.000Z'
  }
];

export const INITIAL_LIVESTREAMS: LiveStream[] = [
  {
    id: 'live_001',
    title: 'Sunday Morning Worship & Word Service',
    description: 'Join us live as Pastor David Mthethwa preaches on "Walking in Kingdom Authority and Truth".',
    speaker: 'Pastor David Mthethwa',
    serviceInfo: 'Sunday Main Celebration · 09:30 AM SAST',
    thumbnail: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    status: 'ended',
    scheduledStartTime: '2026-10-04T09:30:00.000Z',
    scheduledEndTime: '2026-10-04T11:30:00.000Z',
    replayVideoId: 'sermon_001',
    viewerCount: 420,
    category: 'Sunday Service'
  },
  {
    id: 'live_002',
    title: 'Midweek Believers School & Prayer Broadcast',
    description: 'An in-depth verse-by-verse exposition of Romans 8 and corporate prayer for our communities.',
    speaker: 'Elder Grace Ndlovu',
    serviceInfo: 'Wednesday Night Bible School · 19:00 SAST',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    status: 'upcoming',
    scheduledStartTime: '2026-10-07T19:00:00.000Z',
    scheduledEndTime: '2026-10-07T20:30:00.000Z',
    viewerCount: 0,
    category: 'Midweek Teaching'
  }
];

export const INITIAL_SERMONS: SermonVideo[] = [
  {
    id: 'sermon_001',
    title: 'Walking in Kingdom Authority and Truth',
    speaker: 'Pastor David Mthethwa',
    description: 'A biblical examination of spiritual warfare, the whole armor of God, and standing firm in Christ during turbulent times.',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '48:20',
    date: '2026-09-27',
    scriptureReferences: ['Ephesians 6:10-18', 'Luke 10:19', '2 Corinthians 10:4-5'],
    category: 'Sunday Sermon',
    tags: ['Authority', 'Spiritual Warfare', 'Faith', 'Victory'],
    status: 'published',
    isFeatured: true
  },
  {
    id: 'sermon_002',
    title: 'The Unshakeable Covenant of Grace',
    speaker: 'Pastor David Mthethwa',
    description: 'Discovering why nothing in life or death can sever believers from the eternal love of God in Christ Jesus.',
    thumbnail: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '52:10',
    date: '2026-09-20',
    scriptureReferences: ['Romans 8:28-39', 'Hebrews 10:19-23'],
    category: 'Sunday Sermon',
    tags: ['Grace', 'Assurance', 'Salvation', 'Covenant'],
    status: 'published'
  }
];

export const INITIAL_AUDIO_MESSAGES: AudioMessage[] = [
  {
    id: 'audio_001',
    title: 'Abiding in the Secret Place: Psalm 91',
    speaker: 'Pastor David Mthethwa',
    description: 'An acoustic meditative teaching on finding refuge, peace, and angelic protection under the shadow of the Most High.',
    artwork: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_5674468-lq.mp3',
    duration: '31:18',
    durationSeconds: 1878,
    date: '2026-09-28',
    scriptureReferences: ['Psalm 91:1-16'],
    category: 'Meditation & Word',
    status: 'published',
    isFeatured: true
  }
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: 'event_001',
    title: 'Sunday Celebration Worship Gathering',
    description: 'Join the family of God for vibrant congregational worship, corporate prayer, and an inspiring sermon from the Word of God.',
    image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-04',
    startTime: '09:30',
    endTime: '11:45',
    location: 'Main Sanctuary & Livestream',
    isOnline: false,
    organizer: 'Pastoral Leadership Team',
    category: 'worship',
    capacity: 650,
    rsvps: ['user_member', 'user_pastor'],
    status: 'published'
  },
  {
    id: 'event_002',
    title: 'City Compassion Food & Care Distribution',
    description: 'Mobilizing volunteers to prepare and distribute 500 grocery hampers and warm meals to vulnerable families across the metro.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-10',
    startTime: '08:30',
    endTime: '13:00',
    location: 'Kingdom Outreach Hub, 14 De Villiers St',
    isOnline: false,
    organizer: 'Kingdom Outreach Ministry',
    category: 'outreach',
    capacity: 60,
    rsvps: ['user_member'],
    status: 'published'
  }
];

export const INITIAL_MINISTRIES: Ministry[] = [
  {
    id: 'min_outreach',
    name: 'Kingdom Outreach & City Compassion',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    description: 'Reaching into shelters, hospitals, schools, and prisons with tangible humanitarian relief, clothing, and the transformative Gospel.',
    leader: 'Sipho Moloi',
    category: 'Missions & Service',
    meetingSchedule: 'Every 2nd Saturday 08:30',
    contactEmail: 'outreach@kingdomconnect.org',
    membersCount: 84,
    status: 'active'
  },
  {
    id: 'min_worship',
    name: 'Worship & Creative Arts',
    image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
    description: 'Cultivating authentic, Spirit-led congregational worship through vocalists, musicians, sound engineering, and lighting production.',
    leader: 'Thandi Nkosi',
    category: 'Worship Arts',
    meetingSchedule: 'Thursdays 18:30 (Rehearsal)',
    contactEmail: 'worship@kingdomconnect.org',
    membersCount: 42,
    status: 'active'
  }
];

export const INITIAL_CONNECTIONS: ConnectionGroup[] = [
  {
    id: 'conn_001',
    name: 'Sandton Young Professionals Fellowship',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    description: 'Weekly dinner, Bible study, and professional mentorship navigating Christian conviction in modern corporate careers.',
    leader: 'Kabelo & Lerato Tau',
    location: 'Sandton Hub / Hybrid',
    meetingSchedule: 'Tuesdays at 19:00',
    isOnline: false,
    category: 'professionals',
    memberCount: 22,
    contactEmail: 'sandton.group@kingdomconnect.org'
  },
  {
    id: 'conn_002',
    name: 'Rosebank Family & Couples Life Group',
    image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
    description: 'A warm community of young families and married couples sharing parenting insights, prayer, and hospitality in Christ.',
    leader: 'David & Sarah M.',
    location: 'Rosebank, Home Gathering',
    meetingSchedule: 'Thursdays at 18:30',
    isOnline: false,
    category: 'small_group',
    memberCount: 16,
    contactEmail: 'rosebank.families@kingdomconnect.org'
  }
];

export const INITIAL_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: 'album_001',
    title: 'Sunday Morning Celebration & Baptisms',
    description: 'Memories of baptism celebrations and heartfelt worship in the sanctuary.',
    date: 'September 2026',
    coverImage: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
    images: [
      {
        id: 'img_1',
        url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
        caption: 'Congregational worship in unity and reverence.'
      },
      {
        id: 'img_2',
        url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pastor David proclaiming the Word of God.'
      }
    ]
  }
];

export const INITIAL_DAILY_SCRIPTURE: DailyScripture = {
  id: 'daily_2026_10_05',
  reference: 'Proverbs 3:5-6',
  text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
  reflection: 'Surrendering our own calculations to God is not weakness—it is supreme wisdom. Whatever decision, crossroad, or responsibility lies before you today, acknowledge His sovereignty and rest in His guiding hand.',
  prayer: 'Heavenly Father, I yield my desires, worries, and calculations to You today. Calm my restless heart, guide my steps in righteousness, and grant me the grace to trust Your unwavering goodness. In Jesus’ name, Amen.',
  theme: 'Surrender & Divine Direction',
  date: '2026-10-05',
  publishDate: '2026-10-05T05:00:00.000Z',
  imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80'
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_001',
    title: 'Corporate Fast & Prayer Week Commences Monday',
    content: 'We invite the entire Kingdom Connect family to join us in 5 days of corporate prayer and fasting as we seek God for renewal and community impact. Daily prayer watches at 06:00 and 19:00.',
    priority: 'urgent',
    publishDate: '2026-09-30',
    expiryDate: '2026-10-15',
    isPublished: true
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'prayer_001',
    userId: 'user_member',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@kingdomconnect.org',
    title: 'Complete Healing for My Mother in Hospital',
    request: 'Please stand with our family in prayer for my mother Elizabeth who is recovering from surgery. We are asking the Lord for swift restoration and peace.',
    category: 'healing',
    status: 'praying',
    pastoralNotes: 'Pastoral team visited Elizabeth on Tuesday. Continuing in faith.',
    createdAt: '2026-10-01T14:30:00.000Z',
    isPrivate: true
  },
  {
    id: 'prayer_002',
    userId: 'user_member',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@kingdomconnect.org',
    title: 'Guidance Concerning Job Transition',
    request: 'Seeking God\'s clear direction regarding a promotion and career relocation decision. May His will be established.',
    category: 'guidance',
    status: 'received',
    createdAt: '2026-10-02T09:15:00.000Z',
    isPrivate: true
  },
  {
    id: 'prayer_003',
    userId: 'user_david_other',
    userName: 'David Ndlovu',
    userEmail: 'david.n@kingdomconnect.org',
    title: 'Family Financial Breakthrough & Provision',
    request: 'Standing in faith for divine provision and open doors for our family business during this season.',
    category: 'provision',
    status: 'praying',
    pastoralNotes: 'Assigned to elder fellowship team.',
    createdAt: '2026-10-03T11:00:00.000Z',
    isPrivate: true
  }
];
