import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import type { Prayer } from './utils/prismic';
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

  // Local backups JSON generation
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        weeklyBook: state.weeklyBook,
        activeNovena: state.activeNovena,
        notificationsEnabled: state.notificationsEnabled,
        userRole: state.userRole,
        customPrayers: state.customPrayers
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
                {showAddForm ? '✕ Đóng biểu mẫu nhập' : '✍ Tự viết kinh nguyện mới'}
              </button>
            </div>

            {/* Custom Prayer Input Form */}
            {showAddForm && (
              <div className="bible-card" style={{ marginBottom: '30px', border: '2px solid var(--gold-light)' }}>
                <h3 style={{ color: 'var(--gold-primary)', marginBottom: '12px', textAlign: 'center' }}>Tạo Lời Kinh Của Bạn</h3>
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
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nội dung lời kinh</label>
                    <textarea 
                      className="bible-textarea" 
                      rows={6}
                      placeholder="Nhập nội dung lời kinh tại đây..." 
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
                      onClick={async () => {
                        if (!newPrayerTitle.trim() || !newPrayerContent.trim()) {
                          alert('Vui lòng nhập đầy đủ tiêu đề và nội dung kinh nguyện!');
                          return;
                        }
                        const uid = `custom-${Date.now()}`;
                        await state.addCustomPrayer({
                          uid,
                          title: newPrayerTitle.trim(),
                          category: newPrayerCategory,
                          content: newPrayerContent.trim().replace(/\n/g, '<br />'),
                          isPrivate: newPrayerIsPrivate
                        });
                        // Reset form
                        setNewPrayerTitle('');
                        setNewPrayerContent('');
                        setNewPrayerIsPrivate(true);
                        setShowAddForm(false);
                        alert('Đã lưu lời nguyện thành công!');
                      }}
                    >
                      Lưu Lời Nguyện
                    </button>
                    <button className="bible-button secondary" onClick={() => setShowAddForm(false)}>Hủy</button>
                  </div>
                </div>
              </div>
            )}

            {/* List all categories dynamically */}
            {state.categories
              .filter(cat => cat.parentUid || cat.uid === 'loi-nguyen-cho-cac-ngay-le-cong-giao')
              .map((cat) => {
                const catPrayers = state.prayers.filter(p => p.category === cat.uid);
                const parentCat = state.categories.find(c => c.uid === cat.parentUid);
                const displayName = parentCat ? `${parentCat.name} ➔ ${cat.name}` : cat.name;

                return (
                  <div key={cat.uid} style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      color: 'var(--gold-primary)',
                      borderBottom: '1px solid var(--border-bible)',
                      paddingBottom: '6px',
                      marginBottom: '12px',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {displayName} ({catPrayers.length})
                    </h3>
                  
                  {catPrayers.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '8px' }}>
                      Chưa có kinh nguyện nào trong danh mục này.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {catPrayers.map((prayer) => {
                        const isCustom = state.customPrayers.some(cp => cp.uid === prayer.uid);
                        return (
                          <div 
                            key={prayer.uid} 
                            className="bible-card" 
                            style={{ 
                              padding: '14px 16px', 
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
                              {prayer.isNovena && (
                                <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 600 }}>
                                  ❖ Chuỗi 9 ngày
                                </span>
                              )}
                              {isCustom && (
                                <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontStyle: 'italic' }}>
                                  ✍ Tự viết (Công cộng)
                                </span>
                              )}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {/* If it's a Novena, allow starting it */}
                              {prayer.isNovena && state.activeNovena?.id !== prayer.uid && (
                                <button
                                  className="bible-button"
                                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    state.startNovena(prayer.uid, prayer.title);
                                    state.setActiveTab('home');
                                  }}
                                >
                                  Kích hoạt
                                </button>
                              )}

                              {/* Delete button for user's custom prayers */}
                              {isCustom && (
                                <button
                                  style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#dc2626', 
                                    fontSize: '13px', 
                                    cursor: 'pointer',
                                    padding: '6px'
                                  }}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm(`Bạn có chắc chắn muốn xóa kinh nguyện "${prayer.title}" không?`)) {
                                      await state.deleteCustomPrayer(prayer.uid);
                                    }
                                  }}
                                >
                                  🗑️ Xóa
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
                                          {isCustom ? '✍ Lời kinh tự viết' : (state.categories.find(c => c.uid === prayer.category)?.name || 'Kinh Nguyện')}
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
                Sao lưu cấu hình Sách Kinh Tuần, các lời kinh tự viết, nhắc nhở và tiến trình cửu nhật ra tệp JSON để chuyển sang thiết bị khác.
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
              {state.categories.find(c => c.uid === state.selectedPrayer?.category)?.name || 'Lời kinh cá nhân'}
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
