import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import type { ActiveNovena, Reminders, WeeklyBook } from '../utils/storage';
import { fetchAllPrayers, getPrismicRepoName } from '../utils/prismic';
import type { Prayer } from '../utils/prismic';

export const useAppState = () => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'book' | 'settings'>('home');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // App Settings States (Synced with storage)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(storage.getTheme());
  const [reminders, setReminders] = useState<Reminders>(storage.getReminders());
  const [activeNovena, setActiveNovena] = useState<ActiveNovena | null>(storage.getActiveNovena());
  const [weeklyBook, setWeeklyBook] = useState<WeeklyBook>(storage.getWeeklyBook());
  const [prismicRepo, setPrismicRepo] = useState<string>(getPrismicRepoName());
  const [offlineEnabled, setOfflineEnabled] = useState<boolean>(storage.isOfflineEnabled());
  const [offlineSize, setOfflineSize] = useState<number>(0);
  const [isFatimaDay, setIsFatimaDay] = useState<boolean>(false);
  const [suggestedPrayer, setSuggestedPrayer] = useState<Prayer | null>(null);

  // Load and refresh prayers
  const refreshPrayers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllPrayers();
      setPrayers(data);
      
      // Calculate cache size if offline is enabled
      if (storage.isOfflineEnabled()) {
        const cached = await storage.getCachedPrayers();
        if (cached) {
          // Estimate size in bytes
          const str = JSON.stringify(cached);
          setOfflineSize(Math.round(str.length / 1024)); // in KB
        }
      } else {
        setOfflineSize(0);
      }
    } catch (e) {
      console.error('Error loading prayers', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // First-time load
  useEffect(() => {
    refreshPrayers();
    storage.requestPersistentStorage();
    
    // Check if it's the 13th of the month (Our Lady of Fatima)
    const today = new Date();
    setIsFatimaDay(today.getDate() === 13);
  }, [refreshPrayers]);

  // Update suggested prayer based on time of day and user category mappings
  useEffect(() => {
    if (prayers.length === 0) return;

    const today = new Date();
    const hour = today.getHours();
    
    let categorySuggest = 'feast-holiday';
    if (hour >= 5 && hour < 11) {
      // Suggest morning work or morning school randomly or based on default
      categorySuggest = 'morning-work';
    } else if (hour >= 18 || hour < 5) {
      categorySuggest = 'evening-weekday';
    }

    const filtered = prayers.filter((p) => p.category === categorySuggest && !p.isNovena);
    if (filtered.length > 0) {
      // Pick the first one or a random one
      setSuggestedPrayer(filtered[0]);
    } else {
      // Fallback: pick any basic prayer
      const fallbackList = prayers.filter(p => !p.isNovena);
      if (fallbackList.length > 0) {
        setSuggestedPrayer(fallbackList[0]);
      }
    }
  }, [prayers]);

  // Theme Sync
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  // Settings Updaters
  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    storage.setTheme(newTheme);
    setTheme(newTheme);
  };

  const updateReminders = (newReminders: Reminders) => {
    storage.setReminders(newReminders);
    setReminders(newReminders);
    // In a real device environment, here we would schedule push notifications based on new hours
    console.log('Reminders scheduled:', newReminders);
  };

  const updateWeeklyBook = (newBook: WeeklyBook) => {
    storage.setWeeklyBook(newBook);
    setWeeklyBook(newBook);
  };

  const toggleOfflineCache = async (enabled: boolean) => {
    storage.setOfflineEnabled(enabled);
    setOfflineEnabled(enabled);
    if (enabled) {
      setLoading(true);
      await refreshPrayers();
    } else {
      await storage.clearCachedPrayers();
      setOfflineSize(0);
    }
  };

  // Start Novena
  const startNovena = (novenaId: string, name: string) => {
    const newNovena: ActiveNovena = {
      id: novenaId,
      name,
      startDate: new Date().toISOString(),
      completedDays: [],
    };
    storage.setActiveNovena(newNovena);
    setActiveNovena(newNovena);
  };

  // Toggle day completion in Novena
  const toggleNovenaDay = (day: number) => {
    if (!activeNovena) return;
    
    let completed = [...activeNovena.completedDays];
    if (completed.includes(day)) {
      completed = completed.filter(d => d !== day);
    } else {
      completed.push(day);
    }
    
    // Sort completed days
    completed.sort((a, b) => a - b);

    const updated = {
      ...activeNovena,
      completedDays: completed
    };

    storage.setActiveNovena(updated);
    setActiveNovena(updated);

    // If day 9 is completed, archive it into history
    if (completed.length === 9) {
      storage.saveNovenaHistory({
        id: activeNovena.id,
        name: activeNovena.name,
        startDate: activeNovena.startDate,
        endDate: new Date().toISOString(),
        completed: true
      });
      // Optionally reset active novena or let user do it manually
    }
  };

  // Reset active novena
  const resetActiveNovena = () => {
    storage.setActiveNovena(null);
    setActiveNovena(null);
  };

  return {
    activeTab,
    setActiveTab,
    selectedPrayer,
    setSelectedPrayer,
    prayers,
    loading,
    refreshPrayers,
    theme,
    updateTheme,
    reminders,
    updateReminders,
    activeNovena,
    startNovena,
    toggleNovenaDay,
    resetActiveNovena,
    weeklyBook,
    updateWeeklyBook,
    prismicRepo,
    setPrismicRepo,
    offlineEnabled,
    toggleOfflineCache,
    offlineSize,
    isFatimaDay,
    suggestedPrayer
  };
};
