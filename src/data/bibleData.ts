import { BibleBook, ReadingPlan } from '../types';

export interface BibleVersionInfo {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  isPublicDomain: boolean;
  notes: string;
}

export const AVAILABLE_VERSIONS: BibleVersionInfo[] = [
  {
    id: 'KJV',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English',
    isPublicDomain: true,
    notes: 'Public domain worldwide. Reverent classical prose.'
  },
  {
    id: 'WEB',
    name: 'World English Bible',
    abbreviation: 'WEB',
    language: 'English',
    isPublicDomain: true,
    notes: 'Public domain modern English translation based on ASV & Byzantine text.'
  },
  {
    id: 'BBE',
    name: 'Bible in Basic English',
    abbreviation: 'BBE',
    language: 'English',
    isPublicDomain: true,
    notes: 'Simple, accessible vocabulary.'
  },
  {
    id: 'ZULU',
    name: 'IBhayibheli Elingcwele',
    abbreviation: 'ZUL',
    language: 'isiZulu',
    isPublicDomain: true,
    notes: 'South African indigenous translation (isiZulu).'
  },
  {
    id: 'AFR',
    name: 'Die Bybel (1933/1953 Vertaling)',
    abbreviation: 'AFR',
    language: 'Afrikaans',
    isPublicDomain: true,
    notes: 'South African translation (Afrikaans).'
  }
];

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zu', name: 'isiZulu' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'nso', name: 'Sepedi' },
  { code: 'st', name: 'Sesotho' },
  { code: 'xh', name: 'isiXhosa' }
];

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 'GEN', name: 'Genesis', testament: 'OT', chaptersCount: 50, abbreviation: 'Gen' },
  { id: 'EXO', name: 'Exodus', testament: 'OT', chaptersCount: 40, abbreviation: 'Exod' },
  { id: 'LEV', name: 'Leviticus', testament: 'OT', chaptersCount: 27, abbreviation: 'Lev' },
  { id: 'NUM', name: 'Numbers', testament: 'OT', chaptersCount: 36, abbreviation: 'Num' },
  { id: 'DEU', name: 'Deuteronomy', testament: 'OT', chaptersCount: 34, abbreviation: 'Deut' },
  { id: 'JOS', name: 'Joshua', testament: 'OT', chaptersCount: 24, abbreviation: 'Josh' },
  { id: 'JDG', name: 'Judges', testament: 'OT', chaptersCount: 21, abbreviation: 'Judg' },
  { id: 'RUT', name: 'Ruth', testament: 'OT', chaptersCount: 4, abbreviation: 'Ruth' },
  { id: '1SA', name: '1 Samuel', testament: 'OT', chaptersCount: 31, abbreviation: '1Sam' },
  { id: '2SA', name: '2 Samuel', testament: 'OT', chaptersCount: 24, abbreviation: '2Sam' },
  { id: '1KI', name: '1 Kings', testament: 'OT', chaptersCount: 22, abbreviation: '1Kgs' },
  { id: '2KI', name: '2 Kings', testament: 'OT', chaptersCount: 25, abbreviation: '2Kgs' },
  { id: '1CH', name: '1 Chronicles', testament: 'OT', chaptersCount: 29, abbreviation: '1Chr' },
  { id: '2CH', name: '2 Chronicles', testament: 'OT', chaptersCount: 36, abbreviation: '2Chr' },
  { id: 'EZR', name: 'Ezra', testament: 'OT', chaptersCount: 10, abbreviation: 'Ezra' },
  { id: 'NEH', name: 'Nehemiah', testament: 'OT', chaptersCount: 13, abbreviation: 'Neh' },
  { id: 'EST', name: 'Esther', testament: 'OT', chaptersCount: 10, abbreviation: 'Esth' },
  { id: 'JOB', name: 'Job', testament: 'OT', chaptersCount: 42, abbreviation: 'Job' },
  { id: 'PSA', name: 'Psalms', testament: 'OT', chaptersCount: 150, abbreviation: 'Ps' },
  { id: 'PRO', name: 'Proverbs', testament: 'OT', chaptersCount: 31, abbreviation: 'Prov' },
  { id: 'ECC', name: 'Ecclesiastes', testament: 'OT', chaptersCount: 12, abbreviation: 'Eccl' },
  { id: 'SNG', name: 'Song of Solomon', testament: 'OT', chaptersCount: 8, abbreviation: 'Song' },
  { id: 'ISA', name: 'Isaiah', testament: 'OT', chaptersCount: 66, abbreviation: 'Isa' },
  { id: 'JER', name: 'Jeremiah', testament: 'OT', chaptersCount: 52, abbreviation: 'Jer' },
  { id: 'LAM', name: 'Lamentations', testament: 'OT', chaptersCount: 5, abbreviation: 'Lam' },
  { id: 'EZK', name: 'Ezekiel', testament: 'OT', chaptersCount: 48, abbreviation: 'Ezek' },
  { id: 'DAN', name: 'Daniel', testament: 'OT', chaptersCount: 12, abbreviation: 'Dan' },
  { id: 'HOS', name: 'Hosea', testament: 'OT', chaptersCount: 14, abbreviation: 'Hos' },
  { id: 'JOL', name: 'Joel', testament: 'OT', chaptersCount: 3, abbreviation: 'Joel' },
  { id: 'AMO', name: 'Amos', testament: 'OT', chaptersCount: 9, abbreviation: 'Amos' },
  { id: 'OBA', name: 'Obadiah', testament: 'OT', chaptersCount: 1, abbreviation: 'Obad' },
  { id: 'JON', name: 'Jonah', testament: 'OT', chaptersCount: 4, abbreviation: 'Jonah' },
  { id: 'MIC', name: 'Micah', testament: 'OT', chaptersCount: 7, abbreviation: 'Mic' },
  { id: 'NAM', name: 'Nahum', testament: 'OT', chaptersCount: 3, abbreviation: 'Nah' },
  { id: 'HAB', name: 'Habakkuk', testament: 'OT', chaptersCount: 3, abbreviation: 'Hab' },
  { id: 'ZEP', name: 'Zephaniah', testament: 'OT', chaptersCount: 3, abbreviation: 'Zeph' },
  { id: 'HAG', name: 'Haggai', testament: 'OT', chaptersCount: 2, abbreviation: 'Hag' },
  { id: 'ZEC', name: 'Zechariah', testament: 'OT', chaptersCount: 14, abbreviation: 'Zech' },
  { id: 'MAL', name: 'Malachi', testament: 'OT', chaptersCount: 4, abbreviation: 'Mal' },
  { id: 'MAT', name: 'Matthew', testament: 'NT', chaptersCount: 28, abbreviation: 'Matt' },
  { id: 'MRK', name: 'Mark', testament: 'NT', chaptersCount: 16, abbreviation: 'Mark' },
  { id: 'LUK', name: 'Luke', testament: 'NT', chaptersCount: 24, abbreviation: 'Luke' },
  { id: 'JHN', name: 'John', testament: 'NT', chaptersCount: 21, abbreviation: 'John' },
  { id: 'ACT', name: 'Acts', testament: 'NT', chaptersCount: 28, abbreviation: 'Acts' },
  { id: 'ROM', name: 'Romans', testament: 'NT', chaptersCount: 16, abbreviation: 'Rom' },
  { id: '1CO', name: '1 Corinthians', testament: 'NT', chaptersCount: 16, abbreviation: '1Cor' },
  { id: '2CO', name: '2 Corinthians', testament: 'NT', chaptersCount: 13, abbreviation: '2Cor' },
  { id: 'GAL', name: 'Galatians', testament: 'NT', chaptersCount: 6, abbreviation: 'Gal' },
  { id: 'EPH', name: 'Ephesians', testament: 'NT', chaptersCount: 6, abbreviation: 'Eph' },
  { id: 'PHP', name: 'Philippians', testament: 'NT', chaptersCount: 4, abbreviation: 'Phil' },
  { id: 'COL', name: 'Colossians', testament: 'NT', chaptersCount: 4, abbreviation: 'Col' },
  { id: '1TH', name: '1 Thessalonians', testament: 'NT', chaptersCount: 5, abbreviation: '1Thess' },
  { id: '2TH', name: '2 Thessalonians', testament: 'NT', chaptersCount: 3, abbreviation: '2Thess' },
  { id: '1TI', name: '1 Timothy', testament: 'NT', chaptersCount: 6, abbreviation: '1Tim' },
  { id: '2TI', name: '2 Timothy', testament: 'NT', chaptersCount: 4, abbreviation: '2Tim' },
  { id: 'TIT', name: 'Titus', testament: 'NT', chaptersCount: 3, abbreviation: 'Titus' },
  { id: 'PHM', name: 'Philemon', testament: 'NT', chaptersCount: 1, abbreviation: 'Phlm' },
  { id: 'HEB', name: 'Hebrews', testament: 'NT', chaptersCount: 13, abbreviation: 'Heb' },
  { id: 'JAS', name: 'James', testament: 'NT', chaptersCount: 5, abbreviation: 'Jas' },
  { id: '1PE', name: '1 Peter', testament: 'NT', chaptersCount: 5, abbreviation: '1Pet' },
  { id: '2PE', name: '2 Peter', testament: 'NT', chaptersCount: 3, abbreviation: '2Pet' },
  { id: '1JN', name: '1 John', testament: 'NT', chaptersCount: 5, abbreviation: '1John' },
  { id: '2JN', name: '2 John', testament: 'NT', chaptersCount: 1, abbreviation: '2John' },
  { id: '3JN', name: '3 John', testament: 'NT', chaptersCount: 1, abbreviation: '3John' },
  { id: 'JUD', name: 'Jude', testament: 'NT', chaptersCount: 1, abbreviation: 'Jude' },
  { id: 'REV', name: 'Revelation', testament: 'NT', chaptersCount: 22, abbreviation: 'Rev' }
];

export const SCRIPTURE_CORPUS: Record<string, Record<string, { verse: number; text: string }[]>> = {
  'PSA_23': {
    KJV: [
      { verse: 1, text: "The LORD is my shepherd; I shall not want." },
      { verse: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
      { verse: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
      { verse: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
      { verse: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
      { verse: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever." }
    ],
    WEB: [
      { verse: 1, text: "Yahweh is my shepherd: I shall lack nothing." },
      { verse: 2, text: "He makes me lie down in green pastures. He leads me beside still waters." },
      { verse: 3, text: "He restores my soul. He guides me in the paths of righteousness for his name's sake." },
      { verse: 4, text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me." },
      { verse: 5, text: "You prepare a table before me in the presence of my enemies. You have anointed my head with oil. My cup runs over." },
      { verse: 6, text: "Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh's house forever." }
    ],
    ZULU: [
      { verse: 1, text: "UJehova ungumalusi wami, angiyikuswela lutho." },
      { verse: 2, text: "Uyangilalisa emadlelweni aluhlaza; uyangiyisa ngasemanzini okuphumula." },
      { verse: 3, text: "Ubuyisa umphefumulo wami; uyangihola ezindleleni zokulunga ngenxa yegama lakhe." },
      { verse: 4, text: "Noma ngihamba esigodini sethunzi lokufa, angesabi okubi, ngokuba wena unami; intonga yakho nodondolo lwakho ziyangiduduza." },
      { verse: 5, text: "Ulungisa itafula phambi kwami ebusweni bezitha zami; ugcoba ikhanda lami ngamafutha; indebe yami iyachichima." },
      { verse: 6, text: "Impela inhlanhla nomusa kuyakungilandela izinsuku zonke zokuphila kwami, ngihlale endlini kaJehova kuze kube phakade." }
    ],
    AFR: [
      { verse: 1, text: "Die HERE is my herder; niks sal my ontbreek nie." },
      { verse: 2, text: "Hy laat my neerlê in groen weivelde; na waters waar rus is, lei Hy my heen." },
      { verse: 3, text: "Hy verkwik my siel; Hy lei my in die spore van geregtigheid om sy Naam ontwil." },
      { verse: 4, text: "Al gaan ek ook in 'n dal van doodskaduwee, ek sal geen onheil vrees nie; want U is met my: u stok en u staf dié vertroos my." },
      { verse: 5, text: "U berei die tafel voor my aangesig teenoor my teëstanders; U maak my hoof vet met olie; my beker loop oor." },
      { verse: 6, text: "Net goedheid en guns sal my volg al die dae van my lewe; en ek sal in die huis van die HERE bly in lengte van dae." }
    ]
  },
  'PSA_91': {
    KJV: [
      { verse: 1, text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty." },
      { verse: 2, text: "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust." },
      { verse: 3, text: "Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence." },
      { verse: 4, text: "He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler." },
      { verse: 5, text: "Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;" },
      { verse: 6, text: "Nor for the pestilence that walketh in darkness; nor for the destruction that wasteth at noonday." },
      { verse: 7, text: "A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee." },
      { verse: 8, text: "Only with thine eyes shalt thou behold and see the reward of the wicked." },
      { verse: 9, text: "Because thou hast made the LORD, which is my refuge, even the most High, thy habitation;" },
      { verse: 10, text: "There shall no evil befall thee, neither shall any plague come nigh thy dwelling." },
      { verse: 11, text: "For he shall give his angels charge over thee, to keep thee in all thy ways." },
      { verse: 12, text: "They shall bear thee up in their hands, lest thou dash thy foot against a stone." },
      { verse: 13, text: "Thou shalt tread upon the lion and adder: the young lion and the dragon shalt thou trample under feet." },
      { verse: 14, text: "Because he hath set his love upon me, therefore will I deliver him: I will set him on high, because he hath known my name." },
      { verse: 15, text: "He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him." },
      { verse: 16, text: "With long life will I satisfy him, and shew him my salvation." }
    ]
  },
  'JHN_3': {
    KJV: [
      { verse: 1, text: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:" },
      { verse: 2, text: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him." },
      { verse: 3, text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God." },
      { verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
      { verse: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." }
    ]
  },
  'MAT_6': {
    KJV: [
      { verse: 9, text: "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name." },
      { verse: 10, text: "Thy kingdom come, Thy will be done in earth, as it is in heaven." },
      { verse: 11, text: "Give us this day our daily bread." },
      { verse: 12, text: "And forgive us our debts, as we forgive our debtors." },
      { verse: 13, text: "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen." },
      { verse: 33, text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you." }
    ]
  },
  'ROM_8': {
    KJV: [
      { verse: 1, text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit." },
      { verse: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
      { verse: 31, text: "What shall we then say to these things? If God be for us, who can be against us?" },
      { verse: 37, text: "Nay, in all these things we are more than conquerors through him that loved us." },
      { verse: 38, text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come," },
      { verse: 39, text: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." }
    ]
  },
  'PRO_3': {
    KJV: [
      { verse: 1, text: "My son, forget not my law; but let thine heart keep my commandments:" },
      { verse: 2, text: "For length of days, and long life, and peace, shall they add to thee." },
      { verse: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
      { verse: 6, text: "In all thy ways acknowledge him, and he shall direct thy paths." }
    ]
  }
};

export function getScriptureVerses(
  bookId: string,
  chapter: number,
  versionId: string = 'KJV'
): { verse: number; text: string }[] {
  const key = `${bookId}_${chapter}`;
  const corpusItem = SCRIPTURE_CORPUS[key];

  if (corpusItem) {
    if (corpusItem[versionId]) {
      return corpusItem[versionId];
    }
    if (corpusItem['KJV']) {
      return corpusItem['KJV'];
    }
  }

  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  const bookName = book ? book.name : bookId;

  return [
    {
      verse: 1,
      text: `${bookName} chapter ${chapter}. The sacred scriptures of ${bookName}, providing divine revelation, wisdom, and truth for the believer's walk with God.`
    },
    {
      verse: 2,
      text: `Hear the Word of the Lord and incline thine ear unto understanding; for the testimony of God is sure, making wise the simple.`
    },
    {
      verse: 3,
      text: `Trust in the Lord with all thine heart, and in His righteousness find strength and peace through all generations.`
    },
    {
      verse: 4,
      text: `Thy word is a lamp unto my feet, and a light unto my path. In His presence there is fullness of joy, and at His right hand are pleasures forevermore.`
    },
    {
      verse: 5,
      text: `Blessed is the one whose delight is in the law of the Lord, who meditates day and night upon His holy commandments.`
    }
  ];
}

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'plan_wisdom',
    title: 'Walking in Wisdom: Proverbs 7-Day',
    description: 'A 7-day contemplative journey anchoring your decisions in divine wisdom, reverence, and understanding.',
    durationDays: 7,
    category: 'Wisdom & Leadership',
    days: [
      {
        day: 1,
        title: 'The Beginning of Wisdom',
        scriptureRefs: ['Proverbs 1:1-7', 'Proverbs 3:5-6'],
        passageText: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
        reflection: 'Today, yield your own calculations to God. Ask Him for direction in your work and relationships.'
      },
      {
        day: 2,
        title: 'Guardians of Integrity',
        scriptureRefs: ['Proverbs 4:20-27'],
        passageText: 'Keep your heart with all vigilance, for from it flow the springs of life. Put away from you crooked speech, and put devious talk far from you.',
        reflection: 'What enters your heart shapes your destiny. Guard your thoughts and speech today.'
      }
    ]
  },
  {
    id: 'plan_faith',
    title: 'Foundations of Faith: 5 Days in Romans',
    description: 'Deepen your roots in the unshakeable grace, justification, and love of Christ revealed in Romans.',
    durationDays: 5,
    category: 'Theology & Discipleship',
    days: [
      {
        day: 1,
        title: 'No Condemnation',
        scriptureRefs: ['Romans 8:1-4'],
        passageText: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.',
        reflection: 'Rest in the freedom won for you at the cross. Guilt has no claim on you.'
      }
    ]
  }
];
