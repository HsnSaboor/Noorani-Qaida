
export type Language = 'en' | 'ur' | 'fr' | 'es' | 'id' | 'hi' | 'bn' | 'tr' | 'ru' | 'ar' | 'zh' | 'de' | 'ms' | 'pt';
export type Theme = 'default' | 'sunset' | 'forest' | 'lavender';
export type ThemeMode = 'auto' | 'light' | 'dark';

export interface Translation {
  [key: string]: {
    en: string;
    ur: string;
    fr: string;
    es?: string;
    id?: string;
    hi?: string;
    bn?: string;
    tr?: string;
    ru?: string;
    ar?: string;
    zh?: string;
    de?: string;
    ms?: string;
    pt?: string;
    [key: string]: string | undefined;
  };
}

export interface LessonItem {
  id: string;
  type: string;
  text_ar: string;
  full_form?: string;
  transliteration?: string;
  components?: string[];
  words?: {
    text: string;
    audio: string;
    transliteration?: string;
    translation?: {
      en: string;
      ur: string;
      fr: string;
    };
  }[];
  audio?: {
    main: string;
    slow?: string;
  };
  segments?: { start: number; end: number; chars: number[] }[];
  description?: {
    en: string;
    ur: string;
    fr: string;
    [key: string]: string | undefined;
  };
  visual_aid?: {
    type: 'image' | 'video';
    src: string;
    caption?: {
      en: string;
      ur: string;
      fr: string;
      [key: string]: string | undefined;
    };
  };
  makhraj?: string;
  makhrajHighlightId?: string;  // "tongue-tip", "throat-middle", etc.
  actionSteps?: { en: string; ur: string; fr?: string }[];  // Pronunciation steps
  rootWord?: string;  // Arabic root: "ر ز ق"
  grammarType?: string;  // "Verb", "Noun", etc.
  surah?: number;
  ayah?: number;
  wordIndex?: number;
}

export interface LessonQuiz {
  id: string;
  type: string;
  question: {
    en: string;
    ur: string;
    fr: string;
    [key: string]: string | undefined;
  };
  visual?: string;
  audio?: string;
  options: string[] | { en: string; ur: string; fr: string;[key: string]: string | undefined }[];
  correct: string | { en: string; ur: string; fr: string;[key: string]: string | undefined };
}

export interface LessonMeta {
  icon?: string;
  estimated_minutes: number;
  difficulty: string;
  version?: string;
  layout?: 'grid' | 'list';
  item_count?: number; // Total number of items in the lesson for progress calculation
}

export interface Lesson {
  lesson_id: number;
  title: {
    en: string;
    ur: string;
    fr: string;
    [key: string]: string | undefined;
  };
  description: {
    en: string;
    ur: string;
    fr: string;
    [key: string]: string | undefined;
  };
  rule?: {
    en: string;
    ur: string;
    fr: string;
    [key: string]: string | undefined;
  };
  instruction_visuals?: string[];
  objective?: {
    en: string;
    ur: string;
    fr: string;
    [key: string]: string | undefined;
  };
  meta: LessonMeta;
  items?: LessonItem[];
  practice?: LessonItem[];
  quiz?: LessonQuiz[];
  color?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // lucide icon name or emoji
  description: string;
  unlockedAt?: string;
}

export interface UserProgress {
  completedLessons: number[];
  completedItems: string[]; // IDs of individual items completed/mastered
  bookmarks: string[];
  stars: number; // Legacy stars, now treated as XP
  xp: number;    // Experience Points
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  badges: Badge[];
  lastActiveLessonId?: number;
  name?: string;
  age?: number;
  gender?: 'boy' | 'girl' | 'premium';
  avatarUrl?: string;
  onboardingCompleted?: boolean;
}
