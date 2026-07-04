import { get, set, del } from 'idb-keyval';

// --- LocalStorage Keys ---
const KEYS = {
  THEME: 'catholic_prayer_theme',
  NOVENA_ACTIVE: 'catholic_prayer_novena_active',
  NOVENA_HISTORY: 'catholic_prayer_novena_history',
  WEEKLY_BOOK: 'catholic_prayer_weekly_book',
  OFFLINE_ENABLED: 'catholic_prayer_offline_enabled',
  USER_ROLE: 'catholic_prayer_user_role',
  NOTIFICATIONS_ENABLED: 'catholic_prayer_notifications_enabled',
};

// --- Custom Types ---
export type UserRole = 'student' | 'worker' | 'family';

export interface CustomPrayer {
  uid: string;
  title: string;
  category: string;
  content: string;
  isPrivate: boolean; // true = Private, false = Public
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

  // User Role settings
  getUserRole: (): UserRole => getLocal<UserRole>(KEYS.USER_ROLE, 'worker'),
  setUserRole: (role: UserRole) => setLocal(KEYS.USER_ROLE, role),

  // Notifications enabled
  isNotificationsEnabled: (): boolean => getLocal<boolean>(KEYS.NOTIFICATIONS_ENABLED, false),
  setNotificationsEnabled: (enabled: boolean) => setLocal(KEYS.NOTIFICATIONS_ENABLED, enabled),

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

  // --- IndexedDB for Custom User Prayers (Private / Public) ---
  getCustomPrayers: async (): Promise<CustomPrayer[]> => {
    try {
      const list = await get('custom_prayers_db');
      return list || [];
    } catch {
      return [];
    }
  },

  saveCustomPrayer: async (prayer: CustomPrayer): Promise<void> => {
    try {
      const list = await storage.getCustomPrayers();
      const index = list.findIndex(p => p.uid === prayer.uid);
      if (index > -1) {
        list[index] = prayer; // Update
      } else {
        list.push(prayer); // Add new
      }
      await set('custom_prayers_db', list);
    } catch (e) {
      console.error('Error saving custom prayer', e);
    }
  },

  deleteCustomPrayer: async (uid: string): Promise<void> => {
    try {
      const list = await storage.getCustomPrayers();
      const updated = list.filter(p => p.uid !== uid);
      await set('custom_prayers_db', updated);
    } catch (e) {
      console.error('Error deleting custom prayer', e);
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
