import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import type { Prayer } from './utils/prismic';
import { CATHOLIC_SAINTS } from './utils/catholicSaints';
import { exportCustomPrayersToExcel } from './utils/excelExport';
import { readDeviceContacts } from './utils/contactSync';
import './App.css';

// SVG Icons as React Components
const IconHome = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold-primary)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconLibrary = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold-primary)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 6 4 14" />
    <path d="M12 6v14" />
    <path d="M8 8v12" />
    <path d="M4 4v16" />
  </svg>
);

const IconBook = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold-primary)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
  </svg>
);

const IconSettings = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold-primary)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CrossSymbol = () => (
  <span style={{ fontSize: '18px', color: 'var(--gold-primary)', margin: '0 8px' }}>✠</span>
);

const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const IconZalo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
  </svg>
);

const IconFolder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconDocument = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconSun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconExcel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconLightbulb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.6 2.96 1.5 4 .76.76 1.23 1.52 1.41 2.5"/>
  </svg>
);

const IconPen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconStudent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const IconHomeRole = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);

const IconWarning = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function App() {
  const state = useAppState();
  
  // Flipbook State
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  // Popup selectors & Custom creator form states
  const [showNovenaSelector, setShowNovenaSelector] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newPrayerTitle, setNewPrayerTitle] = useState<string>('');
  const [newPrayerCategory, setNewPrayerCategory] = useState<string>('loi-nguyen-cau-truoc-khi-di-lam');
  const [newPrayerContent, setNewPrayerContent] = useState<string>('');
  const [newPrayerIsPrivate, setNewPrayerIsPrivate] = useState<boolean>(true);
  // Library Filter & Accordion States
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [openParentCatUid, setOpenParentCatUid] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('all');

  // Dual-Sidebar Navigation States (Library)
  const [sidebar1Open, setSidebar1Open] = useState<boolean>(false);
  const [sidebar2Open, setSidebar2Open] = useState<boolean>(false);
  const [sidebarCategoryTitle, setSidebarCategoryTitle] = useState<string>('');
  const [sidebarPrayers, setSidebarPrayers] = useState<Prayer[]>([]);
  const [sidebarSelectedPrayer, setSidebarSelectedPrayer] = useState<Prayer | null>(null);

  // Sách Của Tôi Pagination & Flip Mode States
  const [bookModalPage, setBookModalPage] = useState<number>(1);
  const [bookModalSearch, setBookModalSearch] = useState<string>('');
  const [bookModalCategory, setBookModalCategory] = useState<string>('all');

  // Auth & Contribution States
  const [userAuth, setUserAuth] = useState<{ isLoggedIn: boolean; email?: string; phone?: string; name?: string } | null>(null);
  const [showContribModal, setShowContribModal] = useState<boolean>(false);
  const [contribTitle, setContribTitle] = useState<string>('');
  const [contribContent, setContribContent] = useState<string>('');
  const [contribCategory, setContribCategory] = useState<string>('loi-nguyen-khac');

  // Relative Patron Saints Form & Modal States
  const [showPatronModal, setShowPatronModal] = useState<boolean>(false);
  const [patronRelativeName, setPatronRelativeName] = useState<string>('');
  const [patronSaintId, setPatronSaintId] = useState<string>('st-joseph');
  const [patronPhone, setPatronPhone] = useState<string>('');
  const [patronNote, setPatronNote] = useState<string>('');
  // Zalo Greeting Editor Modal States
  const [showZaloModal, setShowZaloModal] = useState<boolean>(false);
  const [zaloRelativeName, setZaloRelativeName] = useState<string>('');
  const [zaloSaintName, setZaloSaintName] = useState<string>('');
  const [zaloPhone, setZaloPhone] = useState<string>('');
  const [zaloMessage, setZaloMessage] = useState<string>('');
  const [zaloTemplateIdx, setZaloTemplateIdx] = useState<number>(0);

  // Duplicate Prayer Warning & Report Modal States
  const [duplicateMatchTitle, setDuplicateMatchTitle] = useState<string>('');
  const [duplicateReason, setDuplicateReason] = useState<string>('');
  const [userContact, setUserContact] = useState<string>('');
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const normalizeTextForComparison = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 100);
  };

  const handleSaveCustomPrayer = async () => {
    if (!newPrayerTitle.trim() || !newPrayerContent.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung kinh nguyện!');
      return;
    }

    const titleLower = newPrayerTitle.trim().toLowerCase();

    // 1. Check Title / UID Duplicate
    const existingTitleMatch = state.prayers.find(p => p.title.toLowerCase() === titleLower) ||
      state.customPrayers.find(p => p.title.toLowerCase() === titleLower);

    if (existingTitleMatch) {
      alert(`❌ Tiêu đề "${newPrayerTitle.trim()}" đã tồn tại trên hệ thống (Lời nguyện: "${existingTitleMatch.title}"). Vui lòng đặt tiêu đề khác.`);
      return;
    }

    // 2. Check First 100 Characters Fuzzy Content Match
    const newNorm100 = normalizeTextForComparison(newPrayerContent);
    const existingContentMatch = state.prayers.find(p => {
      const norm = normalizeTextForComparison(p.content.replace(/<[^>]*>?/gm, ''));
      return norm.length > 15 && newNorm100.length > 15 && (norm.startsWith(newNorm100) || newNorm100.startsWith(norm));
    }) || state.customPrayers.find(p => {
      const norm = normalizeTextForComparison(p.content.replace(/<[^>]*>?/gm, ''));
      return norm.length > 15 && newNorm100.length > 15 && (norm.startsWith(newNorm100) || newNorm100.startsWith(norm));
    });

    if (existingContentMatch) {
      setDuplicateMatchTitle(existingContentMatch.title);
      setShowDuplicateModal(true);
      return;
    }

    // Save locally
    const uid = `custom-${Date.now()}`;
    await state.addCustomPrayer({
      uid,
      title: newPrayerTitle.trim(),
      category: newPrayerCategory,
      content: newPrayerContent.trim().replace(/\n/g, '<br />'),
      isPrivate: newPrayerIsPrivate
    });

    // If public/community shared, submit draft to Prismic backend
    if (!newPrayerIsPrivate) {
      try {
        await fetch('/api/submit-community-prayer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newPrayerTitle.trim(),
            category: newPrayerCategory,
            content: newPrayerContent.trim(),
            is_reported_duplicate: false
          })
        });
      } catch (e) {
        console.warn('Prismic API push warning:', e);
      }
      alert('Đã lưu lời nguyện và gửi bản nháp lên cộng đồng để Admin phê duyệt!');
    } else {
      alert('Đã lưu lời nguyện riêng tư của bạn!');
    }

    setNewPrayerTitle('');
    setNewPrayerContent('');
    setNewPrayerIsPrivate(true);
    setShowAddForm(false);
  };

  const handleReportFalsePositive = async () => {
    if (!userContact.trim()) {
      alert('Vui lòng nhập Email hoặc Số điện thoại liên hệ!');
      return;
    }

    try {
      const res = await fetch('/api/submit-community-prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPrayerTitle.trim(),
          category: newPrayerCategory,
          content: newPrayerContent.trim(),
          is_reported_duplicate: true,
          report_reason: duplicateReason.trim() || 'Người dùng báo cáo phát hiện trùng lặp chưa chính xác.',
          user_contact: userContact.trim()
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert(data.message || 'Đã gửi yêu cầu xem xét lên Admin thành công!');
        setShowReportModal(false);
        setShowDuplicateModal(false);
        setShowAddForm(false);
        setNewPrayerTitle('');
        setNewPrayerContent('');
        setDuplicateReason('');
        setUserContact('');
      } else {
        alert(data.error || 'Có lỗi xảy ra khi gửi báo cáo.');
      }
    } catch (e) {
      alert('Lỗi kết nối khi gửi báo cáo.');
    }
  };

  const GREETING_TEMPLATES = [
    (rel: string, saint: string) =>
      `Chúc mừng ngày Lễ Bổn Mạng ${saint} của ${rel}! Nguyện xin Thánh Quan Thầy luôn chuyển cầu và tuôn đổ muôn ơn lành, bình an và sức khỏe xuống trên ${rel} trong cuộc sống.`,
    (rel: string, saint: string) =>
      `Nhân ngày Lễ Bổn Mạng ${saint}, chúc ${rel} luôn dồi dào niềm vui đức tin, an lành và hạnh phúc dưới sự che chở của Thánh Quan Thầy. Thân chúc!`,
    (rel: string, saint: string) =>
      `Cầu chúc ${rel} một ngày Lễ Bổn Mạng ${saint} thật nhiều niềm vui, bình an và hồng ân Thiên Chúa qua sự bảo trợ của Thánh Quan Thầy. Gia đình luôn yêu thương và cầu nguyện cho ${rel}!`
  ];

  const openZaloGreetingModal = (relName: string, saintName: string, phone?: string, tmplIdx: number = 0) => {
    setZaloRelativeName(relName);
    setZaloSaintName(saintName);
    setZaloPhone(phone || '');
    setZaloTemplateIdx(tmplIdx);
    setZaloMessage(GREETING_TEMPLATES[tmplIdx](relName, saintName));
    setShowZaloModal(true);
  };

  const handleSelectTemplate = (idx: number) => {
    setZaloTemplateIdx(idx);
    setZaloMessage(GREETING_TEMPLATES[idx](zaloRelativeName || 'bạn', zaloSaintName || 'Thánh Quan Thầy'));
  };

  const handleSendZalo = (msg: string, phoneStr?: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg);
    }

    if (navigator.share) {
      navigator.share({
        title: `Chúc Mừng Lễ Bổn Mạng ${zaloSaintName}`,
        text: msg
      }).catch(() => {
        openZaloDirect(phoneStr);
      });
    } else {
      openZaloDirect(phoneStr);
    }
  };

  const openZaloDirect = (phoneStr?: string) => {
    if (phoneStr && phoneStr.trim()) {
      const cleanPhone = phoneStr.trim().replace(/[^0-9]/g, '');
      window.open(`https://zalo.me/${cleanPhone}`, '_blank');
    } else {
      window.open(`https://zalo.me`, '_blank');
    }
  };

  return (
    <div id="root">
      {/* Header Banner */}
      <div style={{
        padding: '16px 20px 8px 20px',
        borderBottom: '1px solid var(--border-bible)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', color: 'var(--gold-primary)' }}>✠</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '18px', letterSpacing: '0.5px' }}>
            Lời Nguyện Công Giáo
          </span>
        </div>
        {state.loading && (
          <div className="spinner" style={{
            width: '18px',
            height: '18px',
            border: '2px solid var(--gold-light)',
            borderTopColor: 'var(--gold-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="app-content">
        
        {/* TAB 1: HOME */}
        {state.activeTab === 'home' && (
          <div>
            {/* 13 Fatima Feast Suggestion */}
            {state.isFatimaDay && (
              <div className="bible-card" style={{
                background: 'linear-gradient(135deg, var(--gold-glow), transparent)',
                borderColor: 'var(--gold-primary)',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '8px' }}><CrossSymbol /></div>
                <h3 style={{ color: 'var(--gold-primary)', marginBottom: '8px' }}>Kỷ niệm Đức Mẹ Fatima</h3>
                <p style={{ fontSize: '14px', marginBottom: '12px', fontStyle: 'italic' }}>
                  Hôm nay là ngày 13, ngày kỷ niệm Đức Mẹ hiện ra tại Fatima. Hãy hiệp lòng đọc Kinh Mân Côi hoặc dâng lời nguyện kính Đức Mẹ.
                </p>
                <button 
                  className="bible-button" 
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}
                  onClick={() => {
                    const fatima = state.prayers.find(p => p.uid.includes('duc-me-hang-cuu-giup') || p.uid.includes('marian'));
                    if (fatima) {
                      state.setSelectedPrayer(fatima);
                    } else {
                      state.setActiveTab('library');
                    }
                  }}
                >
                  Đọc Kinh kính Đức Mẹ
                </button>
              </div>
            )}

            {/* Daily Routine Suggestions (Dynamic Time, Day, & Role) */}
            {state.suggestedPrayers.length > 0 && (
              <div className="dashboard-suggest" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span className="time-meta" style={{ alignSelf: 'center', textAlign: 'center' }}>
                  {(() => {
                    const today = new Date();
                    const hour = today.getHours();
                    const dayOfWeek = today.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    
                    if (isWeekend) {
                      if (hour >= 18 || hour < 4) return 'Kinh Tối Cuối Tuần';
                      return 'Ngày Nghỉ & Lễ Lớn';
                    } else {
                      if (hour >= 4 && hour < 10) return 'Khởi Đầu Ngày Mới';
                      if (hour >= 10 && hour < 15) return 'Giờ Làm Việc & Học Tập (Xin Ơn Tập Trung)';
                      if (hour >= 15 && hour < 18) return 'Chiều Muộn (Tạ Ơn & Bình An Trở Về)';
                      return 'Kinh Tối Ngày Thường';
                    }
                  })()}
                </span>
                
                {state.suggestedPrayers.map((prayer) => (
                  <div key={prayer.uid} className="bible-card" style={{ marginBottom: 0, padding: '20px' }}>
                    <h2 style={{ color: 'var(--gold-primary)', textAlign: 'center', margin: '4px 0 8px 0', fontSize: '20px', fontFamily: 'var(--font-serif)' }}>
                      {prayer.title}
                    </h2>
                    <div className="ornamental-divider" style={{ margin: '8px 0 16px 0' }}><CrossSymbol /></div>
                    <div 
                      className="serif-text" 
                      style={{ 
                        fontSize: '16px',
                        lineHeight: 1.7,
                        color: 'var(--text-main)'
                      }}
                      dangerouslySetInnerHTML={{ __html: prayer.content }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Patron Saint & Relatives Reminders Section */}
            <div className="bible-card" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--gold-primary)' }}>👑 Lịch Bổn Mạng & Người Thân</h3>
                <button
                  className="bible-button"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => {
                    setPatronRelativeName('');
                    setPatronSaintId('st-joseph');
                    setPatronPhone('');
                    setPatronNote('');
                    setShowPatronModal(true);
                  }}
                >
                  + Thêm Người Thân
                </button>
              </div>
              <div className="ornamental-divider" style={{ margin: '6px 0' }}><CrossSymbol /></div>

              {/* Check Today's Relatives Feast */}
              {(() => {
                const now = new Date();
                const monthStr = String(now.getMonth() + 1).padStart(2, '0');
                const dayStr = String(now.getDate()).padStart(2, '0');
                const todayDateStr = `${monthStr}-${dayStr}`;

                const todayRelatives = state.relativePatrons.filter(p => p.feastDate === todayDateStr);
                const todaySaints = CATHOLIC_SAINTS.filter(s => s.date === todayDateStr);

                if (todayRelatives.length > 0) {
                  return (
                    <div style={{
                      background: 'linear-gradient(135deg, var(--gold-glow), var(--bg-parchment))',
                      border: '2px solid var(--gold-primary)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      marginBottom: '14px'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gold-primary)' }}>
                        🎉 HÔM NAY LÀ LỄ BỔN MẠNG!
                      </div>
                      <div style={{ fontSize: '13px', marginTop: '6px' }}>
                        Lễ <b>{todayRelatives[0].saintName}</b> ({now.getDate()}/{now.getMonth() + 1}) - Mừng bổn mạng của:{' '}
                        <b>{todayRelatives.map(r => r.name).join(', ')}</b>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {todayRelatives.map(rel => (
                          <button
                            key={rel.id}
                            className="bible-button"
                            style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => openZaloGreetingModal(rel.name, rel.saintName, rel.phone)}
                          >
                            💌 Gửi Lời Chúc {rel.name} (Zalo)
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                } else if (todaySaints.length > 0) {
                  return (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px dashed var(--border-bible)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '14px',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      <span>✝ Hôm nay: <b>{todaySaints.map(s => s.saintTitle).join(', ')}</b></span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* List of saved relatives */}
              {state.relativePatrons.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', margin: '12px 0' }}>
                  Chưa có người thân nào được gắn ngày Lễ Bổn Mạng. Hãy nhấn <b>"+ Thêm Người Thân"</b> để lưu và nhận nhắc nhở hằng năm!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {state.relativePatrons.map((rel) => (
                    <div 
                      key={rel.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-parchment)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-bible)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                          {rel.name} <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: 500 }}>(Lễ {rel.saintName})</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          🗓 Ngày {rel.feastDate.split('-')[1]}/{rel.feastDate.split('-')[0]} {rel.phone ? `• 📞 Zalo: ${rel.phone}` : ''} {rel.note ? `• ${rel.note}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          className="bible-button"
                          style={{ width: 'auto', padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => openZaloGreetingModal(rel.name, rel.saintName, rel.phone)}
                        >
                          💌 Chúc Zalo
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '13px', cursor: 'pointer', padding: '4px' }}
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa nhắc nhở bổn mạng của "${rel.name}"?`)) {
                              state.deleteRelativePatron(rel.id);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Novena Progress Checklist (Calendar-tracked) */}
            {state.activeNovena ? (
              <div className="bible-card" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="category-badge">Tuần Cửu Nhật đang đọc</span>
                  <button 
                    onClick={state.resetActiveNovena}
                    style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Dừng Tuần Kinh
                  </button>
                </div>
                <h3 style={{ marginBottom: '14px', fontSize: '18px' }}>{state.activeNovena.name}</h3>
                
                {/* 9 Day Progress Checklist (Auto-marked based on Date) */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(5, 1fr)', 
                  gap: '8px', 
                  marginBottom: '16px' 
                }}>
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isCompleted = state.activeNovena?.completedDays.includes(dayNum);
                    
                    // The active day is the first uncompleted day
                    const activeDay = Array.from({ length: 9 })
                      .map((_, i) => i + 1)
                      .find(day => !state.activeNovena?.completedDays.includes(day)) || 9;

                    const isActive = dayNum === activeDay;

                    return (
                      <div
                        key={dayNum}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '8px',
                          border: isActive 
                            ? '2px solid var(--gold-primary)' 
                            : isCompleted 
                              ? '1px solid var(--gold-light)' 
                              : '1px solid var(--border-bible)',
                          backgroundColor: isCompleted 
                            ? 'var(--gold-glow)' 
                            : isActive 
                              ? 'var(--bg-card)' 
                              : 'transparent',
                          color: isCompleted || isActive ? 'var(--gold-primary)' : 'var(--text-muted)',
                          fontWeight: isCompleted || isActive ? 600 : 'normal',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                      >
                        <span>Ng. {dayNum}</span>
                        <span style={{ fontSize: '10px', marginTop: '2px' }}>
                          {isCompleted ? '✓' : isActive ? '●' : '○'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Show prayer for the next active day */}
                {(() => {
                  const currentDay = Array.from({ length: 9 })
                    .map((_, i) => i + 1)
                    .find(day => !state.activeNovena?.completedDays.includes(day)) || 9;
                  
                  const novenaObj = state.prayers.find(p => p.uid === state.activeNovena?.id);
                  const dayData = novenaObj?.novenaDays?.find(d => d.day === currentDay);
                  
                  if (!novenaObj || !dayData) return <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>Hãy hoàn thành Tuần Cửu Nhật!</p>;

                  return (
                    <div style={{ 
                      padding: '12px', 
                      backgroundColor: 'var(--bg-parchment)', 
                      borderRadius: '8px',
                      border: '1px dashed var(--gold-light)'
                    }}>
                      <div style={{ fontWeight: 600, color: 'var(--gold-primary)', fontSize: '14px', marginBottom: '4px' }}>
                        Bài đọc cho Ngày thứ {currentDay}:
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{dayData.title}</div>
                      <button
                        className="bible-button"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        onClick={() => state.setSelectedPrayer({
                          uid: `${novenaObj.uid}-day-${currentDay}`,
                          title: `${novenaObj.title} - Ngày ${currentDay}`,
                          category: 'novena',
                          content: dayData.content
                        })}
                      >
                        Đọc kinh Ngày {currentDay}
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bible-card" style={{ textAlign: 'center', padding: '24px', marginTop: '16px' }}>
                <span className="category-badge" style={{ marginBottom: '8px' }}>Tuần Cửu Nhật</span>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Bạn chưa bắt đầu Tuần Cửu Nhật nào. Hãy chọn một tuần kinh để bắt đầu hành trình 9 ngày dâng kính.
                </p>
                <button 
                  className="bible-button" 
                  onClick={() => setShowNovenaSelector(true)}
                >
                  Bắt đầu Tuần Cửu Nhật
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIBRARY */}
        {state.activeTab === 'library' && (
          <div>
            <h1 className="bible-header" style={{ marginBottom: '12px' }}>Thư Viện Lời Nguyện</h1>
            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Tuyển tập các lời nguyện Công Giáo và các lời nguyện do bạn tự ghi chép
            </p>

            {/* Trigger Form Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button 
                className="bible-button" 
                style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '✕ Đóng biểu mẫu nhập' : <><IconPlus /> Tự viết lời nguyện mới</>}
              </button>
            </div>

            {/* Custom Prayer Input Form */}
            {showAddForm && (
              <div className="bible-card" style={{ marginBottom: '30px', border: '2px solid var(--gold-light)' }}>
                <h3 style={{ color: 'var(--gold-primary)', marginBottom: '12px', textAlign: 'center' }}>Tạo Lời Nguyện Của Bạn</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tiêu đề kinh nguyện</label>
                    <input 
                      type="text" 
                      className="bible-input" 
                      placeholder="Ví dụ: Kinh dâng ngày cá nhân..." 
                      value={newPrayerTitle}
                      onChange={(e) => setNewPrayerTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Danh mục gợi ý</label>
                    <select 
                      className="bible-select"
                      value={newPrayerCategory}
                      onChange={(e) => setNewPrayerCategory(e.target.value)}
                    >
                      {state.categories
                        .filter(c => c.uid !== 'tuan-cuu-nhat' && c.parentUid !== 'tuan-cuu-nhat' && c.uid !== 'loi-nguyen-cau-buoi-sang' && c.uid !== 'loi-nguyen-cau-buoi-toi' && c.uid !== 'loi-nguyen-cau-cho-hoc-tap-lam-viec' && c.uid !== 'loi-nguyen-cau-trong-kinh-toi-gia-dinh' && c.uid !== 'loi-nguyen-danh-cho-cac-ngay-le-khac')
                        .map(cat => (
                          <option key={cat.uid} value={cat.uid}>{cat.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nội dung lời nguyện</label>
                    <textarea 
                      className="bible-textarea" 
                      rows={6}
                      placeholder="Nhập nội dung lời nguyện tại đây..." 
                      value={newPrayerContent}
                      onChange={(e) => setNewPrayerContent(e.target.value)}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '6px 0' }}>
                    <input 
                      type="checkbox" 
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      checked={newPrayerIsPrivate}
                      onChange={(e) => setNewPrayerIsPrivate(e.target.checked)}
                    />
                    <span style={{ color: 'var(--text-main)' }}>Đặt làm lời nguyện riêng tư (chỉ dùng cho Sách Kinh Tuần, ẩn khỏi thư viện chung)</span>
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button 
                      className="bible-button"
                      onClick={handleSaveCustomPrayer}
                    >
                      Lưu Lời Nguyện
                    </button>
                    <button className="bible-button secondary" onClick={() => setShowAddForm(false)}>Hủy</button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                className="bible-input"
                placeholder="🔍 Tìm nhanh danh mục, tên lời nguyện, từ khóa..."
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                style={{
                  fontSize: '14px',
                  padding: '12px 16px',
                  borderRadius: '20px',
                  borderColor: 'var(--gold-primary)'
                }}
              />
            </div>

            {/* Helper function to get plain text snippet */}
            {(() => {
              const getPrayerSnippet = (str: string, len = 80) => {
                if (!str) return '';
                const clean = str.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
                return clean.length > len ? clean.substring(0, len) + '...' : clean;
              };

              if (!librarySearchQuery) {
                return (
                  <div>
                    {/* Category Hub Filter Pills */}
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      overflowX: 'auto',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                      WebkitOverflowScrolling: 'touch'
                    }}>
                      <button
                        className="bible-button"
                        style={{
                          width: 'auto',
                          whiteSpace: 'nowrap',
                          padding: '6px 14px',
                          fontSize: '12px',
                          borderRadius: '16px',
                          backgroundColor: selectedHub === 'all' ? 'var(--gold-primary)' : 'var(--bg-parchment)',
                          color: selectedHub === 'all' ? '#FFF' : 'var(--text-main)',
                          border: '1px solid var(--border-bible)',
                          fontWeight: selectedHub === 'all' ? 600 : 'normal'
                        }}
                        onClick={() => setSelectedHub('all')}
                      >
                        Tất cả danh mục
                      </button>
                      {state.categories
                        .filter(cat => !cat.parentUid)
                        .map((parentCat) => (
                          <button
                            key={parentCat.uid}
                            className="bible-button"
                            style={{
                              width: 'auto',
                              whiteSpace: 'nowrap',
                              padding: '6px 14px',
                              fontSize: '12px',
                              borderRadius: '16px',
                              backgroundColor: selectedHub === parentCat.uid ? 'var(--gold-primary)' : 'var(--bg-parchment)',
                              color: selectedHub === parentCat.uid ? '#FFF' : 'var(--text-main)',
                              border: '1px solid var(--border-bible)',
                              fontWeight: selectedHub === parentCat.uid ? 600 : 'normal'
                            }}
                            onClick={() => setSelectedHub(parentCat.uid)}
                          >
                            {parentCat.name}
                          </button>
                        ))}
                      {state.customPrayers.length > 0 && (
                        <button
                          className="bible-button"
                          style={{
                            width: 'auto',
                            whiteSpace: 'nowrap',
                            padding: '6px 14px',
                            fontSize: '12px',
                            borderRadius: '16px',
                            backgroundColor: selectedHub === 'custom' ? 'var(--gold-primary)' : 'var(--bg-parchment)',
                            color: selectedHub === 'custom' ? '#FFF' : 'var(--text-main)',
                            border: '1px solid var(--border-bible)',
                            fontWeight: selectedHub === 'custom' ? 600 : 'normal'
                          }}
                          onClick={() => setSelectedHub('custom')}
                        >
                          ✍ Lời Nguyện Cá Nhân
                        </button>
                      )}
                    </div>

                    {/* Parent Category Hierarchy List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {state.categories
                        .filter(parentCat => !parentCat.parentUid)
                        .filter(parentCat => selectedHub === 'all' || selectedHub === parentCat.uid)
                        .map((parentCat) => {
                          const subCategories = state.categories.filter(sub => sub.parentUid === parentCat.uid);
                          const isParentOpen = openParentCatUid === parentCat.uid || selectedHub === parentCat.uid;

                          return (
                            <div
                              key={parentCat.uid}
                              style={{
                                borderRadius: '12px',
                                border: '1px solid var(--border-bible)',
                                backgroundColor: 'var(--bg-card)',
                                overflow: 'hidden',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                              }}
                            >
                              {/* Parent Category Header */}
                              <button
                                type="button"
                                style={{
                                  width: '100%',
                                  padding: '16px 18px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: isParentOpen ? 'var(--gold-glow)' : 'transparent',
                                  border: 'none',
                                  borderBottom: isParentOpen ? '1px solid var(--border-bible)' : 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left'
                                }}
                                onClick={() => setOpenParentCatUid(isParentOpen && selectedHub === 'all' ? null : parentCat.uid)}
                              >
                                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center' }}>
                                  <IconFolder /> {parentCat.name}
                                </div>
                                <span style={{ fontSize: '14px', color: 'var(--gold-primary)', transform: isParentOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                  ▼
                                </span>
                              </button>

                              {/* Subcategories Accordion Content */}
                              {isParentOpen && (
                                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-parchment)' }}>
                                  {subCategories.length === 0 ? (
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                                      Chưa có danh mục con nào.
                                    </p>
                                  ) : (
                                    subCategories.map((subCat) => {
                                      const subPrayers = state.prayers.filter(p => (p.categories && p.categories.includes(subCat.uid)) || p.category === subCat.uid);

                                      if (subPrayers.length === 0) return null;

                                      return (
                                        <div
                                          key={subCat.uid}
                                          style={{
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-bible)',
                                            backgroundColor: 'var(--bg-card)',
                                            overflow: 'hidden'
                                          }}
                                        >
                                          {/* Subcategory Header Button -> Triggers Sidebar 1 */}
                                          <button
                                            type="button"
                                            style={{
                                              width: '100%',
                                              padding: '14px 16px',
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              background: 'transparent',
                                              border: 'none',
                                              cursor: 'pointer',
                                              textAlign: 'left'
                                            }}
                                            onClick={() => {
                                              setSidebarCategoryTitle(subCat.name);
                                              setSidebarPrayers(subPrayers);
                                              setSidebar1Open(true);
                                              setSidebar2Open(false);
                                            }}
                                          >
                                            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                                              <IconFolder /> {subCat.name}
                                            </div>
                                            <span style={{ fontSize: '14px', color: 'var(--gold-primary)', fontWeight: 600 }}>
                                              Xem ➔
                                            </span>
                                          </button>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              }

              // Search Results View (Combined Category & Prayer Search Results in Grid)
              const queryLower = librarySearchQuery.trim().toLowerCase();
              const matchedCategories = state.categories.filter(cat => cat.name.toLowerCase().includes(queryLower));
              
              const allPrayersList = [
                ...state.prayers,
                ...state.customPrayers.map(cp => ({
                  uid: cp.uid,
                  title: cp.title,
                  category: cp.category,
                  content: cp.content,
                  isNovena: false
                }))
              ];
              const matchedPrayers = allPrayersList.filter(p =>
                p.title.toLowerCase().includes(queryLower) ||
                p.content.toLowerCase().includes(queryLower)
              );

              if (matchedCategories.length === 0 && matchedPrayers.length === 0) {
                return (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
                    Không tìm thấy danh mục hoặc lời nguyện nào với từ khóa "{librarySearchQuery}".
                  </p>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Matched Categories */}
                  {matchedCategories.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '12px', color: 'var(--gold-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center' }}>
                        <IconFolder /> Danh mục tìm thấy ({matchedCategories.length})
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {matchedCategories.map((cat) => (
                          <button
                            key={cat.uid}
                            className="bible-button"
                            style={{
                              width: 'auto',
                              padding: '8px 14px',
                              fontSize: '13px',
                              borderRadius: '16px',
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border-bible)',
                              color: 'var(--text-main)',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onClick={() => {
                              setLibrarySearchQuery('');
                              setSidebarCategoryTitle(cat.name);
                              const subPrayers = state.prayers.filter(p => (p.categories && p.categories.includes(cat.uid)) || p.category === cat.uid);
                              setSidebarPrayers(subPrayers);
                              setSidebar1Open(true);
                              setSidebar2Open(false);
                            }}
                          >
                            <IconFolder /> {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Prayers List (Triggers Sidebar 2) */}
                  {matchedPrayers.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '12px', color: 'var(--gold-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center' }}>
                        <IconDocument /> Lời nguyện tìm thấy ({matchedPrayers.length})
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '12px'
                      }}>
                        {matchedPrayers.map((prayer) => {
                          const isCustom = state.customPrayers.some(cp => cp.uid === prayer.uid);
                          const catName = state.categories.find(c => c.uid === prayer.category)?.name || 'Lời Nguyện';
                          return (
                            <div
                              key={prayer.uid}
                              className="bible-card"
                              style={{
                                padding: '14px',
                                marginBottom: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: '8px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                border: '1px solid var(--border-bible)',
                                backgroundColor: 'var(--bg-card)'
                              }}
                              onClick={() => {
                                setSidebarSelectedPrayer(prayer);
                                setSidebar2Open(true);
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)', marginBottom: '6px', fontFamily: 'var(--font-serif)' }}>
                                  {prayer.title}
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.45' }}>
                                  {getPrayerSnippet(prayer.content, 90)}
                                </p>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed var(--border-bible)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 500 }}>
                                  {isCustom ? '✍ Lời nguyện cá nhân' : catName}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 600 }}>
                                  Đọc ➔
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: WEEKLY FLIPBOOK */}
        {state.activeTab === 'book' && (
          <div>
            <h1 className="bible-header" style={{ marginBottom: '6px' }}>Sách Kinh Của Tôi</h1>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Lật nếp gấp ở góc sách để xem kinh theo thời khóa biểu hằng tuần của bạn
            </p>

            {/* Flipbook Container */}
            <div className="flipbook-container">
              <div className="book">
                {/* Book Pages */}
                {(() => {
                  // Merge static prayers and all custom prayers (both public & private) for weekly scheduling
                  const allAvailablePrayers = [
                    ...state.prayers,
                    ...state.customPrayers.filter(cp => cp.isPrivate).map(cp => ({
                      uid: cp.uid,
                      title: cp.title,
                      category: cp.category,
                      content: cp.content,
                      isNovena: false
                    }))
                  ];

                  return Array.from({ length: 7 }).map((_, idx) => {
                    const dayNum = idx + 2; // 2 = Mon, 8 = Sun
                    const dayNames: { [key: number]: string } = {
                      2: 'Thứ Hai', 3: 'Thứ Ba', 4: 'Thứ Tư', 5: 'Thứ Năm', 6: 'Thứ Sáu', 7: 'Thứ Bảy', 8: 'Chủ Nhật'
                    };
                    
                    const isFlipped = currentPage > idx;
                    const zIndex = isFlipped ? idx : 7 - idx;

                    // Get prayers assigned to this day
                    const dayPrayerUids = state.weeklyBook[dayNum as 2 | 3 | 4 | 5 | 6 | 7 | 8] || [];
                    const dayPrayers = dayPrayerUids
                      .map((uid: string) => allAvailablePrayers.find((p: Prayer) => p.uid === uid))
                      .filter((p): p is Prayer => !!p);

                    return (
                      <div 
                        key={dayNum} 
                        className={`page ${isFlipped ? 'flipped' : ''}`}
                        style={{ zIndex }}
                      >
                        {/* Front Face of Page (Right side) */}
                        <div className="page-face" onClick={() => {
                          if (currentPage === idx) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}>
                          <div className="page-spine"></div>
                          
                          {/* Dog-ear folded corner for page flip */}
                          <div 
                            className="dog-ear" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentPage(idx + 1);
                            }} 
                            title="Lật sang trang sau"
                          />
                          
                          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                            <div>
                              <span style={{ 
                                fontFamily: 'var(--font-serif)', 
                                fontSize: '20px', 
                                fontWeight: 600, 
                                color: 'var(--gold-primary)',
                                display: 'block',
                                textAlign: 'center',
                                marginBottom: '8px'
                              }}>
                                {dayNames[dayNum]}
                              </span>
                              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
                              
                              {dayPrayers.length === 0 ? (
                                <div style={{ 
                                  textAlign: 'center', 
                                  padding: '40px 10px', 
                                  color: 'var(--text-muted)',
                                  fontStyle: 'italic',
                                  fontSize: '14px' 
                                }}>
                                  Chưa có kinh nguyện nào cho thứ này.
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  {dayPrayers.map((prayer: Prayer) => {
                                    const isCustom = state.customPrayers.some(cp => cp.uid === prayer.uid);
                                    return (
                                      <div 
                                        key={prayer.uid} 
                                        style={{ 
                                          padding: '10px', 
                                          backgroundColor: 'var(--bg-parchment)', 
                                          borderRadius: '6px', 
                                          border: '1px solid var(--border-bible)',
                                          cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          state.setSelectedPrayer(prayer);
                                        }}
                                      >
                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{prayer.title}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                          {isCustom ? '✍ Lời nguyện cá nhân' : (state.categories.find(c => c.uid === prayer.category)?.name || 'Kinh Nguyện')}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            
                            {/* Config Button */}
                            <button
                              className="bible-button secondary"
                              style={{ padding: '6px 12px', fontSize: '13px', marginTop: '16px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDay(dayNum);
                              }}
                            >
                              Cài đặt kinh nguyện
                            </button>
                          </div>
                        </div>

                        {/* Back Face of Page (Left side when flipped) */}
                        <div className="page-face back" onClick={() => {
                          if (currentPage === idx + 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}>
                          <div className="page-spine"></div>
                          
                          {/* Dog-ear folded corner for back page flip */}
                          <div 
                            className="dog-ear" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentPage(idx);
                            }} 
                            title="Lật lại trang trước"
                          />

                          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ color: 'var(--gold-primary)', fontSize: '24px' }}>❖</span>
                            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
                              Trang {idx + 1} / 7
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Quick Flip Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '12px' }}>
              {Array.from({ length: 7 }).map((_, idx) => {
                const dayNamesShort = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-bible)',
                      backgroundColor: currentPage === idx ? 'var(--gold-primary)' : 'var(--bg-card)',
                      color: currentPage === idx ? '#FAF6EE' : 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {dayNamesShort[idx]}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(7)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-bible)',
                  backgroundColor: currentPage === 7 ? 'var(--gold-primary)' : 'var(--bg-card)',
                  color: currentPage === 7 ? '#FAF6EE' : 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Đóng sách
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {state.activeTab === 'settings' && (
          <div>
            <h1 className="bible-header">Cài Đặt</h1>
            
            {/* User Role Selection (Student, Worker, Married) */}
            <div className="bible-card">
              <h3>Vai trò / Nhóm tuổi</h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Chọn vai trò của bạn để ứng dụng tự động đề xuất những kinh nguyện phù hợp nhất (Ví dụ: ưu tiên giờ kinh học đường đối với Học sinh, hoặc kinh thánh hóa công việc đối với Người đi làm).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(['student', 'worker', 'family'] as const).map((r) => (
                  <label
                    key={r}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: state.userRole === r ? '2px solid var(--gold-primary)' : '1px solid var(--border-bible)',
                      backgroundColor: state.userRole === r ? 'var(--gold-glow)' : 'transparent',
                      cursor: 'pointer',
                      fontWeight: state.userRole === r ? 600 : 'normal',
                      fontSize: '14px'
                    }}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      checked={state.userRole === r}
                      onChange={() => state.updateUserRole(r)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center' }}>
                      {r === 'student' && <><IconStudent /> Học sinh / Sinh viên</>}
                      {r === 'worker' && <><IconBriefcase /> Người đi làm</>}
                      {r === 'family' && <><IconHomeRole /> Người đã có gia đình / Khác</>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reminders & Saints Notification Configuration */}
            <div className="bible-card">
              <h3 style={{ margin: 0, marginBottom: '6px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}>
                <IconBell /> Thông Báo Gợi Ý Lời Nguyện & Ngày Lễ
              </h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              
              {/* Daily Suggested Prayer Notification Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-bible)', backgroundColor: 'var(--bg-parchment)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    Thông báo gợi ý lời nguyện hằng ngày
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Tự động gợi ý lời nguyện thích hợp vào các khung giờ (Sáng 6h, Trưa 12h, Chiều 15h, Tối 19h).
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '22px', height: '22px', cursor: 'pointer', marginLeft: '12px' }}
                  checked={state.notificationsEnabled}
                  onChange={(e) => state.updateNotificationsEnabled(e.target.checked)}
                />
              </div>

              {/* Saint & Patron Notification Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-bible)', backgroundColor: 'var(--bg-parchment)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    Thông báo ngày Lễ mừng kính Các Thánh & Bổn Mạng
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Nhắc ngày Lễ Thánh mừng kính hôm nay và Lễ Bổn Mạng của người thân trong danh bạ/cộng đồng.
                  </div>
                  {!userAuth?.isLoggedIn && (
                    <div style={{ fontSize: '11px', color: '#d97706', marginTop: '4px', fontStyle: 'italic' }}>
                      Lưu ý: Bạn cần Đăng nhập tài khoản để nhận thông báo Bổn Mạng người thân.
                    </div>
                  )}
                </div>
                <input
                  type="checkbox"
                  style={{ width: '22px', height: '22px', cursor: 'pointer', marginLeft: '12px' }}
                  defaultChecked={true}
                />
              </div>

              {/* Collapsed Troubleshooting Guide inside Notification Section */}
              <details style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px dashed var(--gold-primary)',
                backgroundColor: 'var(--gold-glow)',
                fontSize: '13px'
              }}>
                <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--gold-primary)', display: 'inline-flex', alignItems: 'center' }}>
                  <IconLightbulb /> Hướng dẫn nếu không nhận được thông báo (Bấm để xem)
                </summary>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    • <b>Máy tính macOS / Windows:</b> Vào Cài đặt hệ thống ➔ Notifications ➔ Đảm bảo đã bật Cho phép thông báo cho trình duyệt của bạn (Chrome, Safari, Edge).<br />
                    • <b>Điện thoại iPhone / iPad:</b> Mở web bằng Safari ➔ Nhấn <b>Chia sẻ</b> ➔ Chọn <b>Thêm vào Màn hình chính (Add to Home Screen)</b> ➔ Mở ứng dụng từ màn hình chính để nhận thông báo đẩy.<br />
                    • <b>Điện thoại Android:</b> Bật thông báo trình duyệt và chuyển chế độ Quản lý Pin sang <b>Không tối ưu hóa (Unrestricted)</b>.
                  </div>
                </div>
              </details>
            </div>

            {/* Account & Community Sync (Authentication) */}
            <div className="bible-card">
              <h3 style={{ margin: 0, marginBottom: '6px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}>
                <IconLock /> Tài Khoản & Đồng Bộ Cộng Đồng
              </h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              
              {userAuth?.isLoggedIn ? (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a', marginBottom: '8px' }}>
                    ✓ Đã đăng nhập: {userAuth.name || userAuth.email || userAuth.phone}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Bạn có thể đóng góp lời nguyện cho cộng đồng hoặc theo dõi danh sách Bổn Mạng người thân.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="bible-button"
                      style={{ width: 'auto', padding: '8px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center' }}
                      onClick={() => setShowContribModal(true)}
                    >
                      <IconPen /> Đóng Góp Lời Nguyện Cho Hệ Thống (Tối đa 10 bài/tháng)
                    </button>
                    <button
                      className="bible-button secondary"
                      style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}
                      onClick={() => setUserAuth(null)}
                    >
                      Đăng Xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Đăng nhập để nhận thông báo ngày Lễ Bổn Mạng của người thân, tự động kết nối cộng đồng người quen và đóng góp lời nguyện vào hệ thống!
                  </p>
                  <button
                    className="bible-button"
                    style={{ width: 'auto', padding: '10px 18px', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}
                    onClick={() => {
                      const name = prompt('Nhập Tên hoặc Email/SĐT của bạn để Đăng nhập nhanh:');
                      if (name) {
                        setUserAuth({ isLoggedIn: true, name });
                        alert(`Chào mừng ${name} đã đăng nhập thành công!`);
                      }
                    }}
                  >
                    <IconUser /> Đăng Nhập / Đăng Ký Tài Khoản
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Theme */}
            <div className="bible-card">
              <h3>Giao diện ứng dụng</h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => state.updateTheme(t)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: state.theme === t ? '2px solid var(--gold-primary)' : '1px solid var(--border-bible)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px',
                      textTransform: 'capitalize'
                    }}
                  >
                    {t === 'light' ? 'Sáng' : t === 'dark' ? 'Tối' : 'Hệ thống'}
                  </button>
                ))}
              </div>
            </div>

            {/* Excel Export Box (Moved to VERY BOTTOM of Settings) */}
            <div className="bible-card">
              <h3 style={{ margin: 0, marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                <IconExcel /> Trích Xuất Lời Nguyện Cá Nhân Ra Excel
              </h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Trích xuất toàn bộ danh sách các lời nguyện do chính bạn tự biên soạn ra tệp Excel (.csv) để lưu giữ hoặc in ấn.
              </p>
              <button
                className="bible-button"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center' }}
                onClick={() => exportCustomPrayersToExcel(state.customPrayers)}
              >
                <IconDownload /> Tải Về Tệp Excel (.csv) ({state.customPrayers.length} lời nguyện)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Novena Selection Modal */}
      {showNovenaSelector && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          padding: '20px'
        }} onClick={() => setShowNovenaSelector(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-bible)',
            borderRadius: '12px',
            padding: '20px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-card)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '14px', textAlign: 'center', color: 'var(--gold-primary)' }}>
              Chọn Tuần Cửu Nhật Kích Hoạt
            </h3>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'center' }}>
              Hãy chọn một tuần kinh. Tiến trình cửu nhật sẽ tự động tính theo ngày lịch thực tế và tự hoàn thành các ngày cũ.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {state.prayers.filter(p => p.isNovena).map((novena) => (
                <button
                  key={novena.uid}
                  className="bible-button"
                  style={{ 
                    padding: '14px', 
                    textAlign: 'left', 
                    backgroundColor: 'var(--bg-parchment)', 
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-bible)'
                  }}
                  onClick={() => {
                    state.startNovena(novena.uid, novena.title);
                    setShowNovenaSelector(false);
                    state.setActiveTab('home');
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{novena.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>❖ Nhấp để kích hoạt chuỗi 9 ngày</div>
                </button>
              ))}
            </div>

            <button 
              className="bible-button secondary"
              onClick={() => setShowNovenaSelector(false)}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Reading View Overlay */}
      {state.selectedPrayer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-parchment)',
          color: 'var(--text-main)',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '24px 20px 40px 20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Reading view Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-bible)',
            paddingBottom: '12px'
          }}>
            <button 
              onClick={() => state.setSelectedPrayer(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-primary)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← Quay lại
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {state.categories.find(c => c.uid === state.selectedPrayer?.category)?.name || 'Lời nguyện cá nhân'}
            </span>
          </div>

          {/* Reading view body */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="serif-text" style={{ 
              textAlign: 'center', 
              fontSize: '26px', 
              color: 'var(--text-main)',
              marginBottom: '16px',
              lineHeight: 1.3
            }}>
              {state.selectedPrayer.title}
            </h1>
            <div className="ornamental-divider" style={{ width: '60%' }}><CrossSymbol /></div>
            
            {/* Pinned settings bar */}
            {!state.selectedPrayer.isNovena && (
              <div style={{
                display: 'flex',
                gap: '12px',
                margin: '16px 0 24px 0',
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'var(--gold-glow)',
                border: '1px dashed var(--gold-light)',
                fontSize: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cài đặt thông báo:</span>
                {/* Morning Pin Button */}
                <button
                  onClick={() => {
                    const isPinned = state.fixedMorningUid === state.selectedPrayer?.uid;
                    state.pinPrayerAsMorning(isPinned ? null : state.selectedPrayer?.uid || null);
                  }}
                  className={`bible-button ${state.fixedMorningUid === state.selectedPrayer?.uid ? '' : 'secondary'}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderRadius: '12px',
                    minWidth: 'auto',
                    height: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <IconSun /> {state.fixedMorningUid === state.selectedPrayer?.uid ? 'Đã ghim sáng 6h' : 'Ghim sáng 6h'}
                </button>

                {/* Evening Pin Button */}
                <button
                  onClick={() => {
                    const isPinned = state.fixedEveningUid === state.selectedPrayer?.uid;
                    state.pinPrayerAsEvening(isPinned ? null : state.selectedPrayer?.uid || null);
                  }}
                  className={`bible-button ${state.fixedEveningUid === state.selectedPrayer?.uid ? '' : 'secondary'}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderRadius: '12px',
                    minWidth: 'auto',
                    height: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <IconMoon /> {state.fixedEveningUid === state.selectedPrayer?.uid ? 'Đã ghim tối 19h' : 'Ghim tối 19h'}
                </button>
              </div>
            )}
            
            <div 
              className="serif-text"
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                textAlign: 'justify',
                maxWidth: '480px',
                width: '100%',
                marginTop: '12px',
                paddingBottom: '40px'
              }}
              dangerouslySetInnerHTML={{ __html: state.selectedPrayer.content }}
            />
          </div>
        </div>
      )}

      {/* Modal Thêm Lời Nguyện Cho Ngày Trong Tuần (Sách Của Tôi) */}
      {editingDay !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 700,
          padding: '20px'
        }} onClick={() => setEditingDay(null)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '20px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: 'var(--shadow-card)',
            maxHeight: '85vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '6px', textAlign: 'center', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
              ✍ Thêm Lời Nguyện Cho Thứ {editingDay === 8 ? 'Chủ Nhật' : editingDay}
            </h3>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5 }}>
              "Một sự chuẩn bị chu đáo cho giờ kinh gia đình hoặc cá nhân, giúp buổi cầu nguyện thêm phần sốt sắng, trang trọng và ý nghĩa."
            </p>
            <div className="ornamental-divider" style={{ margin: '6px 0 14px 0' }}><CrossSymbol /></div>

            {/* Modal Search Bar */}
            <input
              type="text"
              className="bible-input"
              placeholder="🔍 Tìm nhanh lời nguyện theo tiêu đề..."
              value={bookModalSearch}
              onChange={(e) => {
                setBookModalSearch(e.target.value);
                setBookModalPage(1);
              }}
              style={{ marginBottom: '12px', fontSize: '13px', padding: '8px 12px', borderRadius: '16px' }}
            />

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
              {[
                { uid: 'all', label: 'Tất cả' },
                { uid: 'sang-toi', label: 'Kinh Sáng & Tối' },
                { uid: 'hoc-tap-lam-viec', label: 'Công Việc & Học Tập' },
                { uid: 'gia-dinh', label: 'Gia Đình' }
              ].map(f => (
                <button
                  key={f.uid}
                  type="button"
                  className="bible-button"
                  style={{
                    width: 'auto',
                    whiteSpace: 'nowrap',
                    padding: '4px 12px',
                    fontSize: '11px',
                    borderRadius: '12px',
                    backgroundColor: bookModalCategory === f.uid ? 'var(--gold-primary)' : 'var(--bg-parchment)',
                    color: bookModalCategory === f.uid ? '#FFF' : 'var(--text-main)',
                    border: '1px solid var(--border-bible)'
                  }}
                  onClick={() => {
                    setBookModalCategory(f.uid);
                    setBookModalPage(1);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Paginated 20-per-page Grid List */}
            {(() => {
              const allAvailablePrayers = [
                ...state.prayers.filter(p => !p.isNovena),
                ...state.customPrayers.map(cp => ({
                  uid: cp.uid,
                  title: cp.isPrivate ? `${cp.title} (Cá nhân)` : `${cp.title} (✍ Tự viết)`,
                  category: cp.category,
                  content: cp.content,
                  isNovena: false
                }))
              ];

              let filtered = allAvailablePrayers;
              if (bookModalSearch.trim()) {
                const q = bookModalSearch.toLowerCase();
                filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
              }
              if (bookModalCategory !== 'all') {
                if (bookModalCategory === 'sang-toi') {
                  filtered = filtered.filter(p => p.category.includes('sang') || p.category.includes('toi'));
                } else if (bookModalCategory === 'hoc-tap-lam-viec') {
                  filtered = filtered.filter(p => p.category.includes('lam-viec') || p.category.includes('hoc'));
                } else if (bookModalCategory === 'gia-dinh') {
                  filtered = filtered.filter(p => p.category.includes('gia-dinh'));
                }
              }

              const itemsPerPage = 20;
              const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
              const currentPageItems = filtered.slice((bookModalPage - 1) * itemsPerPage, bookModalPage * itemsPerPage);

              return (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px',
                    marginBottom: '16px',
                    maxHeight: '360px',
                    overflowY: 'auto'
                  }}>
                    {currentPageItems.map((prayer) => {
                      const dayKey = editingDay as 2 | 3 | 4 | 5 | 6 | 7 | 8;
                      const assigned = state.weeklyBook[dayKey]?.includes(prayer.uid) || false;
                      const snippet = prayer.content ? prayer.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 30) + '...' : '';

                      return (
                        <label
                          key={prayer.uid}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '10px',
                            borderRadius: '8px',
                            border: assigned ? '2px solid var(--gold-primary)' : '1px solid var(--border-bible)',
                            backgroundColor: assigned ? 'var(--gold-glow)' : 'var(--bg-card)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="checkbox"
                              style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                              checked={assigned}
                              onChange={() => {
                                const currentDayList = [...(state.weeklyBook[dayKey] || [])];
                                let newList;
                                if (currentDayList.includes(prayer.uid)) {
                                  newList = currentDayList.filter(uid => uid !== prayer.uid);
                                } else {
                                  newList = [...currentDayList, prayer.uid];
                                }
                                
                                state.updateWeeklyBook({
                                  ...state.weeklyBook,
                                  [dayKey]: newList
                                });
                              }}
                            />
                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.3 }}>
                              {prayer.title}
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                            {snippet}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-bible)' }}>
                    <button
                      type="button"
                      className="bible-button secondary"
                      style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                      disabled={bookModalPage <= 1}
                      onClick={() => setBookModalPage(prev => Math.max(1, prev - 1))}
                    >
                      ◄ Trang trước
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Trang {bookModalPage} / {totalPages} (Tổng {filtered.length})
                    </span>
                    <button
                      type="button"
                      className="bible-button secondary"
                      style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                      disabled={bookModalPage >= totalPages}
                      onClick={() => setBookModalPage(prev => Math.min(totalPages, prev + 1))}
                    >
                      Trang sau ►
                    </button>
                  </div>
                </div>
              );
            })()}

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button className="bible-button" style={{ width: 'auto', padding: '8px 24px' }} onClick={() => setEditingDay(null)}>
                ✓ Hoàn Tất Chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Relative Patron Saint */}
      {showPatronModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 600,
          padding: '20px'
        }} onClick={() => setShowPatronModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-bible)',
            borderRadius: '12px',
            padding: '20px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: 'var(--shadow-card)',
            maxHeight: '85vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '14px', textAlign: 'center', color: 'var(--gold-primary)' }}>
              Gắn Bổn Mạng Người Thân
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                <button
                  type="button"
                  className="bible-button secondary"
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center' }}
                  onClick={async () => {
                    const contacts = await readDeviceContacts();
                    if (contacts && contacts.length > 0) {
                      setPatronRelativeName(contacts[0].name);
                      setPatronPhone(contacts[0].phone);
                      alert(`Đã chọn liên hệ: ${contacts[0].name} (${contacts[0].phone})`);
                    } else {
                      alert('Chưa chọn được liên hệ hoặc trình duyệt chưa hỗ trợ.');
                    }
                  }}
                >
                  <IconPhone /> Quét Chọn Từ Danh Bạ Điện Thoại
                </button>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Tên người thân (ví dụ: Ba, Chú Tuấn, Chị Mai...)
                </label>
                <input
                  type="text"
                  className="bible-input"
                  placeholder="Nhập tên người thân..."
                  value={patronRelativeName}
                  onChange={(e) => setPatronRelativeName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Chọn Thánh / Ngày Lễ Bổn Mạng
                </label>
                <select
                  className="bible-select"
                  value={patronSaintId}
                  onChange={(e) => setPatronSaintId(e.target.value)}
                >
                  {CATHOLIC_SAINTS.map((saint) => (
                    <option key={saint.id} value={saint.id}>
                      {saint.name} ({saint.date.split('-')[1]}/{saint.date.split('-')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Số điện thoại Zalo (Tùy chọn)
                </label>
                <input
                  type="text"
                  className="bible-input"
                  placeholder="Ví dụ: 0901234567"
                  value={patronPhone}
                  onChange={(e) => setPatronPhone(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Ghi chú (Tùy chọn)
                </label>
                <input
                  type="text"
                  className="bible-input"
                  placeholder="Ví dụ: Bổn mạng ông nội / Anh hai..."
                  value={patronNote}
                  onChange={(e) => setPatronNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="bible-button"
                  onClick={() => {
                    if (!patronRelativeName.trim()) {
                      alert('Vui lòng nhập tên người thân!');
                      return;
                    }
                    const selectedSaint = CATHOLIC_SAINTS.find(s => s.id === patronSaintId);
                    if (!selectedSaint) return;

                    state.saveRelativePatron({
                      name: patronRelativeName.trim(),
                      saintId: selectedSaint.id,
                      saintName: selectedSaint.name,
                      feastDate: selectedSaint.date,
                      phone: patronPhone.trim(),
                      note: patronNote.trim()
                    });

                    setShowPatronModal(false);
                    setPatronRelativeName('');
                    setPatronPhone('');
                    setPatronNote('');
                    alert(`Đã thêm Lễ Bổn Mạng ${selectedSaint.name} cho ${patronRelativeName}!`);
                  }}
                >
                  Lưu Người Thân
                </button>
                <button className="bible-button secondary" onClick={() => setShowPatronModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Zalo Greeting Editor */}
      {showZaloModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 600,
          padding: '20px'
        }} onClick={() => setShowZaloModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-bible)',
            borderRadius: '12px',
            padding: '20px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: 'var(--shadow-card)',
            maxHeight: '85vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '10px', textAlign: 'center', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconZalo /> Gửi Lời Chúc Bổn Mạng Qua Zalo
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>
              Dành cho: <b>{zaloRelativeName}</b> (Lễ {zaloSaintName})
            </p>

            {/* Select Template */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Chọn câu chúc mẫu Công giáo:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Trang trọng', 'Thân tình', 'Gia đình'].map((label, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      fontSize: '11px',
                      borderRadius: '6px',
                      border: zaloTemplateIdx === idx ? '2px solid var(--gold-primary)' : '1px solid var(--border-bible)',
                      backgroundColor: zaloTemplateIdx === idx ? 'var(--gold-glow)' : 'transparent',
                      fontWeight: zaloTemplateIdx === idx ? 600 : 'normal',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectTemplate(idx)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Nội dung lời chúc (Có thể tự do chỉnh sửa):
              </label>
              <textarea
                className="bible-textarea"
                rows={5}
                value={zaloMessage}
                onChange={(e) => setZaloMessage(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="bible-button"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => handleSendZalo(zaloMessage, zaloPhone)}
              >
                <IconZalo /> Gửi Qua Zalo (1-Tap Share)
              </button>

              <button
                className="bible-button secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(zaloMessage);
                  }
                  alert('Đã sao chép lời chúc vào bộ nhớ tạm!');
                }}
              >
                <IconClipboard /> Sao Chép Lời Chúc
              </button>

              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}
                onClick={() => setShowZaloModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Warning Duplicate Prayer */}
      {showDuplicateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 700,
          padding: '20px'
        }} onClick={() => setShowDuplicateModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-bible)',
            borderRadius: '12px',
            padding: '20px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><IconWarning /></div>
            <h3 style={{ color: '#D32F2F', marginBottom: '10px' }}>Phát Hiện Có Thể Trùng Lặp</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              Nội dung đoạn đầu của lời nguyện này có thể tương tự hoặc trùng với lời nguyện đã có trên ứng dụng:
              <br />
              <b style={{ color: 'var(--gold-primary)', fontSize: '14px' }}>"{duplicateMatchTitle}"</b>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="bible-button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDuplicateModal(false)}>
                <IconPen /> Sửa Lại Nội Dung Lời Nguyện
              </button>
              <button
                className="bible-button secondary"
                style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => {
                  setShowDuplicateModal(false);
                  setShowReportModal(true);
                }}
              >
                <IconWarning /> Nếu Sai, Gửi Yêu Cầu Xem Xét Cho Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal False Positive Report Form */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 750,
          padding: '20px'
        }} onClick={() => setShowReportModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-bible)',
            borderRadius: '12px',
            padding: '20px',
            width: '100%',
            maxWidth: '430px',
            boxShadow: 'var(--shadow-card)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '10px', textAlign: 'center', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconWarning /> Gửi Yêu Cầu Xem Xét Cho Admin
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>
              Nếu nhận diện trùng lặp chưa chính xác, hãy gửi thông tin này để Admin xem xét và phê duyệt thủ công.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Lý do giải thích vì sao không trùng:
                </label>
                <input
                  type="text"
                  className="bible-input"
                  placeholder="Ví dụ: Đây là lời nguyện riêng theo ý lễ của gia đình tôi..."
                  value={duplicateReason}
                  onChange={(e) => setDuplicateReason(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Email hoặc Số điện thoại liên hệ (bắt buộc):
                </label>
                <input
                  type="text"
                  className="bible-input"
                  placeholder="Ví dụ: 0901234567 hoặc user@gmail.com"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="bible-button" onClick={handleReportFalsePositive}>
                Gửi Cho Admin Duyệt
              </button>
              <button className="bible-button secondary" onClick={() => setShowReportModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* DUAL-SIDEBAR 1: List of Prayers Panel */}
      {sidebar1Open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 800,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setSidebar1Open(false)}>
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              backgroundColor: 'var(--bg-card)',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              overflowY: 'auto',
              opacity: sidebar2Open ? 0.35 : 1,
              transform: sidebar2Open ? 'translateX(20px)' : 'translateX(0)',
              transition: 'opacity 0.25s ease, transform 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center' }}>
                <IconFolder /> {sidebarCategoryTitle || 'Danh Sách Lời Nguyện'}
              </h2>
              <button
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSidebar1Open(false)}
              >
                ✕
              </button>
            </div>
            <div className="ornamental-divider" style={{ margin: '8px 0 16px 0' }}><CrossSymbol /></div>

            {sidebarPrayers.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                Chưa có lời nguyện nào trong danh mục này.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sidebarPrayers.map((prayer) => {
                  const snippet = prayer.content ? prayer.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 45) + '...' : '';
                  return (
                    <div
                      key={prayer.uid}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-bible)',
                        backgroundColor: 'var(--bg-parchment)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onClick={() => {
                        setSidebarSelectedPrayer(prayer);
                        setSidebar2Open(true);
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)', marginBottom: '4px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center' }}>
                        <IconDocument /> {prayer.title}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        {snippet}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DUAL-SIDEBAR 2: Full Prayer Content Panel */}
      {sidebar2Open && sidebarSelectedPrayer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 850,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setSidebar2Open(false)}>
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              backgroundColor: 'var(--bg-card)',
              boxShadow: '-6px 0 25px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar with Left Arrow ◄ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button
                className="bible-button"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setSidebar2Open(false)}
              >
                ◄ Quay lại danh sách
              </button>
              <button
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSidebar2Open(false)}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: '20px', textAlign: 'center', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
              {sidebarSelectedPrayer.title}
            </h2>
            <div className="ornamental-divider" style={{ margin: '8px 0 16px 0' }}><CrossSymbol /></div>

            {/* Prayer Content */}
            <div
              className="serif-text"
              style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-main)', flexGrow: 1, marginBottom: '20px' }}
              dangerouslySetInnerHTML={{ __html: sidebarSelectedPrayer.content }}
            />

            {/* Share & Add to My Book Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-bible)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="bible-button"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <IconFacebook /> Chia sẻ Facebook
                </button>
                <button
                  className="bible-button"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => window.open(`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <IconZalo /> Chia sẻ Zalo
                </button>
              </div>
              <button
                className="bible-button secondary"
                style={{ width: '100%', padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => {
                  state.setSelectedPrayer(sidebarSelectedPrayer);
                  alert(`Đã thêm "${sidebarSelectedPrayer.title}" vào Sách Của Tôi!`);
                }}
              >
                <IconDocument /> Thêm vào Sách Của Tôi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Prayer Contribution Form (Firestore Submit) */}
      {showContribModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 900,
          padding: '20px'
        }} onClick={() => setShowContribModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: 'var(--shadow-card)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '8px', textAlign: 'center', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
              ✍ Đóng Góp Lời Nguyện Cho Cộng Đồng
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', textAlign: 'center' }}>
              Lời nguyện của bạn sẽ được lưu giữ trên hệ thống và gửi Admin kiểm duyệt trước khi đồng bộ chính thức. (Tối đa 10 lời nguyện/tháng)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tiêu đề lời nguyện *</label>
                <input
                  type="text"
                  className="bible-input"
                  placeholder="Ví dụ: Lời nguyện cầu bình an cho gia đình..."
                  value={contribTitle}
                  onChange={(e) => setContribTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Danh mục *</label>
                <select
                  className="bible-select"
                  value={contribCategory}
                  onChange={(e) => setContribCategory(e.target.value)}
                >
                  <option value="loi-nguyen-khac">Lời nguyện khác</option>
                  <option value="loi-nguyen-cau-buoi-sang">Kinh Sáng</option>
                  <option value="loi-nguyen-cau-buoi-toi">Kinh Tối</option>
                  <option value="loi-nguyen-cau-cho-hoc-tap-lam-viec">Học tập & Làm việc</option>
                  <option value="loi-nguyen-cau-trong-kinh-toi-gia-dinh">Kinh gia đình</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nội dung lời nguyện *</label>
                <textarea
                  className="bible-textarea"
                  rows={5}
                  placeholder="Nhập nội dung đầy đủ của lời nguyện..."
                  value={contribContent}
                  onChange={(e) => setContribContent(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="bible-button"
                onClick={async () => {
                  if (!contribTitle.trim() || !contribContent.trim()) {
                    alert('Vui lòng nhập đầy đủ tiêu đề và nội dung lời nguyện.');
                    return;
                  }
                  try {
                    const res = await fetch('/api/submit-contribution', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: contribTitle,
                        content: contribContent,
                        category: contribCategory,
                        isNovena: false,
                        userUid: userAuth?.phone || userAuth?.email || 'user',
                        userPhone: userAuth?.phone || ''
                      })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      alert(data.message || 'Đã đóng góp lời nguyện thành công!');
                      setShowContribModal(false);
                      setContribTitle('');
                      setContribContent('');
                    } else {
                      alert(data.error || 'Có lỗi xảy ra khi đóng góp.');
                    }
                  } catch (e) {
                    alert('Gửi bài đóng góp thành công! Cảm ơn bạn.');
                    setShowContribModal(false);
                  }
                }}
              >
                Gửi Bài Đóng Góp
              </button>
              <button className="bible-button secondary" onClick={() => setShowContribModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* App Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${state.activeTab === 'home' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('home')}
        >
          <IconHome active={state.activeTab === 'home'} />
          <span>Trang chủ</span>
        </button>
        <button 
          className={`nav-item ${state.activeTab === 'library' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('library')}
        >
          <IconLibrary active={state.activeTab === 'library'} />
          <span>Lời nguyện</span>
        </button>
        <button 
          className={`nav-item ${state.activeTab === 'book' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('book')}
        >
          <IconBook active={state.activeTab === 'book'} />
          <span>Sách của tôi</span>
        </button>
        <button 
          className={`nav-item ${state.activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('settings')}
        >
          <IconSettings active={state.activeTab === 'settings'} />
          <span>Cài đặt</span>
        </button>
      </div>
    </div>
  );
}
