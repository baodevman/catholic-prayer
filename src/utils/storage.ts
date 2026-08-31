import { get, set } from 'idb-keyval';

// --- LocalStorage Keys ---
const KEYS = {
  USER_PROFILE: 'catholic_prayer_user_profile',
  USER_ROLE: 'catholic_prayer_user_role',
  NOVENA_ACTIVE: 'catholic_prayer_novena_active',
  NOVENA_HISTORY: 'catholic_prayer_novena_history',
  PRAYER_VIEW_HISTORY: 'catholic_prayer_view_history',
  RELATIVE_PATRONS: 'catholic_prayer_relative_patrons',
  CONNECTED_USERS: 'catholic_prayer_connected_users',
};

// --- Custom Types ---
export type UserRole = 'student' | 'worker' | 'family' | 'monk' | 'sick' | 'single';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  connectionCode: string; // Unique code to connect 2 users
  createdAt: string;
}

export interface CustomPrayer {
  uid: string;
  title: string;
  category: string;
  content: string;
  isPrivate: boolean; // true = Private, false = Public
}

export interface RelativePatron {
  id: string;
  name: string; // e.g. "Ba", "Chú Tuấn", "Chị Mai"
  saintId: string;
  saintName: string; // e.g. "Thánh Giuse"
  feastDate: string; // Format: "MM-DD" e.g. "03-19"
  linkedUserCode?: string; // Connection code of linked user (if connected)
  isConnected?: boolean;
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

// Map of prayer UID -> timestamp when last viewed on home card
export type PrayerHistoryMap = Record<string, number>;

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

// Generate random unique connection code
export const generateConnectionCode = (): string => {
  return 'CP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// --- Storage API Exports ---
export const storage = {
  // User Profile Auth
  getUserProfile: (): UserProfile | null => getLocal<UserProfile | null>(KEYS.USER_PROFILE, null),
  setUserProfile: (profile: UserProfile | null) => setLocal(KEYS.USER_PROFILE, profile),

  // User Role settings
  getUserRole: (): UserRole => getLocal<UserRole>(KEYS.USER_ROLE, 'worker'),
  setUserRole: (role: UserRole) => setLocal(KEYS.USER_ROLE, role),

  // Connected Users (List of connected User codes)
  getConnectedUsers: (): string[] => getLocal<string[]>(KEYS.CONNECTED_USERS, []),
  addConnectedUser: (code: string) => {
    const list = storage.getConnectedUsers();
    const clean = code.trim().toUpperCase();
    if (clean && !list.includes(clean)) {
      list.push(clean);
      setLocal(KEYS.CONNECTED_USERS, list);
    }
  },

  // Check if 2 users are mutually connected
  checkUsersConnected: (targetCode?: string): boolean => {
    if (!targetCode) return false;
    const connectedList = storage.getConnectedUsers();
    return connectedList.includes(targetCode.trim().toUpperCase());
  },

  // Prayer View History (to avoid repeating featured prayers within 7-14 days)
  getPrayerHistory: (): PrayerHistoryMap => getLocal<PrayerHistoryMap>(KEYS.PRAYER_VIEW_HISTORY, {}),
  recordPrayerShown: (uid: string) => {
    const history = storage.getPrayerHistory();
    history[uid] = Date.now();
    setLocal(KEYS.PRAYER_VIEW_HISTORY, history);
  },

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
      return isPersisted;
    }
    return false;
  },

  // --- Relative Patron Saints Storage ---
  getRelativePatrons: (): RelativePatron[] => getLocal<RelativePatron[]>(KEYS.RELATIVE_PATRONS, []),
  setRelativePatrons: (patrons: RelativePatron[]) => setLocal(KEYS.RELATIVE_PATRONS, patrons),
  saveRelativePatron: (patron: RelativePatron) => {
    const list = storage.getRelativePatrons();
    const idx = list.findIndex(p => p.id === patron.id);
    if (idx > -1) {
      list[idx] = patron;
    } else {
      list.push(patron);
    }
    storage.setRelativePatrons(list);
  },
  deleteRelativePatron: (id: string) => {
    const list = storage.getRelativePatrons();
    const filtered = list.filter(p => p.id !== id);
    storage.setRelativePatrons(filtered);
  }
};
