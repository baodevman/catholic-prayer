import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import type { ActiveNovena, WeeklyBook, UserRole, CustomPrayer } from '../utils/storage';
import { fetchAllPrayers, fetchAllCategories } from '../utils/prismic';
import type { Prayer, PrismicCategory } from '../utils/prismic';

export const useAppState = () => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'book' | 'settings'>('home');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [customPrayers, setCustomPrayers] = useState<CustomPrayer[]>([]);
  const [categories, setCategories] = useState<PrismicCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // App Settings States (Synced with storage)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(storage.getTheme());
  const [userRole, setUserRole] = useState<UserRole>(storage.getUserRole());
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(storage.isNotificationsEnabled());
  const [activeNovena, setActiveNovena] = useState<ActiveNovena | null>(storage.getActiveNovena());
  const [weeklyBook, setWeeklyBook] = useState<WeeklyBook>(storage.getWeeklyBook());
  const [offlineEnabled, setOfflineEnabled] = useState<boolean>(storage.isOfflineEnabled());
  const [offlineSize, setOfflineSize] = useState<number>(0);
  const [isFatimaDay, setIsFatimaDay] = useState<boolean>(false);
  const [suggestedPrayers, setSuggestedPrayers] = useState<Prayer[]>([]);

  // Pinned/Fixed prayers for 6:00 and 19:00 notifications
  const [fixedMorningUid, setFixedMorningUid] = useState<string | null>(null);
  const [fixedEveningUid, setFixedEveningUid] = useState<string | null>(null);

  // Web Push Diagnostics Telemetry State
  const [pushDebugStatus, setPushDebugStatus] = useState<string>('Chưa kích hoạt');
  const [pushDebugToken, setPushDebugToken] = useState<string>('');
  const [pushDebugError, setPushDebugError] = useState<string>('');

  // Load and refresh prayers
  const refreshPrayers = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch dynamic categories first
      const catData = await fetchAllCategories();
      setCategories(catData);

      // Fetch pinned prayers from IndexedDB
      const morningUid = await storage.getFixedMorningPrayer();
      const eveningUid = await storage.getFixedEveningPrayer();
      setFixedMorningUid(morningUid);
      setFixedEveningUid(eveningUid);

      // 2. Fetch static public prayers
      const staticData = await fetchAllPrayers();
      
      // 3. Fetch custom user prayers from IndexedDB
      const customData = await storage.getCustomPrayers();
      setCustomPrayers(customData);

      // 4. Map custom prayers to fit the Prayer interface
      const customMapped: Prayer[] = customData.map(cp => ({
        uid: cp.uid,
        title: cp.title,
        category: cp.category,
        content: cp.content,
        isNovena: false
      }));

      // 5. Combine static prayers and non-private custom prayers for the main library
      const combined = [
        ...staticData,
        ...customMapped.filter(p => {
          const matched = customData.find(c => c.uid === p.uid);
          return matched ? !matched.isPrivate : true;
        })
      ];

      setPrayers(combined);
      
      // Calculate cache size if offline is enabled
      if (storage.isOfflineEnabled()) {
        const cached = await storage.getCachedPrayers();
        if (cached) {
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

    // Initial Push Diagnostic check
    if (storage.isNotificationsEnabled()) {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          subscribeToWebPush();
        } else if (Notification.permission === 'denied') {
          setPushDebugStatus('Bị chặn ❌');
          setPushDebugError('Trình duyệt báo: Quyền gửi thông báo bị từ chối trong Cài đặt trang web.');
        } else {
          setPushDebugStatus('Chưa cấp quyền ⚠️');
        }
      }
    }
  }, [refreshPrayers]);

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
      
      // Auto-mark previous days as completed
      const autoCompleted: number[] = [];
      for (let i = 1; i < currentDay; i++) {
        autoCompleted.push(i);
      }

      // Check if we need to update activeNovena to prevent infinite loops
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

        // If it's day 9 and we pass it, we can archive it
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

  // Automatic Background Notification Scheduler on Prayer Period transitions
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkPeriodTransition = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      // Trigger exactly on the hour transitions (minute is 0)
      if (minute !== 0) return;
      
      let periodKey = '';
      let title = '';
      let body = '';
      
      const dayOfWeek = now.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      if (isWeekend) {
        if (hour === 18) {
          periodKey = 'evening_weekend';
          title = "Lời Nguyện Cầu Buổi Tối";
          body = "Đã đến giờ dâng lời tạ ơn ngày nghỉ và cầu bình an cho gia đình.";
        } else if (hour === 4) {
          periodKey = 'day_weekend';
          title = "Lời Nguyện Cầu Ngày Lễ";
          body = "Hãy dành thời gian ngày Chúa Nhật này dâng lời cầu nguyện.";
        }
      } else {
        if (hour === 4) {
          periodKey = 'morning_weekday';
          title = "Lời Nguyện Cầu Buổi Sáng";
          body = "Dâng ngày mới học tập và làm việc thánh hiến cho Chúa.";
        } else if (hour === 10) {
          periodKey = 'focus_weekday';
          title = "Lời Nguyện Cầu Học Tập & Làm Việc";
          body = "Dâng lời cầu nguyện xin Chúa ban ơn tập trung cao độ.";
        } else if (hour === 15) {
          periodKey = 'thanks_weekday';
          title = "Lời Tạ Ơn Chiều Muộn";
          body = "Cầu xin ơn bình an trở về nhà sau một ngày học tập/làm việc.";
        } else if (hour === 18) {
          periodKey = 'evening_weekday';
          title = "Lời Nguyện Cầu Buổi Tối";
          body = "Đã đến giờ dâng lời kinh nguyện tạ ơn cuối ngày.";
        }
      }
      
      if (periodKey) {
        const todayKey = `${periodKey}_${now.toDateString()}`;
        const lastNotified = localStorage.getItem('last_notified_period_today');
        
        if (lastNotified !== todayKey) {
          localStorage.setItem('last_notified_period_today', todayKey);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { 
              body, 
              icon: '/favicon.svg',
              badge: '/favicon.svg'
            });
          } else {
            console.log(`🔔 BÁO THỨC: ${title} - ${body}`);
          }
        }
      }
    };

    const timer = setInterval(checkPeriodTransition, 30000); // Check every 30 seconds
    return () => clearInterval(timer);
  }, [notificationsEnabled]);

  // Update suggested prayers based on Time, Day, and User Role
  useEffect(() => {
    if (prayers.length === 0) return;

    const today = new Date();
    const hour = today.getHours();
    const dayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat, 1-5 = Mon-Fri
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isEvening = hour >= 18 || hour < 4;

    let suggestions: Prayer[] = [];

    if (isEvening) {
      // EVENING SUGGESTIONS (Common for both Weekdays and Weekends)
      if (userRole === 'family') {
        suggestions = prayers.filter(p => 
          p.category === 'loi-nguyen-cho-su-hoa-thuan-yeu-thuong' ||
          p.category === 'loi-nguyen-cho-long-hieu-thao' ||
          p.category === 'loi-nguyen-cho-su-binh-an-cua-cha-me-ong-ba' ||
          p.category === 'loi-nguyen-danh-cho-con-cai'
        );
      } else if (userRole === 'student') {
        suggestions = prayers.filter(p => p.category === 'loi-nguyen-cuoi-ngay-di-hoc');
      } else {
        // worker / default
        suggestions = prayers.filter(p => 
          p.category === 'loi-nguyen-cuoi-ngay-di-lam' ||
          p.category === 'loi-nguyen-cuoi-ngay-sau-mot-chuyen-di'
        );
      }

      // Fallback evening filters if empty
      if (suggestions.length === 0) {
        suggestions = prayers.filter(p => 
          p.category === 'loi-nguyen-cuoi-ngay-sau-khi-trai-qua-kho-khan' ||
          p.category === 'loi-nguyen-cuoi-ngay-di-lam' ||
          p.category === 'loi-nguyen-cuoi-ngay-di-hoc' ||
          p.category === 'loi-nguyen-cho-su-hoa-thuan-yeu-thuong'
        );
      }
    } else if (isWeekend) {
      // WEEKEND DAY TIME SUGGESTIONS
      suggestions = prayers.filter(p => p.category === 'loi-nguyen-cho-cac-ngay-le-cong-giao');
    } else {
      // WEEKDAY DAY TIME SUGGESTIONS (Mon-Fri)
      if (hour >= 4 && hour < 10) {
        // Morning work & morning school
        const workPrayers = prayers.filter(p => p.category === 'loi-nguyen-cau-truoc-khi-di-lam');
        const schoolPrayers = prayers.filter(p => p.category === 'loi-nguyen-cau-truoc-khi-di-hoc');
        
        const temp: Prayer[] = [];
        if (userRole === 'student') {
          if (schoolPrayers.length > 0) temp.push(schoolPrayers[0]);
          if (workPrayers.length > 0) temp.push(workPrayers[0]);
        } else {
          if (workPrayers.length > 0) temp.push(workPrayers[0]);
          if (schoolPrayers.length > 0) temp.push(schoolPrayers[0]);
        }
        suggestions = temp;
      } else if (hour >= 10 && hour < 15) {
        // Focus prayer: loi-nguyen-cau-cho-su-tap-trung
        suggestions = prayers.filter(p => p.category === 'loi-nguyen-cau-cho-su-tap-trung');
        if (suggestions.length === 0) {
          suggestions = prayers.filter(p => p.category === 'loi-nguyen-cau-cho-su-khon-ngoan');
        }
      } else {
        // 15h00 - 18h00: Thanksgiving + safe trip home
        suggestions = prayers.filter(p => 
          p.category === 'loi-nguyen-cuoi-ngay-sau-mot-chuyen-di' || 
          p.title.toLowerCase().includes('tạ ơn')
        );
      }
    }

    // Default Fallback if no match found
    if (suggestions.length === 0) {
      suggestions = prayers.slice(0, 2);
    }

    setSuggestedPrayers(suggestions.slice(0, 2)); // Limit to max 2 suggestions
  }, [prayers, userRole]);

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

  const updateUserRole = (role: UserRole) => {
    storage.setUserRole(role);
    setUserRole(role);
  };

  const subscribeToWebPush = async () => {
    setPushDebugError('');
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushDebugStatus('Trình duyệt không hỗ trợ Web Push ❌');
      return;
    }

    try {
      setPushDebugStatus('Đang nạp Service Worker...');
      const registration = await navigator.serviceWorker.ready;
      
      setPushDebugStatus('Đang quét thông tin đăng ký cũ...');
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        setPushDebugStatus('Đang xin chứng chỉ VAPID từ Firebase...');
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''; 
        
        if (!vapidPublicKey || vapidPublicKey === 'BEl62vPPTgEt2mYIGY43C4U8-y453J23') {
          throw new Error('Chưa cấu hình VITE_VAPID_PUBLIC_KEY trên Vercel/Local.');
        }
        
        const padding = '='.repeat((4 - vapidPublicKey.length % 4) % 4);
        const base64 = (vapidPublicKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        
        setPushDebugStatus('Đang cấp token trình duyệt...');
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: outputArray
        });
      }
      
      if (subscription) {
        setPushDebugStatus('Đã có Token. Đang đồng bộ lên Vercel...');
        const tokenStr = JSON.stringify(subscription);
        setPushDebugToken(tokenStr);
        console.log('Web Push Subscription thành công:', tokenStr);
        
        const response = await fetch('/api/subscribe-to-alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: subscription }),
        });
        
        if (response.ok) {
          setPushDebugStatus('Đăng ký Reminders thành công! ✅');
          console.log('Đăng ký nhận tin thành công trên server!');
        } else {
          const errData = await response.json().catch(() => ({}));
          setPushDebugStatus('Đồng bộ lên Vercel thất bại ❌');
          setPushDebugError(errData.error || `HTTP ${response.status} ${response.statusText || 'Internal Error'}`);
        }
      } else {
        setPushDebugStatus('Không nhận được token ❌');
      }
    } catch (e: any) {
      console.error('Không thể đăng ký Web Push:', e);
      setPushDebugStatus('Lỗi thiết lập ❌');
      setPushDebugError(e.message || String(e));
    }
  };

  const updateNotificationsEnabled = (enabled: boolean) => {
    storage.setNotificationsEnabled(enabled);
    setNotificationsEnabled(enabled);
    if (enabled) {
      if ('Notification' in window) {
        if (Notification.permission === 'denied') {
          setPushDebugStatus('Quyền bị chặn ❌');
          setPushDebugError('Vui lòng bật quyền hiển thị thông báo trong Cài đặt trang web của Trình duyệt.');
        } else if (Notification.permission !== 'granted') {
          setPushDebugStatus('Đang xin quyền thông báo...');
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              subscribeToWebPush();
            } else {
              setPushDebugStatus('Quyền bị từ chối ❌');
              setPushDebugError('Không thể tạo token nếu không có quyền hiển thị thông báo.');
            }
          });
        } else {
          subscribeToWebPush();
        }
      } else {
        setPushDebugStatus('Trình duyệt không hỗ trợ Web Notification.');
      }
    } else {
      setPushDebugStatus('Chưa kích hoạt (Đã tắt)');
      setPushDebugToken('');
      setPushDebugError('');
    }
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
    
    completed.sort((a, b) => a - b);

    const updated = {
      ...activeNovena,
      completedDays: completed
    };

    storage.setActiveNovena(updated);
    setActiveNovena(updated);
  };

  // Reset active novena
  const resetActiveNovena = () => {
    storage.setActiveNovena(null);
    setActiveNovena(null);
  };

  // Add a custom prayer (Private/Public) + Sync to Prismic API backend if public
  const addCustomPrayer = async (prayer: CustomPrayer) => {
    await storage.saveCustomPrayer(prayer);
    
    if (!prayer.isPrivate) {
      try {
        const response = await fetch('/api/submit-prayer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prayer),
        });
        if (!response.ok) {
          console.warn('Không thể đồng bộ tự động lên Prismic Server. Kinh nguyện đã được lưu cục bộ.');
        } else {
          console.log('Đã gởi đồng bộ bản nháp Public lên Prismic thành công!');
        }
      } catch (err) {
        console.error('Lỗi mạng khi đồng bộ lên Prismic:', err);
      }
    }
    
    await refreshPrayers();
  };

  // Delete a custom prayer
  const deleteCustomPrayer = async (uid: string) => {
    await storage.deleteCustomPrayer(uid);
    await refreshPrayers();
  };

  // Pin actions
  const pinPrayerAsMorning = async (uid: string | null) => {
    await storage.setFixedMorningPrayer(uid);
    setFixedMorningUid(uid);
  };

  const pinPrayerAsEvening = async (uid: string | null) => {
    await storage.setFixedEveningPrayer(uid);
    setFixedEveningUid(uid);
  };

  return {
    activeTab,
    setActiveTab,
    selectedPrayer,
    setSelectedPrayer,
    prayers,
    customPrayers,
    categories,
    loading,
    refreshPrayers,
    theme,
    updateTheme,
    userRole,
    updateUserRole,
    notificationsEnabled,
    updateNotificationsEnabled,
    activeNovena,
    startNovena,
    toggleNovenaDay,
    resetActiveNovena,
    weeklyBook,
    updateWeeklyBook,
    offlineEnabled,
    toggleOfflineCache,
    offlineSize,
    isFatimaDay,
    suggestedPrayers,
    addCustomPrayer,
    deleteCustomPrayer,
    fixedMorningUid,
    fixedEveningUid,
    pinPrayerAsMorning,
    pinPrayerAsEvening,
    pushDebugStatus,
    pushDebugToken,
    pushDebugError
  };
};
