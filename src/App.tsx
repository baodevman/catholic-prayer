import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { setPrismicRepoName } from './utils/prismic';
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
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
  </svg>
);

const IconBook = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold-primary)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconSettings = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold-primary)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CrossSymbol = () => (
  <span style={{ fontSize: '18px', color: 'var(--gold-primary)', margin: '0 8px' }}>✠</span>
);

export default function App() {
  const state = useAppState();
  
  // Category Display Mappings
  const categoryNames: { [key: string]: string } = {
    'morning-work': 'Buổi sáng trước khi đi làm',
    'morning-school': 'Buổi sáng trước khi đi học',
    'evening-weekday': 'Buổi tối trong tuần',
    'evening-weekend': 'Buổi tối cuối tuần',
    'feast-holiday': 'Ngày lễ Công Giáo & Lễ hội',
    'novena': 'Tuần Cửu Nhật dâng kính',
  };

  // Flipbook State
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  // Prismic input temporary state
  const [prismicRepoInput, setPrismicRepoInput] = useState<string>(state.prismicRepo);

  // Local backups JSON generation
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        weeklyBook: state.weeklyBook,
        activeNovena: state.activeNovena,
        reminders: state.reminders,
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
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.weeklyBook) state.updateWeeklyBook(parsed.weeklyBook);
          if (parsed.reminders) state.updateReminders(parsed.reminders);
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

            {/* Daily Routine Suggestion */}
            {state.suggestedPrayer && (
              <div className="dashboard-suggest">
                <span className="time-meta">
                  {new Date().getHours() >= 5 && new Date().getHours() < 12 ? 'Lời nguyện ban sáng' : 'Lời nguyện ban tối'}
                </span>
                <h2 className="prayer-title">{state.suggestedPrayer.title}</h2>
                <div className="ornamental-divider"><CrossSymbol /></div>
                <div 
                  className="serif-text" 
                  style={{ 
                    maxHeight: '120px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontSize: '15px',
                    color: 'var(--text-muted)',
                    maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                  }}
                  dangerouslySetInnerHTML={{ __html: state.suggestedPrayer.content }}
                />
                <button 
                  className="bible-button" 
                  style={{ marginTop: '16px' }}
                  onClick={() => state.setSelectedPrayer(state.suggestedPrayer)}
                >
                  Mở sách đọc kinh
                </button>
              </div>
            )}

            {/* Active Novena Progress Checklist */}
            {state.activeNovena ? (
              <div className="bible-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="category-badge">Tuần Cửu Nhật đang đọc</span>
                  <button 
                    onClick={state.resetActiveNovena}
                    style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Dừng Tuần
                  </button>
                </div>
                <h3 style={{ marginBottom: '14px', fontSize: '18px' }}>{state.activeNovena.name}</h3>
                
                {/* 9 Day Progress Rings */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(5, 1fr)', 
                  gap: '8px', 
                  marginBottom: '16px' 
                }}>
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isCompleted = state.activeNovena?.completedDays.includes(dayNum);
                    return (
                      <button
                        key={dayNum}
                        onClick={() => state.toggleNovenaDay(dayNum)}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '8px',
                          border: isCompleted ? '1px solid var(--gold-primary)' : '1px solid var(--border-bible)',
                          backgroundColor: isCompleted ? 'var(--gold-glow)' : 'var(--bg-card)',
                          color: isCompleted ? 'var(--gold-primary)' : 'var(--text-muted)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px'
                        }}
                      >
                        <span>Ng. {dayNum}</span>
                        <span style={{ fontSize: '10px', marginTop: '2px' }}>
                          {isCompleted ? '✓' : '○'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Show prayer for the next uncompleted day */}
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
              <div className="bible-card" style={{ textAlign: 'center', padding: '24px' }}>
                <span className="category-badge" style={{ marginBottom: '8px' }}>Tuần Cửu Nhật</span>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Bạn chưa bắt đầu Tuần Cửu Nhật nào. Hãy chọn một tuần kinh để bắt đầu hành trình 9 ngày dâng kính.
                </p>
                <button 
                  className="bible-button" 
                  onClick={() => state.setActiveTab('library')}
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
            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Tuyển tập các kinh nguyện Công Giáo được đồng bộ từ CMS
            </p>

            {/* List all 6 categories */}
            {Object.keys(categoryNames).map((catKey) => {
              const catPrayers = state.prayers.filter(p => p.category === catKey);
              return (
                <div key={catKey} style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: 'var(--gold-primary)',
                    borderBottom: '1px solid var(--border-bible)',
                    paddingBottom: '6px',
                    marginBottom: '12px',
                    fontSize: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {categoryNames[catKey]} ({catPrayers.length})
                  </h3>
                  
                  {catPrayers.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '8px' }}>
                      Chưa có kinh nguyện nào trong danh mục này.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {catPrayers.map((prayer) => (
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
                          </div>
                          
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
                        </div>
                      ))}
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
              Lật trang sách để đọc kinh theo thứ trong tuần do chính bạn chọn
            </p>

            {/* Flipbook Container */}
            <div className="flipbook-container">
              <div className="book">
                {/* Book Pages */}
                {Array.from({ length: 7 }).map((_, idx) => {
                  const dayNum = idx + 2; // 2 corresponds to Monday, 8 corresponds to Sunday
                  const dayNames: { [key: number]: string } = {
                    2: 'Thứ Hai', 3: 'Thứ Ba', 4: 'Thứ Tư', 5: 'Thứ Năm', 6: 'Thứ Sáu', 7: 'Thứ Bảy', 8: 'Chủ Nhật'
                  };
                  
                  const isFlipped = currentPage > idx;
                  const zIndex = isFlipped ? idx : 7 - idx;

                  // Get prayers assigned to this day
                  const dayPrayerUids = state.weeklyBook[dayNum as 2 | 3 | 4 | 5 | 6 | 7 | 8] || [];
                  const dayPrayers = dayPrayerUids
                    .map((uid: string) => state.prayers.find((p: Prayer) => p.uid === uid))
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
                                {dayPrayers.map((prayer: Prayer) => (
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
                                      {categoryNames[prayer.category]}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Config Button at bottom of page */}
                          <button
                            className="bible-button secondary"
                            style={{ padding: '6px 12px', fontSize: '13px', marginTop: '16px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDay(dayNum);
                            }}
                          >
                            Thiết lập kinh nguyện
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
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                          <span style={{ color: 'var(--gold-primary)', fontSize: '24px' }}>❖</span>
                          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
                            Trang {idx + 1} / 7
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {state.activeTab === 'settings' && (
          <div>
            <h1 className="bible-header">Cài Đặt</h1>
            
            {/* Prismic CMS Config */}
            <div className="bible-card">
              <h3>Đồng bộ dữ liệu Prismic</h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Nhập Repository Name trên Prismic để đồng bộ kinh nguyện của riêng bạn. Nếu để trống, hệ thống sẽ sử dụng kho kinh nguyện mặc định.
              </p>
              <input
                type="text"
                className="bible-input"
                placeholder="Ví dụ: my-catholic-prayers"
                value={prismicRepoInput}
                onChange={(e) => setPrismicRepoInput(e.target.value)}
              />
              <button 
                className="bible-button"
                onClick={async () => {
                  setPrismicRepoName(prismicRepoInput);
                  state.setPrismicRepo(prismicRepoInput);
                  await state.refreshPrayers();
                  alert('Đã cập nhật cấu hình Prismic!');
                }}
              >
                Lưu & Đồng bộ
              </button>
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
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Tải toàn bộ kinh nguyện về lưu trữ cục bộ. Phù hợp khi bạn đi nhà thờ hoặc nơi không có kết nối internet.
              </p>
              {state.offlineEnabled && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px 12px', 
                  backgroundColor: 'var(--bg-parchment)', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--gold-primary)',
                  fontWeight: 500
                }}>
                  <span>Trạng thái: Đã tải về máy</span>
                  <span>Dung lượng: ~{state.offlineSize} KB</span>
                </div>
              )}
            </div>

            {/* Custom Reminder Times */}
            <div className="bible-card">
              <h3>Giờ nhắc nhở cầu nguyện</h3>
              <div className="ornamental-divider" style={{ margin: '8px 0' }}><CrossSymbol /></div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Đi làm buổi sáng</label>
                  <input
                    type="time"
                    className="bible-input"
                    value={state.reminders.workMorning}
                    onChange={(e) => state.updateReminders({ ...state.reminders, workMorning: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Đi học buổi sáng</label>
                  <input
                    type="time"
                    className="bible-input"
                    value={state.reminders.schoolMorning}
                    onChange={(e) => state.updateReminders({ ...state.reminders, schoolMorning: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Buổi tối trong tuần</label>
                  <input
                    type="time"
                    className="bible-input"
                    value={state.reminders.eveningWeekday}
                    onChange={(e) => state.updateReminders({ ...state.reminders, eveningWeekday: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Tối cuối tuần</label>
                  <input
                    type="time"
                    className="bible-input"
                    value={state.reminders.eveningWeekend}
                    onChange={(e) => state.updateReminders({ ...state.reminders, eveningWeekend: e.target.value })}
                  />
                </div>
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
                Sao lưu cấu hình Sách Kinh Tuần, nhắc nhở và tiến trình Tuần Cửu Nhật ra file JSON để đồng bộ sang thiết bị khác.
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

      {/* Full-Screen Reading View Overlay */}
      {state.selectedPrayer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-parchment)',
          zIndex: 1000,
          padding: '24px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Bar inside Reading View */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-bible)',
            paddingBottom: '12px',
            marginBottom: '20px'
          }}>
            <button 
              onClick={() => state.setSelectedPrayer(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← Quay về
            </button>
            
            <span className="category-badge">
              {categoryNames[state.selectedPrayer.category] || 'Kinh Nguyện'}
            </span>
          </div>

          {/* Reading Content */}
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
              Chọn các kinh nguyện muốn đọc vào ngày này
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {state.prayers.filter(p => !p.isNovena).map((prayer: Prayer) => {
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
                    <span>{prayer.title}</span>
                  </label>
                );
              })}
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
