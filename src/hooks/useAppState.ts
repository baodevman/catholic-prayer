import { useState, useEffect, useCallback } from 'react';
import { storage, generateConnectionCode } from '../utils/storage';
import type { ActiveNovena, UserRole, CustomPrayer, RelativePatron, UserProfile } from '../utils/storage';
import { fetchAllPrayers, fetchAllCategories } from '../utils/prismic';
import type { Prayer, PrismicCategory } from '../utils/prismic';

export const getCurrentTimeOfDayKey = (): 'sang' | 'trua' | 'chieu' | 'toi' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'sang';
  if (hour >= 11 && hour < 14) return 'trua';
  if (hour >= 14 && hour < 18) return 'chieu';
  return 'toi';
};

export const getTimeOfDayLabel = (key: 'sang' | 'trua' | 'chieu' | 'toi'): string => {
  switch (key) {
    case 'sang': return 'Buổi Sáng';
    case 'trua': return 'Buổi Trưa';
    case 'chieu': return 'Buổi Chiều';
    case 'toi': return 'Buổi Tối';
  }
};

export const useAppState = () => {
  // Navigation & UI States: 'home' | 'suggest' | 'settings'
  const [activeTab, setActiveTab] = useState<'home' | 'suggest' | 'settings'>('home');
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [customPrayers, setCustomPrayers] = useState<CustomPrayer[]>([]);
  const [categories, setCategories] = useState<PrismicCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // User Auth Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(storage.getUserProfile());

  // Featured Prayer on Homepage (Single Prayer matching Time & Role with non-repeat logic)
  const [featuredPrayer, setFeaturedPrayer] = useState<Prayer | null>(null);

  // App Settings States
  const [userRole, setUserRole] = useState<UserRole>(storage.getUserRole());
  const [activeNovena, setActiveNovena] = useState<ActiveNovena | null>(storage.getActiveNovena());
  const [isFatimaDay, setIsFatimaDay] = useState<boolean>(false);
  const [relativePatrons, setRelativePatrons] = useState<RelativePatron[]>(storage.getRelativePatrons());

  // Situation / Search Results
  const [searchResults, setSearchResults] = useState<Prayer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Load and refresh prayers dataset
  const refreshPrayers = useCallback(async () => {
    // Clear notification badge dot on app launch
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge().catch(() => { });
    }

    setLoading(true);
    try {
      const catData = await fetchAllCategories();
      setCategories(catData);

      const staticData = await fetchAllPrayers();
      const customData = await storage.getCustomPrayers();
      setCustomPrayers(customData);

      const customMapped: Prayer[] = customData.map(cp => ({
        uid: cp.uid,
        title: cp.title,
        category: cp.category,
        content: cp.content,
        timeOfDay: 'bat_ky',
        isNovena: false
      }));

      const combined = [
        ...staticData,
        ...customMapped.filter(p => {
          const matched = customData.find(c => c.uid === p.uid);
          return matched ? !matched.isPrivate : true;
        })
      ];

      setPrayers(combined);
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

    const today = new Date();
    setIsFatimaDay(today.getDate() === 13);
  }, [refreshPrayers]);

  // Auth Functions
  const loginUser = (name: string, email: string) => {
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Người dùng Công Giáo',
      email: email.trim(),
      connectionCode: generateConnectionCode(),
      createdAt: new Date().toISOString()
    };
    storage.setUserProfile(profile);
    setUserProfile(profile);
  };

  const logoutUser = () => {
    storage.setUserProfile(null);
    setUserProfile(null);
  };

  // Connected Users Logic
  const addConnectedUser = (code: string) => {
    storage.addConnectedUser(code);
    setRelativePatrons(storage.getRelativePatrons());
  };

  const isUserConnected = (linkedCode?: string): boolean => {
    return storage.checkUsersConnected(linkedCode);
  };

  // Compute Single Featured Prayer for Homepage based on Time of Day, User Role, and Non-Repeat Algorithm
  const selectFeaturedPrayer = useCallback((availablePrayers: Prayer[], role: UserRole) => {
    if (!availablePrayers || availablePrayers.length === 0) return null;

    const timeKey = getCurrentTimeOfDayKey();
    const history = storage.getPrayerHistory();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // 1. Filter candidates matching time of day or 'bat_ky'
    let candidates = availablePrayers.filter(p => p.timeOfDay === timeKey || !p.timeOfDay || p.timeOfDay === 'bat_ky');

    if (candidates.length === 0) {
      candidates = [...availablePrayers];
    }

    // 2. Filter candidates matching role preferences if available
    let roleMatched = candidates.filter(p => {
      const cat = p.category.toLowerCase();
      const title = p.title.toLowerCase();

      if (role === 'student') {
        return cat.includes('hoc') || cat.includes('truong') || title.includes('học') || title.includes('trí');
      }
      if (role === 'worker') {
        return cat.includes('lam') || cat.includes('cong') || title.includes('làm') || title.includes('công việc');
      }
      if (role === 'family') {
        return cat.includes('gia-dinh') || cat.includes('yeu-thuong') || title.includes('gia đình') || title.includes('con cái');
      }
      if (role === 'monk') {
        return cat.includes('thanh-hien') || cat.includes('phuc-vu') || title.includes('tận hiến') || title.includes('phục vụ');
      }
      if (role === 'sick') {
        return cat.includes('suc-khoe') || cat.includes('binh-an') || title.includes('sức khỏe') || title.includes('bệnh');
      }
      if (role === 'single') {
        return cat.includes('ban-duong') || cat.includes('dinh-huong') || title.includes('ơn gọi') || title.includes('tương lai');
      }
      return true;
    });

    if (roleMatched.length === 0) {
      roleMatched = candidates;
    }

    // 3. Apply non-repeat filter (exclude prayers shown in past 7 days)
    const freshCandidates = roleMatched.filter(p => {
      const lastShown = history[p.uid];
      return !lastShown || (now - lastShown) > SEVEN_DAYS_MS;
    });

    let chosen: Prayer;
    if (freshCandidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * freshCandidates.length);
      chosen = freshCandidates[randomIndex];
    } else {
      chosen = [...roleMatched].sort((a, b) => (history[a.uid] || 0) - (history[b.uid] || 0))[0];
    }

    if (chosen && chosen.uid) {
      storage.recordPrayerShown(chosen.uid);
    }

    return chosen;
  }, []);

  // Update featured prayer whenever prayers or userRole change
  useEffect(() => {
    if (prayers.length > 0) {
      const chosen = selectFeaturedPrayer(prayers, userRole);
      setFeaturedPrayer(chosen);
    }
  }, [prayers, userRole, selectFeaturedPrayer]);

  // Shuffle / Refresh Homepage Featured Prayer manually
  const shuffleFeaturedPrayer = () => {
    if (prayers.length > 0) {
      const chosen = selectFeaturedPrayer(prayers, userRole);
      setFeaturedPrayer(chosen);
    }
  };

  // Situation / Prompt Search Function (Max 50 words) + Silent Prismic Intent Logging
  const searchPrayerByContext = async (contextInput: string): Promise<Prayer[]> => {
    if (!contextInput || !contextInput.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return [];
    }

    setIsSearching(true);
    setSearchQuery(contextInput);

    const timeKey = getCurrentTimeOfDayKey();
    const queryLower = contextInput.toLowerCase().trim();
    const words = queryLower.split(/\s+/).filter(Boolean);
    const trimmedQuery = words.slice(0, 50).join(' ');

    const scoredPrayers = prayers.map(p => {
      let score = 0;
      const titleLower = p.title.toLowerCase();
      const contentLower = p.content.toLowerCase();
      const categoryLower = p.category.toLowerCase();

      if (titleLower.includes(trimmedQuery)) score += 30;
      if (contentLower.includes(trimmedQuery)) score += 20;

      words.forEach(w => {
        if (w.length > 2) {
          if (titleLower.includes(w)) score += 10;
          if (categoryLower.includes(w)) score += 8;
          if (contentLower.includes(w)) score += 3;
        }
      });

      if (p.timeOfDay === timeKey) score += 5;

      return { prayer: p, score };
    });

    const topMatches = scoredPrayers
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.prayer);

    const finalResults = topMatches.length > 0 ? topMatches : prayers.slice(0, 3);
    setSearchResults(finalResults);
    setIsSearching(false);

    // --- SILENT LOGGING TO PRISMIC BACKEND ---
    try {
      fetch('/api/log-search-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: trimmedQuery,
          timeOfDay: timeKey,
          matchedPrayers: finalResults.map(r => r.title),
          userRole
        })
      }).catch(err => console.warn('Silent log intent suppressed:', err));
    } catch { }

    return finalResults;
  };

  // Sync / calculate real-time Novena Day progress
  useEffect(() => {
    if (activeNovena) {
      const start = new Date(activeNovena.startDate);
      const startZero = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const now = new Date();
      const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffTime = nowZero.getTime() - startZero.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const currentDay = Math.min(9, Math.max(1, diffDays + 1));

      const autoCompleted: number[] = [];
      for (let i = 1; i < currentDay; i++) {
        autoCompleted.push(i);
      }

      const needUpdate =
        activeNovena.completedDays.length !== autoCompleted.length ||
        !autoCompleted.every(val => activeNovena.completedDays.includes(val));

      if (needUpdate) {
        const updatedNovena = {
          ...activeNovena,
          completedDays: autoCompleted
        };
        storage.setActiveNovena(updatedNovena);
        setActiveNovena(updatedNovena);

        if (diffDays >= 9) {
          storage.saveNovenaHistory({
            id: activeNovena.id,
            name: activeNovena.name,
            startDate: activeNovena.startDate,
            endDate: new Date().toISOString(),
            completed: true
          });
          storage.setActiveNovena(null);
          setActiveNovena(null);
        }
      }
    }
  }, [activeNovena]);

  // Settings Updaters
  const updateUserRole = (role: UserRole) => {
    storage.setUserRole(role);
    setUserRole(role);
  };

  // Novena Control
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

  const toggleNovenaDay = (day: number) => {
    if (!activeNovena) return;
    let completed = [...activeNovena.completedDays];
    if (completed.includes(day)) {
      completed = completed.filter(d => d !== day);
    } else {
      completed.push(day);
    }
    completed.sort((a, b) => a - b);
    const updated = { ...activeNovena, completedDays: completed };
    storage.setActiveNovena(updated);
    setActiveNovena(updated);
  };

  const resetActiveNovena = () => {
    storage.setActiveNovena(null);
    setActiveNovena(null);
  };

  // Add a custom prayer + Sync to Prismic API with user info
  const addCustomPrayer = async (prayer: CustomPrayer) => {
    await storage.saveCustomPrayer(prayer);

    if (!prayer.isPrivate) {
      try {
        await fetch('/api/submit-prayer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: prayer.title,
            content: prayer.content,
            category: prayer.category,
            submitted_by_user: userProfile ? `${userProfile.name} (${userProfile.email})` : 'Thành viên ẩn danh',
            user_email: userProfile?.email || ''
          }),
        });
      } catch (err) {
        console.error('Lỗi mạng khi đồng bộ lên Prismic:', err);
      }
    }

    await refreshPrayers();
  };

  const deleteCustomPrayer = async (uid: string) => {
    await storage.deleteCustomPrayer(uid);
    await refreshPrayers();
  };

  const saveRelativePatron = (patronData: Omit<RelativePatron, 'id'> & { id?: string }) => {
    const id = patronData.id || `patron-${Date.now()}`;
    const isConnected = storage.checkUsersConnected(patronData.linkedUserCode);
    const newPatron: RelativePatron = {
      ...patronData,
      id,
      isConnected
    };
    storage.saveRelativePatron(newPatron);
    setRelativePatrons(storage.getRelativePatrons());
  };

  const deleteRelativePatron = (id: string) => {
    storage.deleteRelativePatron(id);
    setRelativePatrons(storage.getRelativePatrons());
  };

  return {
    activeTab,
    setActiveTab,
    featuredPrayer,
    shuffleFeaturedPrayer,
    prayers,
    customPrayers,
    categories,
    loading,
    refreshPrayers,
    userProfile,
    loginUser,
    logoutUser,
    userRole,
    updateUserRole,
    activeNovena,
    startNovena,
    toggleNovenaDay,
    resetActiveNovena,
    isFatimaDay,
    searchPrayerByContext,
    searchResults,
    searchQuery,
    isSearching,
    addCustomPrayer,
    deleteCustomPrayer,
    relativePatrons,
    saveRelativePatron,
    deleteRelativePatron,
    addConnectedUser,
    isUserConnected
  };
};
