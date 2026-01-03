
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, UserProgress, Theme, Badge, ThemeMode } from '../types';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  progress: UserProgress;
  completeLesson: (lessonId: number) => void;
  markItemComplete: (itemId: string) => void;
  toggleBookmark: (itemId: string) => void;
  setLastActiveLesson: (lessonId: number) => void;
  addXp: (amount: number) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  darkMode: boolean; // Computed boolean for current state
  themeMode: ThemeMode; // User preference
  setThemeMode: (mode: ThemeMode) => void;
  reciterId: string;
  setReciterId: (id: string) => void;
  autoPlay: boolean;
  setAutoPlay: (enabled: boolean) => void;
  reminderEnabled: boolean;
  setReminderEnabled: (enabled: boolean) => void;
  reminderTime: string;
  setReminderTime: (time: string) => void;
  updateProfile: (data: { name: string; age: number; gender: 'boy' | 'girl'; avatarUrl?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AVAILABLE_THEMES: Theme[] = ['default', 'sunset', 'forest', 'lavender'];

const BADGES_DEFINITIONS = [
  { id: 'first_step', name: 'First Step', icon: '🌱', description: 'Complete your first lesson' },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', description: 'Reach a 3-day streak' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚔️', description: 'Reach a 7-day streak' },
  { id: 'quiz_master', name: 'Quiz Master', icon: '🧠', description: 'Earn 500 XP' },
  { id: 'salah_pro', name: 'Salah Pro', icon: '🕌', description: 'Complete the Namaz lesson' },
  { id: 'hafiz_jr', name: 'Hafiz Jr.', icon: '📖', description: 'Complete Ayat-ul-Kursi' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from local storage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  // Persist language changes & Update Direction
  useEffect(() => {
    localStorage.setItem('app-language', language);
    const isRtl = language === 'ur' || language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Theme Mode State (Auto/Light/Dark)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('app-theme-mode') as ThemeMode) || 'auto';
  });

  // Reciter State
  const [reciterId, setReciterId] = useState<string>(() => {
    return localStorage.getItem('app-reciter') || 'Alafasy_128kbps';
  });

  // User Isolation State
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('app-current-user') || 'Guest';
  });

  // AutoPlay State
  const [autoPlay, setAutoPlayState] = useState(() => {
    return localStorage.getItem('setting-autoplay') === 'true';
  });

  // Reminder State
  const [reminderEnabled, setReminderEnabledState] = useState(() => {
    return localStorage.getItem('setting-reminder-enabled') === 'true';
  });
  const [reminderTime, setReminderTimeState] = useState(() => {
    return localStorage.getItem('setting-reminder-time') || '18:00';
  });

  const setAutoPlay = (enabled: boolean) => {
    setAutoPlayState(enabled);
    localStorage.setItem('setting-autoplay', String(enabled));
  };

  const setReminderEnabled = (enabled: boolean) => {
    setReminderEnabledState(enabled);
    localStorage.setItem('setting-reminder-enabled', String(enabled));
    if (enabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  const setReminderTime = (time: string) => {
    setReminderTimeState(time);
    localStorage.setItem('setting-reminder-time', time);
  };

  const updateProfile = (data: { name: string; age: number; gender: 'boy' | 'girl' | 'premium'; avatarUrl?: string }) => {
    const newName = data.name || 'Guest';

    // Update active user key if name changed
    if (newName !== currentUser) {
      localStorage.setItem('app-current-user', newName);
      setCurrentUser(newName);
    }

    setProgress(prev => ({
      ...prev,
      ...data,
      onboardingCompleted: true
    }));
  };

  useEffect(() => {
    localStorage.setItem('app-reciter', reciterId);
  }, [reciterId]);

  // Computed Dark Mode State (for UI logic that needs boolean)
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const applyTheme = () => {
      let dark = false;
      if (themeMode === 'auto') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        dark = themeMode === 'dark';
      }

      setIsDark(dark);

      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('app-theme-mode', themeMode);

    // Listen for system changes if auto
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (themeMode === 'auto') applyTheme();
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  // Random Theme on Initialization
  const [theme, setThemeState] = useState<Theme>(() => {
    // Pick a random theme on every load
    const randomIndex = Math.floor(Math.random() * AVAILABLE_THEMES.length);
    return AVAILABLE_THEMES[randomIndex];
  });

  useEffect(() => {
    document.body.className = `text-slate-900 dark:text-slate-100 select-none transition-colors duration-300 theme-${theme}`;
    // We don't save to local storage to persist, so it changes on reload,
    // but if user changes it in settings, it stays for the session.
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const userKey = `noorani-progress-${currentUser}`;
      let saved = localStorage.getItem(userKey);

      // Migration: If no user-specific data exists and we are Guest, try legacy key
      if (!saved && currentUser === 'Guest') {
        saved = localStorage.getItem('noorani-progress');
        if (saved) {
          // Move legacy to Guest
          localStorage.setItem(userKey, saved);
          // Optional: clear legacy to avoid confusion? No, keep as backup for safety.
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration for old data
        return {
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          completedItems: Array.isArray(parsed.completedItems) ? parsed.completedItems : [],
          bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
          stars: typeof parsed.stars === 'number' ? parsed.stars : 0,
          xp: typeof parsed.xp === 'number' ? parsed.xp : (parsed.stars || 0) * 10,
          currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
          longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
          lastPracticeDate: parsed.lastPracticeDate || null,
          badges: Array.isArray(parsed.badges) ? parsed.badges : [],
          lastActiveLessonId: typeof parsed.lastActiveLessonId === 'number' ? parsed.lastActiveLessonId : undefined,
          name: parsed.name,
          age: parsed.age,
          gender: parsed.gender,
          avatarUrl: parsed.avatarUrl,
          onboardingCompleted: !!parsed.onboardingCompleted
        };
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }

    return {
      completedLessons: [],
      completedItems: [],
      bookmarks: [],
      stars: 0,
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      badges: []
    };
  });

  // Reload progress when user changes
  useEffect(() => {
    const userKey = `noorani-progress-${currentUser}`;
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to reload user progress:", e);
      }
    } else {
      // New user, reset progress state (will be saved on next update)
      setProgress({
        completedLessons: [],
        completedItems: [],
        bookmarks: [],
        stars: 0,
        xp: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
        badges: []
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const userKey = `noorani-progress-${currentUser}`;
    localStorage.setItem(userKey, JSON.stringify(progress));
  }, [progress, currentUser]);

  // Check Streak Logic & Reminder Check
  useEffect(() => {
    // Basic Reminder Check on App Load
    if (reminderEnabled && progress.lastPracticeDate && 'Notification' in window) {
      const lastDate = new Date(progress.lastPracticeDate);
      const now = new Date();
      const diffHours = Math.abs(now.getTime() - lastDate.getTime()) / 36e5;

      if (diffHours > 24 && Notification.permission === 'granted') {
        // Note: This only runs if app is opened/refreshed. True push requires SW.
      }
    }
  }, [reminderEnabled, progress.lastPracticeDate]);

  const updateStreak = (currentProgress: UserProgress): UserProgress => {
    const today = new Date().toDateString();
    const last = currentProgress.lastPracticeDate ? new Date(currentProgress.lastPracticeDate).toDateString() : null;

    if (last === today) return currentProgress; // Already practiced today

    let newStreak = 1;
    if (last) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (last === yesterday.toDateString()) {
        newStreak = currentProgress.currentStreak + 1;
      }
    }

    return {
      ...currentProgress,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentProgress.longestStreak),
      lastPracticeDate: new Date().toISOString()
    };
  };

  const checkForBadges = (p: UserProgress): Badge[] => {
    const newBadges = [...p.badges];
    const ownedIds = new Set(newBadges.map(b => b.id));

    BADGES_DEFINITIONS.forEach(def => {
      if (ownedIds.has(def.id)) return;

      let earned = false;
      if (def.id === 'first_step' && p.completedLessons.length > 0) earned = true;
      if (def.id === 'streak_3' && p.currentStreak >= 3) earned = true;
      if (def.id === 'streak_7' && p.currentStreak >= 7) earned = true;
      if (def.id === 'quiz_master' && p.xp >= 500) earned = true;
      // Namaz is now lesson 40
      if (def.id === 'salah_pro' && p.completedLessons.includes(40)) earned = true;
      // Ayat Kursi is now lesson 42
      if (def.id === 'hafiz_jr' && p.completedLessons.includes(42)) earned = true;

      if (earned) {
        newBadges.push({ ...def, unlockedAt: new Date().toISOString() });
      }
    });
    return newBadges;
  };

  const completeLesson = (lessonId: number) => {
    setProgress(prev => {
      let updated = updateStreak(prev);

      // Award XP for completion
      if (!updated.completedLessons.includes(lessonId)) {
        updated.completedLessons = [...updated.completedLessons, lessonId];
        updated.xp += 50; // Bonus for completion
        updated.stars += 5;
      }

      updated.badges = checkForBadges(updated);
      return updated;
    });
  };

  const markItemComplete = (itemId: string) => {
    setProgress(prev => {
      if (prev.completedItems.includes(itemId)) return prev;
      let updated = updateStreak(prev);
      updated.completedItems = [...updated.completedItems, itemId];
      return updated;
    });
  };

  const addXp = (amount: number) => {
    setProgress(prev => {
      let updated = updateStreak(prev);
      updated.xp += amount;
      updated.stars += Math.floor(amount / 10);
      updated.badges = checkForBadges(updated);
      return updated;
    });
  };

  const toggleBookmark = (itemId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarks.includes(itemId);
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter(id => id !== itemId)
          : [...prev.bookmarks, itemId]
      };
    });
  };

  const setLastActiveLesson = (lessonId: number) => {
    setProgress(prev => ({
      ...prev,
      lastActiveLessonId: lessonId
    }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      if (prev === 'en') return 'ur';
      if (prev === 'ur') return 'fr';
      return 'en';
    });
  };

  return (
    <AppContext.Provider value={{
      language, toggleLanguage, setLanguage,
      progress, completeLesson, markItemComplete, toggleBookmark, setLastActiveLesson, addXp,
      theme, setTheme,
      darkMode: isDark, themeMode, setThemeMode,
      reciterId, setReciterId,
      autoPlay, setAutoPlay,
      reminderEnabled, setReminderEnabled,
      reminderTime, setReminderTime,
      updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
