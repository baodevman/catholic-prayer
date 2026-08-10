import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import type { Prayer } from './utils/prismic';
import { CATHOLIC_SAINTS } from './utils/catholicSaints';
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
  const [openCategoryUid, setOpenCategoryUid] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('all');

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
    alert('Đã sao chép lời chúc vào bộ nhớ tạm và mở Zalo! Bạn có thể dán (Paste) để gửi tin nhắn cho người thân.');
  };

  // Local backups JSON generation
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        weeklyBook: state.weeklyBook,
        activeNovena: state.activeNovena,
        notificationsEnabled: state.notificationsEnabled,
        userRole: state.userRole,
        customPrayers: state.customPrayers,
        relativePatrons: state.relativePatrons
      })
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `catholic_prayer_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.weeklyBook) state.updateWeeklyBook(parsed.weeklyBook);
          if (parsed.notificationsEnabled !== undefined) state.updateNotificationsEnabled(parsed.notificationsEnabled);
          if (parsed.userRole) state.updateUserRole(parsed.userRole);
          
          if (parsed.customPrayers && Array.isArray(parsed.customPrayers)) {
            for (const cp of parsed.customPrayers) {
              await state.addCustomPrayer(cp);
            }
          }
          if (parsed.relativePatrons && Array.isArray(parsed.relativePatrons)) {
            for (const rp of parsed.relativePatrons) {
              state.saveRelativePatron(rp);
            }
          }
          alert('Khôi phục dữ liệu sao lưu thành công!');
        } catch {
          alert('Tệp sao lưu không hợp lệ!');
        }
      };
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
            Kinh Nguyện Công Giáo
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
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚜</div>
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
                  <div key={prayer.uid} className="bible-card" style={{ marginBottom: 0, padding: '16px' }}>
                    <h3 style={{ color: 'var(--gold-primary)', textAlign: 'center', margin: '4px 0 8px 0', fontSize: '16px' }}>
                      {prayer.title}
                    </h3>
                    <div className="ornamental-divider" style={{ margin: '6px 0' }}><CrossSymbol /></div>
                    <div 
                      className="serif-text" 
                      style={{ 
                        maxHeight: '80px', 
                        overflow: 'hidden', 
                        fontSize: '14px',
                        lineHeight: 1.5,
                        color: 'var(--text-muted)',
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                      }}
                      dangerouslySetInnerHTML={{ __html: prayer.content }}
                    />
                    <button 
                      className="bible-button" 
                      style={{ marginTop: '12px', padding: '8px 12px', fontSize: '13px' }}
                      onClick={() => state.setSelectedPrayer(prayer)}
                    >
                      Đọc kinh nguyện này
                    </button>
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
            <h1 className="bible-header" style={{ marginBottom: '12px' }}>Thư Viện Kinh Nguyện</h1>
            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Tuyển tập các kinh nguyện Công Giáo và các lời nguyện do bạn tự ghi chép
            </p>

            {/* Trigger Form Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button 
                className="bible-button" 
                style={{ width: 'auto', padding: '10px 20px', fontSize: '14px' }}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '✕ Đóng biểu mẫu nhập' : '✍ Tự viết lời nguyện mới'}
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
                placeholder="🔍 Tìm nhanh tên lời nguyện, từ khóa..."
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                style={{
                  fontSize: '14px',
                  padding: '10px 14px',
                  borderRadius: '20px',
                  borderColor: 'var(--gold-primary)'
                }}
              />
            </div>

            {/* Category Hub Filter Pills (Dynamically generated from Prismic Top-Level Categories) */}
            {!librarySearchQuery && (
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
                  Tất cả
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
            )}

            {/* Search Results View */}
            {librarySearchQuery.trim() ? (
              <div>
                <h3 style={{ fontSize: '13px', color: 'var(--gold-primary)', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Kết quả tìm kiếm cho: "{librarySearchQuery}"
                </h3>
                {(() => {
                  const queryLower = librarySearchQuery.trim().toLowerCase();
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
                  const searchResults = allPrayersList.filter(p =>
                    p.title.toLowerCase().includes(queryLower) ||
                    p.content.toLowerCase().includes(queryLower)
                  );

                  if (searchResults.length === 0) {
                    return (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px' }}>
                        Không tìm thấy lời nguyện nào phù hợp.
                      </p>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {searchResults.map((prayer) => {
                        const isCustom = state.customPrayers.some(cp => cp.uid === prayer.uid);
                        return (
                          <div
                            key={prayer.uid}
                            className="bible-card"
                            style={{
                              padding: '12px 14px',
                              marginBottom: 0,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() => state.setSelectedPrayer(prayer)}
                          >
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '15px' }}>{prayer.title}</div>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {isCustom ? '✍ Lời nguyện cá nhân' : (state.categories.find(c => c.uid === prayer.category)?.name || 'Kinh Nguyện')}
                              </span>
                            </div>
                            <button className="bible-button" style={{ width: 'auto', padding: '4px 10px', fontSize: '11px' }}>
                              Xem
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Accordion Folders View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {state.categories
                  .filter(cat => cat.parentUid)
                  .filter(cat => {
                    if (selectedHub === 'all') return true;
                    if (selectedHub === 'custom') return false;
                    return cat.parentUid === selectedHub || cat.uid === selectedHub;
                  })
                  .map((cat) => {
                    const catPrayers = state.prayers.filter(p => p.category === cat.uid);
                    const parentCat = state.categories.find(c => c.uid === cat.parentUid);
                    const displayName = parentCat ? `${parentCat.name} ➔ ${cat.name}` : cat.name;
                    const isOpen = openCategoryUid === cat.uid;

                    return (
                      <div
                        key={cat.uid}
                        style={{
                          borderRadius: '10px',
                          border: '1px solid var(--border-bible)',
                          backgroundColor: 'var(--bg-card)',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Folder Header Button */}
                        <button
                          type="button"
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: isOpen ? 'var(--gold-glow)' : 'transparent',
                            border: 'none',
                            borderBottom: isOpen ? '1px solid var(--border-bible)' : 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                          onClick={() => setOpenCategoryUid(isOpen ? null : cat.uid)}
                        >
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                            📁 {displayName} <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: 500 }}>({catPrayers.length})</span>
                          </div>
                          <span style={{ fontSize: '14px', color: 'var(--gold-primary)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            ▼
                          </span>
                        </button>

                        {/* Collapsible Content */}
                        {isOpen && (
                          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--bg-parchment)' }}>
                            {catPrayers.length === 0 ? (
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                                Chưa có lời nguyện nào trong danh mục này.
                              </p>
                            ) : (
                              catPrayers.map((prayer) => {
                                const isCustom = state.customPrayers.some(cp => cp.uid === prayer.uid);
                                return (
                                  <div
                                    key={prayer.uid}
                                    style={{
                                      padding: '10px 12px',
                                      borderRadius: '8px',
                                      backgroundColor: 'var(--bg-card)',
                                      border: '1px solid var(--border-bible)',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => state.setSelectedPrayer(prayer)}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 500, fontSize: '14px' }}>{prayer.title}</div>
                                      {prayer.isNovena && (
                                        <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 600 }}>
                                          ❖ Chuỗi 9 ngày
                                        </span>
                                      )}
                                      {isCustom && (
                                        <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontStyle: 'italic' }}>
                                          ✍ Lời nguyện cá nhân
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                      {prayer.isNovena && state.activeNovena?.id !== prayer.uid && (
                                        <button
                                          className="bible-button"
                                          style={{ width: 'auto', padding: '4px 10px', fontSize: '11px' }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            state.startNovena(prayer.uid, prayer.title);
                                            state.setActiveTab('home');
                                          }}
                                        >
                                          Kích hoạt
                                        </button>
                                      )}
                                      {isCustom && (
                                        <button
                                          style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (confirm(`Bạn có chắc muốn xóa lời nguyện "${prayer.title}"?`)) {
                                              await state.deleteCustomPrayer(prayer.uid);
                                            }
                                          }}
                                        >
                                          🗑️
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* User's Custom Prayers Accordion Folder */}
                {state.customPrayers.length > 0 && (selectedHub === 'all' || selectedHub === 'custom') && (
                  <div
                    style={{
                      borderRadius: '10px',
                      border: '1px solid var(--gold-primary)',
                      backgroundColor: 'var(--bg-card)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: openCategoryUid === 'user-custom-folder' ? 'var(--gold-glow)' : 'transparent',
                        border: 'none',
                        borderBottom: openCategoryUid === 'user-custom-folder' ? '1px solid var(--border-bible)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onClick={() => setOpenCategoryUid(openCategoryUid === 'user-custom-folder' ? null : 'user-custom-folder')}
                    >
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--gold-primary)' }}>
                        ✍ Lời Nguyện Cá Nhân Của Tôi <span style={{ fontSize: '12px', fontWeight: 500 }}>({state.customPrayers.length})</span>
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--gold-primary)', transform: openCategoryUid === 'user-custom-folder' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        ▼
                      </span>
                    </button>

                    {openCategoryUid === 'user-custom-folder' && (
                      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--bg-parchment)' }}>
                        {state.customPrayers.map((cp) => (
                          <div
                            key={cp.uid}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border-bible)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() => state.setSelectedPrayer({
                              uid: cp.uid,
                              title: cp.title,
                              category: cp.category,
                              content: cp.content
                            })}
                          >
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '14px' }}>{cp.title}</div>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {cp.isPrivate ? '🔒 Riêng tư' : '🌐 Công cộng (Bản nháp)'}
                              </span>
                            </div>
                            <button
                              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm(`Bạn có chắc muốn xóa lời nguyện "${cp.title}"?`)) {
                                  await state.deleteCustomPrayer(cp.uid);
                                }
                              }}
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
                    <span style={{ color: 'var(--text-main)' }}>
                      {r === 'student' && '📚 Học sinh / Sinh viên'}
                      {r === 'worker' && '💼 Người đi làm'}
                      {r === 'family' && '🏠 Người đã có gia đình / Khác'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Offline Storage Cache Toggle */}
            <div className="bible-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>Tải Đọc Ngoại Tuyến (Offline)</h3>
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={state.offlineEnabled}
                  onChange={(e) => state.toggleOfflineCache(e.target.checked)}
                />
              </div>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Tải toàn bộ cơ sở dữ liệu kinh nguyện hiện tại về bộ nhớ trình duyệt để đọc khi mất mạng.
              </p>
              {state.offlineEnabled && (
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold-primary)' }}>
                  Dung lượng lưu trữ: {state.offlineSize} KB
                </div>
              )}
            </div>

            {/* Reminders Configuration */}
            <div className="bible-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>Nhắc Nhở Cầu Nguyện</h3>
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={state.notificationsEnabled}
                  onChange={(e) => state.updateNotificationsEnabled(e.target.checked)}
                />
              </div>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Tự động nhận thông báo đẩy trên thiết bị khi chuyển giao sang khung giờ kinh nguyện mới trong ngày (Sáng, Trưa, Chiều, Tối) tùy theo Thứ và Vai trò của bạn.
              </p>
              
            </div>

            {/* Notification Troubleshooting Guide */}
            <div className="bible-card">
              <h3 style={{ margin: 0, color: 'var(--gold-primary)', fontSize: '15px' }}>
                💡 Hướng Dẫn Nếu Không Nhận Được Thông Báo
              </h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Nếu bạn đã bật công tắc nhắc nhở mà thiết bị chưa hiển thị banner thông báo, vui lòng kiểm tra cài đặt theo hệ điều hành dưới đây:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* macOS */}
                <details style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-bible)',
                  backgroundColor: 'var(--bg-parchment)',
                  fontSize: '12px'
                }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>
                    🍏 Máy tính macOS (MacBook / Mac mini / iMac)
                  </summary>
                  <div style={{ marginTop: '8px', paddingLeft: '8px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    1. Vào <b>System Settings (Cài đặt hệ thống) ➔ Notifications (Thông báo)</b>.<br />
                    2. Tìm trình duyệt bạn đang dùng (Google Chrome, Safari, Brave...) và chọn <b>Allow Notifications</b>.<br />
                    3. Đặt kiểu cảnh báo là <b>Banners</b> hoặc <b>Alerts</b>.<br />
                    4. Kiểm tra xem máy có đang bật chế độ <b>Focus / Do Not Disturb (Không làm phiền)</b> ở góc trên bên phải màn hình không.
                  </div>
                </details>

                {/* Windows */}
                <details style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-bible)',
                  backgroundColor: 'var(--bg-parchment)',
                  fontSize: '12px'
                }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>
                    🪟 Máy tính Windows (Windows 10 / Windows 11)
                  </summary>
                  <div style={{ marginTop: '8px', paddingLeft: '8px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    1. Vào <b>Start ➔ Settings (Cài đặt) ➔ System ➔ Notifications</b>.<br />
                    2. Đảm bảo công tắc <b>Notifications</b> ở trên cùng đang được bật <b>ON</b>.<br />
                    3. Cuộn xuống tìm trình duyệt (Chrome, Edge...) và bật thông báo.<br />
                    4. Tắt chế độ <b>Focus Assist / Do Not Disturb</b> ở góc dưới bên phải thanh Taskbar.
                  </div>
                </details>

                {/* iPhone / iOS */}
                <details style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-bible)',
                  backgroundColor: 'var(--bg-parchment)',
                  fontSize: '12px'
                }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>
                    📱 Điện thoại iPhone / iPad (iOS 16.4 trở lên)
                  </summary>
                  <div style={{ marginTop: '8px', paddingLeft: '8px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    1. Mở trang web này bằng trình duyệt <b>Safari</b>.<br />
                    2. Nhấn vào nút <b>Chia sẻ (Share)</b> ở thanh công cụ dưới ➔ Chọn <b>Thêm vào Màn hình chính (Add to Home Screen)</b>.<br />
                    3. Mở biểu tượng ứng dụng PWA vừa thêm từ Màn hình chính.<br />
                    4. Vào <b>Cài đặt ➔ Nhắc Nhở Cầu Nguyện</b> và chọn <b>Cho phép (Allow)</b> khi iOS hỏi quyền.<br />
                    5. Đảm bảo vào <b>Cài đặt iPhone ➔ Thông báo ➔ Kinh Nguyện PWA</b> đã chọn <b>Cho phép thông báo</b>.
                  </div>
                </details>

                {/* Android */}
                <details style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-bible)',
                  backgroundColor: 'var(--bg-parchment)',
                  fontSize: '12px'
                }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>
                    🤖 Điện thoại Android (Samsung, Xiaomi, OPPO, vivo...)
                  </summary>
                  <div style={{ marginTop: '8px', paddingLeft: '8px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    1. Nhấn vào biểu tượng 🔒 Khóa hoặc Cài đặt trang web trên thanh địa chỉ trình duyệt ➔ Chọn <b>Cho phép Thông báo</b>.<br />
                    2. Vào <b>Cài đặt Android ➔ Ứng dụng ➔ Chrome (hoặc ứng dụng Kinh Nguyện PWA) ➔ Thông báo</b> ➔ Bật <b>Hiển thị thông báo</b>.<br />
                    3. Vào mục <b>Tối ưu hóa Pin (Battery Optimization)</b> ➔ Chuyển sang <b>Không tối ưu hóa (Unrestricted)</b> để ứng dụng gửi thông báo đúng giờ ngầm khi tắt màn hình.
                  </div>
                </details>
              </div>
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

            {/* Backups Export/Import */}
            <div className="bible-card">
              <h3>Sao lưu và Phục hồi</h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Sao lưu cấu hình Sách Kinh Tuần, các lời nguyện cá nhân, nhắc nhở và tiến trình cửu nhật ra tệp JSON để chuyển sang thiết bị khác.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className="bible-button" onClick={handleExportData}>
                  Xuất dữ liệu
                </button>
                <label className="bible-button secondary" style={{ margin: 0, textAlign: 'center', cursor: 'pointer' }}>
                  Nhập dữ liệu
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImportData}
                  />
                </label>
              </div>
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
                    height: 'auto'
                  }}
                >
                  {state.fixedMorningUid === state.selectedPrayer?.uid ? '☀️ Đã ghim sáng 6h' : '☀️ Ghim sáng 6h'}
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
                    height: 'auto'
                  }}
                >
                  {state.fixedEveningUid === state.selectedPrayer?.uid ? '🌙 Đã ghim tối 19h' : '🌙 Ghim tối 19h'}
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

      {/* Modal Setup Weekly Prayer Day */}
      {editingDay !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          padding: '20px'
        }} onClick={() => setEditingDay(null)}>
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
              Thiết lập Thứ {editingDay === 8 ? 'Chủ Nhật' : editingDay}
            </h3>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', textAlign: 'center' }}>
              Chọn các kinh nguyện muốn đọc vào ngày này (bao gồm cả các lời nguyện riêng tư của bạn)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
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

                return allAvailablePrayers.map((prayer) => {
                  const assigned = state.weeklyBook[editingDay as 2 | 3 | 4 | 5 | 6 | 7 | 8]?.includes(prayer.uid) || false;
                  return (
                    <label 
                      key={prayer.uid}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-bible)',
                        backgroundColor: assigned ? 'var(--gold-glow)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={assigned}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        onChange={() => {
                          const dayKey = editingDay as 2 | 3 | 4 | 5 | 6 | 7 | 8;
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
                      <span style={{ color: 'var(--text-main)' }}>{prayer.title}</span>
                    </label>
                  );
                });
              })()}
            </div>

            <button 
              className="bible-button"
              onClick={() => setEditingDay(null)}
            >
              Hoàn tất
            </button>
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
            <h3 style={{ marginBottom: '10px', textAlign: 'center', color: 'var(--gold-primary)' }}>
              💌 Gửi Lời Chúc Bổn Mạng Qua Zalo
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
                onClick={() => handleSendZalo(zaloMessage, zaloPhone)}
              >
                📱 Gửi Qua Zalo (1-Tap Share)
              </button>

              <button
                className="bible-button secondary"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(zaloMessage);
                  }
                  alert('Đã sao chép lời chúc vào bộ nhớ tạm!');
                }}
              >
                📋 Sao Chép Lời Chúc
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
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ color: '#D32F2F', marginBottom: '10px' }}>Phát Hiện Có Thể Trùng Lặp</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              Nội dung đoạn đầu của lời nguyện này có thể tương tự hoặc trùng với lời nguyện đã có trên ứng dụng:
              <br />
              <b style={{ color: 'var(--gold-primary)', fontSize: '14px' }}>"{duplicateMatchTitle}"</b>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="bible-button" onClick={() => setShowDuplicateModal(false)}>
                ✍ Sửa Lại Nội Dung Lời Nguyện
              </button>
              <button
                className="bible-button secondary"
                style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}
                onClick={() => {
                  setShowDuplicateModal(false);
                  setShowReportModal(true);
                }}
              >
                🚨 Nếu Sai, Gửi Yêu Cầu Xem Xét Cho Admin
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
            <h3 style={{ marginBottom: '10px', textAlign: 'center', color: 'var(--gold-primary)' }}>
              🚨 Gửi Yêu Cầu Xem Xét Cho Admin
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
          <span>Kinh nguyện</span>
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
