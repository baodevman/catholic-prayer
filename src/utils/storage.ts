import { get, set, del } from 'idb-keyval';

// --- LocalStorage Keys ---
const KEYS = {
  THEME: 'catholic_prayer_theme',
  REMINDERS: 'catholic_prayer_reminders',
  NOVENA_ACTIVE: 'catholic_prayer_novena_active',
  NOVENA_HISTORY: 'catholic_prayer_novena_history',
  WEEKLY_BOOK: 'catholic_prayer_weekly_book',
  OFFLINE_ENABLED: 'catholic_prayer_offline_enabled',
};

// --- Custom Types ---
export interface Reminders {
  morning: string; // "06:00"
  schoolMorning: string; // "07:00"
  workMorning: string; // "07:30"
  eveningWeekday: string; // "21:00"
  eveningWeekend: string; // "21:30"
  novena: string; // "19:00"
}

export interface ActiveNovena {
  id: string; // "divine_mercy", "mary", "joseph"
  name: string;
  startDate: string; // ISO String
  completedDays: number[]; // Array of days (1-9) completed
}

export interface NovenaHistory {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface WeeklyBook {
  2: string[]; // Mon: list of prayer UIDs
  3: string[]; // Tue
  4: string[]; // Wed
  5: string[]; // Thu
  6: string[]; // Fri
  7: string[]; // Sat
  8: string[]; // Sun (Use 8 for Sunday)
}

// --- Default Values ---
export const DEFAULT_REMINDERS: Reminders = {
  morning: '06:00',
  schoolMorning: '07:00',
  workMorning: '07:30',
  eveningWeekday: '21:00',
  eveningWeekend: '21:30',
  novena: '19:00',
};

export const DEFAULT_WEEKLY_BOOK: WeeklyBook = {
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
};

// --- LocalStorage Helpers ---
export const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

// --- Storage API Exports ---
export const storage = {
  // Theme settings
  getTheme: () => getLocal<'light' | 'dark' | 'system'>(KEYS.THEME, 'system'),
  setTheme: (theme: 'light' | 'dark' | 'system') => setLocal(KEYS.THEME, theme),

  // Reminders
  getReminders: (): Reminders => getLocal<Reminders>(KEYS.REMINDERS, DEFAULT_REMINDERS),
  setReminders: (reminders: Reminders) => setLocal(KEYS.REMINDERS, reminders),

  // Active Novena
  getActiveNovena: (): ActiveNovena | null => getLocal<ActiveNovena | null>(KEYS.NOVENA_ACTIVE, null),
  setActiveNovena: (novena: ActiveNovena | null) => setLocal(KEYS.NOVENA_ACTIVE, novena),

  // Novena History
  getNovenaHistory: (): NovenaHistory[] => getLocal<NovenaHistory[]>(KEYS.NOVENA_HISTORY, []),
  saveNovenaHistory: (historyItem: NovenaHistory) => {
    const list = getLocal<NovenaHistory[]>(KEYS.NOVENA_HISTORY, []);
    list.unshift(historyItem);
    setLocal(KEYS.NOVENA_HISTORY, list);
  },

  // Weekly Prayer Book Map (Mon-Sun -> Prayer IDs)
  getWeeklyBook: (): WeeklyBook => getLocal<WeeklyBook>(KEYS.WEEKLY_BOOK, DEFAULT_WEEKLY_BOOK),
  setWeeklyBook: (book: WeeklyBook) => setLocal(KEYS.WEEKLY_BOOK, book),

  // Offline caching status
  isOfflineEnabled: (): boolean => getLocal<boolean>(KEYS.OFFLINE_ENABLED, false),
  setOfflineEnabled: (enabled: boolean) => setLocal(KEYS.OFFLINE_ENABLED, enabled),

  // --- IndexedDB Caching for Public Prayers (Fetched from Prismic) ---
  getCachedPrayers: async (): Promise<any[] | null> => {
    try {
      const prayers = await get('prismic_prayers_cache');
      return prayers || null;
    } catch {
      return null;
    }
  },

  setCachedPrayers: async (prayers: any[]): Promise<void> => {
    try {
      await set('prismic_prayers_cache', prayers);
      await set('prismic_prayers_cache_time', Date.now());
    } catch (e) {
      console.error('Error saving prayers to IndexedDB', e);
    }
  },

  clearCachedPrayers: async (): Promise<void> => {
    try {
      await del('prismic_prayers_cache');
      await del('prismic_prayers_cache_time');
    } catch (e) {
      console.error('Error clearing IndexedDB cache', e);
    }
  },

  // Request Persistent Storage
  requestPersistentStorage: async (): Promise<boolean> => {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log(`Persistent storage granted: ${isPersisted}`);
      return isPersisted;
    }
    return false;
  },

  isStoragePersisted: async (): Promise<boolean> => {
    if (navigator.storage && navigator.storage.persisted) {
      return await navigator.storage.persisted();
    }
    return false;
  }
};
