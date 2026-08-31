import React, { useState } from 'react';
import { useAppState, getTimeOfDayLabel, getCurrentTimeOfDayKey } from './hooks/useAppState';
import type { Prayer } from './utils/prismic';
import type { UserRole } from './utils/storage';
import { CATHOLIC_SAINTS } from './utils/catholicSaints';
import {
  IconWheat,
  IconHome,
  IconSparkles,
  IconSettings,
  IconUser,
  IconUsers,
  IconShare,
  IconRefresh,
  IconPlus,
  IconTrash,
  IconSearch,
  IconBookOpen,
  IconCalendar,
  IconLink,
  IconCheck,
  IconBriefcase,
  IconGraduationCap,
  IconHomeHeart,
  IconPrayingHands,
  IconStethoscope,
  IconCompass,
  IconLogIn,
  IconLogOut
} from './components/FlatIcons';
import './App.css';

export default function App() {
  const state = useAppState();

  // Selected Prayer Modal State (for viewing from search results or novenas)
  const [selectedPrayerModal, setSelectedPrayerModal] = useState<Prayer | null>(null);

  // Novena Selection Modal
  const [showNovenaModal, setShowNovenaModal] = useState<boolean>(false);

  // Context Suggestion Input State
  const [contextInput, setContextInput] = useState<string>('');

  // User Submission Modal & States
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newPrayerTitle, setNewPrayerTitle] = useState<string>('');
  const [newPrayerCategory, setNewPrayerCategory] = useState<string>('loi-nguyen-cau-truoc-khi-di-lam');
  const [newPrayerContent, setNewPrayerContent] = useState<string>('');
  const [newPrayerIsPrivate, setNewPrayerIsPrivate] = useState<boolean>(false);

  // Login Modal & States
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [loginNameInput, setLoginNameInput] = useState<string>('');
  const [loginEmailInput, setLoginEmailInput] = useState<string>('');

  // Relative Patron Saints Form Modal & States
  const [showPatronModal, setShowPatronModal] = useState<boolean>(false);
  const [patronRelativeName, setPatronRelativeName] = useState<string>('');
  const [patronSaintId, setPatronSaintId] = useState<string>('st-joseph');
  const [patronLinkedCode, setPatronLinkedCode] = useState<string>('');

  // User connection code link modal state
  const [connectCodeInput, setConnectCodeInput] = useState<string>('');

  // Handle Share
  const handleShare = async (prayer: Prayer) => {
    const cleanText = prayer.content.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n');
    const shareText = `${prayer.title.toUpperCase()}\n\n${cleanText}\n\n— Trích từ Ứng dụng Lời Cầu Nguyện Công Giáo`;

    if (navigator.share) {
      try {
        await navigator.share({ title: prayer.title, text: shareText });
        return;
      } catch { }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Đã sao chép lời cầu nguyện vào bộ nhớ tạm!');
    } catch {
      alert('Không thể sao chép tự động.');
    }
  };

  const getWordCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!contextInput.trim()) return;
    state.searchPrayerByContext(contextInput);
  };

  // Handle User Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailInput.trim()) {
      alert('Vui lòng nhập email của bạn.');
      return;
    }
    state.loginUser(loginNameInput, loginEmailInput);
    setShowAuthModal(false);
  };

  // Handle Add Connected User Code
  const handleAddConnection = () => {
    if (!connectCodeInput.trim()) return;
    state.addConnectedUser(connectCodeInput);
    alert(`Đã lưu mã kết nối ${connectCodeInput.trim().toUpperCase()}!`);
    setConnectCodeInput('');
  };

  // Save Custom User Prayer
  const handleSaveCustomPrayer = async () => {
    if (!newPrayerTitle.trim() || !newPrayerContent.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung lời cầu nguyện!');
      return;
    }

    if (!newPrayerIsPrivate && !state.userProfile) {
      alert('Bạn cần Đăng nhập trước khi đóng góp bài cầu nguyện công khai.');
      setShowAuthModal(true);
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

    if (!newPrayerIsPrivate) {
      alert('Cảm ơn bạn! Lời cầu nguyện đóng góp của bạn đã được lưu và gửi tới Admin.');
    } else {
      alert('Đã lưu lời cầu nguyện cá nhân của bạn!');
    }

    setNewPrayerTitle('');
    setNewPrayerContent('');
    setShowAddForm(false);
  };

  // Find Today's Catholic Saint
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const todayDateStr = `${String(todayMonth).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;
  const todaySaint = CATHOLIC_SAINTS.find(s => s.date === todayDateStr);

  const timeKey = getCurrentTimeOfDayKey();
  const timeLabel = getTimeOfDayLabel(timeKey);

  // Available Novenas from dataset
  const novenaPrayers = state.prayers.filter(p => p.isNovena || p.category === 'novena' || p.category === 'tuan-cuu-nhat');

  return (
    <div className="app-container">
      {/* App Header (No Clock) */}
      <header className="app-header">
        <div className="header-top">
          <div className="brand-box">
            <IconWheat size={22} color="var(--gold-primary)" />
            <h1 className="header-title">Lời Cầu Nguyện</h1>
          </div>
          <span className="time-badge">{timeLabel}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-content">
        {/* ==================================================== */}
        {/* TAB 1: TRANG CHỦ (SINGLE FEATURED PRAYER FULL DISPLAY) */}
        {/* ==================================================== */}
        {state.activeTab === 'home' && (
          <div className="tab-home">
            {state.loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang nạp lời cầu nguyện...</p>
              </div>
            ) : state.featuredPrayer ? (
              <div className="featured-card-wrapper">
                <div className="card-badge-row">
                  <span className="badge-time">{timeLabel}</span>
                  <span className="badge-role">
                    {state.userRole === 'student' ? 'Học sinh / Sinh viên'
                      : state.userRole === 'worker' ? 'Người đi làm'
                        : state.userRole === 'family' ? 'Gia đình'
                          : state.userRole === 'monk' ? 'Tu sĩ / Linh mục'
                            : state.userRole === 'sick' ? 'Người bệnh / Cao tuổi'
                              : 'Người độc thân'}
                  </span>
                </div>

                {/* Main Prayer Card showing 100% FULL Content */}
                <div className="prayer-main-card">
                  <h2 className="prayer-card-title">{state.featuredPrayer.title}</h2>
                  <div className="prayer-divider">
                    <IconWheat size={18} color="var(--gold-light)" />
                  </div>

                  {/* FULL PRAYER CONTENT DISPLAY */}
                  <div
                    className="prayer-card-content bible-text full-view"
                    dangerouslySetInnerHTML={{ __html: state.featuredPrayer.content }}
                  />

                  {/* Actions Bar (Share & Refresh/Shuffle only) */}
                  <div className="prayer-card-actions">
                    <button
                      className="btn-action secondary"
                      onClick={() => handleShare(state.featuredPrayer!)}
                    >
                      <IconShare size={18} />
                      <span>Chia sẻ</span>
                    </button>
                    <button
                      className="btn-action outline"
                      onClick={state.shuffleFeaturedPrayer}
                      title="Đổi lời cầu nguyện khác phù hợp buổi này"
                    >
                      <IconRefresh size={18} />
                      <span>Đổi bài khác</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Không tìm thấy lời cầu nguyện phù hợp. Vui lòng kiểm tra lại kết nối mạng.</p>
              </div>
            )}

            {/* Today's Catholic Saint Feast Widget */}
            {todaySaint && (
              <div className="widget-box saint-widget">
                <div className="widget-header">
                  <IconCalendar size={18} color="var(--gold-primary)" />
                  <span>Lễ Các Thánh Hôm Nay ({todaySaint.date})</span>
                </div>
                <h3 className="saint-name">{todaySaint.saintTitle}</h3>
                <p className="saint-desc">{todaySaint.description}</p>
              </div>
            )}

            {/* Active Novena Progress Widget & Start Button */}
            <div className="widget-box novena-widget">
              <div className="widget-header">
                <div className="widget-title-icon">
                  <IconBookOpen size={18} color="var(--gold-primary)" />
                  <span>Tuần Cửu Nhật (9 Ngày)</span>
                </div>
                {!state.activeNovena && (
                  <button className="btn-small-link" onClick={() => setShowNovenaModal(true)}>
                    + Bắt đầu cửu nhật
                  </button>
                )}
              </div>

              {state.activeNovena ? (
                <div>
                  <div className="novena-active-header">
                    <h3 className="novena-title">{state.activeNovena.name}</h3>
                    <button className="btn-small-danger" onClick={state.resetActiveNovena}>Hủy</button>
                  </div>
                  <div className="novena-days-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
                      const isDone = state.activeNovena?.completedDays.includes(d);
                      return (
                        <button
                          key={d}
                          className={`novena-day-btn ${isDone ? 'done' : ''}`}
                          onClick={() => state.toggleNovenaDay(d)}
                        >
                          {d} {isDone && <IconCheck size={12} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="novena-empty-desc">
                  Chưa khởi đầu Tuần Cửu Nhật nào. Chọn một bài cửu nhật để dâng kính liên tục trong 9 ngày.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: GỢI Ý THEO HOÀN CẢNH (SUGGEST & SEARCH) */}
        {/* ==================================================== */}
        {state.activeTab === 'suggest' && (
          <div className="tab-suggest">
            <div className="section-title-box">
              <h2 className="section-heading">Gợi Ý Lời Cầu Nguyện</h2>
              <p className="section-desc">
                Nhập hoàn cảnh khó khăn hoặc tâm tư bạn đang trải qua (công việc, gia đình, sức khỏe... tối đa 50 từ) để ứng dụng gợi ý lời cầu nguyện phù hợp nhất.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="suggest-form">
              <div className="textarea-wrapper">
                <textarea
                  className="suggest-textarea"
                  rows={4}
                  placeholder="Ví dụ: Tôi đang chịu áp lực lớn trong công việc, mâu thuẫn gia đình..."
                  value={contextInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (getWordCount(val) <= 50 || val.length < contextInput.length) {
                      setContextInput(val);
                    }
                  }}
                />
                <div className="word-counter">
                  {getWordCount(contextInput)} / 50 từ
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit-search"
                disabled={!contextInput.trim() || state.isSearching}
              >
                <IconSearch size={18} />
                <span>{state.isSearching ? 'Đang tìm kiếm...' : 'Tìm Lời Cầu Nguyện Phù Hợp'}</span>
              </button>
            </form>

            {/* Results Display */}
            {state.searchQuery && (
              <div className="search-results-section">
                <h3 className="results-title">
                  3 Kết Quả Phù Hợp Nhất Cho Hoàn Cảnh Của Bạn:
                </h3>

                {state.searchResults.length > 0 ? (
                  <div className="results-list">
                    {state.searchResults.map((prayer, idx) => (
                      <div key={prayer.uid} className="result-card">
                        <div className="result-card-header">
                          <span className="result-number">#{idx + 1}</span>
                          <h4 className="result-card-title">{prayer.title}</h4>
                        </div>
                        <div
                          className="result-snippet"
                          dangerouslySetInnerHTML={{ __html: prayer.content }}
                        />
                        <div className="result-card-actions">
                          <button
                            className="btn-action secondary small"
                            onClick={() => handleShare(prayer)}
                          >
                            <IconShare size={16} />
                            <span>Chia sẻ</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-results">Không tìm thấy lời cầu nguyện phù hợp. Vui lòng thử lại với câu từ khác.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: CÀI ĐẶT (SETTINGS & AUTH) */}
        {/* ==================================================== */}
        {state.activeTab === 'settings' && (
          <div className="tab-settings">
            <div className="section-title-box">
              <h2 className="section-heading">Cài Đặt & Tài Khoản</h2>
            </div>

            {/* 1. User Profile & Auth Box */}
            <div className="settings-group auth-box">
              <div className="auth-box-header">
                <IconUser size={22} color="var(--gold-primary)" />
                <h3 className="group-title" style={{ margin: 0 }}>Tài Khoản Người Dùng</h3>
              </div>

              {state.userProfile ? (
                <div className="profile-card">
                  <div className="profile-info">
                    <span className="user-name-display">{state.userProfile.name}</span>
                    <span className="user-email-display">{state.userProfile.email}</span>
                    <div className="code-display-box">
                      <span>Mã kết nối của bạn: </span>
                      <strong>{state.userProfile.connectionCode}</strong>
                    </div>
                  </div>
                  <button className="btn-action outline small" onClick={state.logoutUser}>
                    <IconLogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="unauth-box">
                  <p className="group-desc" style={{ marginBottom: '10px' }}>
                    Đăng nhập để đóng góp lời cầu nguyện cho cộng đồng và kết nối Bổn Mạng với thân nhân.
                  </p>
                  <button className="btn-action primary" onClick={() => setShowAuthModal(true)}>
                    <IconLogIn size={18} />
                    <span>Đăng Nhập Tài Khoản</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Select User Role */}
            <div className="settings-group">
              <h3 className="group-title">Vai Trò Của Bạn</h3>
              <p className="group-desc">
                Ưu tiên đề xuất bài cầu nguyện phù hợp với vai trò của bạn trên Trang Chủ.
              </p>

              <div className="roles-grid">
                {[
                  { id: 'worker', label: 'Người đi làm', icon: <IconBriefcase size={20} />, desc: 'Công việc & hanh thông' },
                  { id: 'student', label: 'Học sinh / Sinh viên', icon: <IconGraduationCap size={20} />, desc: 'Học tập & trí tuệ' },
                  { id: 'family', label: 'Gia đình', icon: <IconHomeHeart size={20} />, desc: 'Yêu thương & hòa thuận' },
                  { id: 'monk', label: 'Tu sĩ / Linh mục', icon: <IconPrayingHands size={20} />, desc: 'Tận hiến & phục vụ' },
                  { id: 'sick', label: 'Người bệnh / Cao tuổi', icon: <IconStethoscope size={20} />, desc: 'Sức khỏe & bình an' },
                  { id: 'single', label: 'Người độc thân', icon: <IconCompass size={20} />, desc: 'Ơn gọi & tương lai' },
                ].map(r => (
                  <button
                    key={r.id}
                    className={`role-card ${state.userRole === r.id ? 'active' : ''}`}
                    onClick={() => state.updateUserRole(r.id as UserRole)}
                  >
                    <span className="role-icon-box">{r.icon}</span>
                    <span className="role-name">{r.label}</span>
                    <span className="role-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. User Prayer Submission */}
            <div className="settings-group">
              <h3 className="group-title">Đóng Góp Lời Cầu Nguyện</h3>
              <p className="group-desc">
                Gửi bài cầu nguyện của bạn để chia sẻ cho cộng đồng hoặc lưu riêng tư.
              </p>

              {!showAddForm ? (
                <button className="btn-action primary" onClick={() => setShowAddForm(true)}>
                  <IconPlus size={18} />
                  <span>Thêm Lời Cầu Nguyện Mới</span>
                </button>
              ) : (
                <div className="add-prayer-form">
                  <div className="form-field">
                    <label>Danh mục lời cầu nguyện:</label>
                    <select
                      className="form-input"
                      value={newPrayerCategory}
                      onChange={(e) => setNewPrayerCategory(e.target.value)}
                    >
                      <option value="loi-nguyen-cau-truoc-khi-di-lam">Lời nguyện trước khi đi làm</option>
                      <option value="loi-nguyen-cau-truoc-khi-di-hoc">Lời nguyện trước khi đi học</option>
                      <option value="loi-nguyen-cho-su-hoa-thuan-yeu-thuong">Gia đình & Hòa thuận</option>
                      <option value="loi-nguyen-cau-cho-su-tap-trung">Sự tập trung & Trí tuệ</option>
                      <option value="loi-nguyen-cho-cac-ngay-le-cong-giao">Các ngày lễ Công Giáo</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Tiêu đề lời cầu nguyện *:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập tiêu đề..."
                      value={newPrayerTitle}
                      onChange={(e) => setNewPrayerTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Nội dung lời cầu nguyện *:</label>
                    <textarea
                      className="form-textarea"
                      rows={6}
                      placeholder="Nhập nội dung lời cầu nguyện..."
                      value={newPrayerContent}
                      onChange={(e) => setNewPrayerContent(e.target.value)}
                    />
                  </div>

                  <div className="form-checkbox-row">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={newPrayerIsPrivate}
                      onChange={(e) => setNewPrayerIsPrivate(e.target.checked)}
                    />
                    <label htmlFor="isPrivate">Chỉ lưu riêng tư trên máy tôi (không chia sẻ)</label>
                  </div>

                  <div className="form-buttons">
                    <button className="btn-action primary" onClick={handleSaveCustomPrayer}>
                      Lưu Lời Cầu Nguyện
                    </button>
                    <button className="btn-action outline" onClick={() => setShowAddForm(false)}>
                      Hủy Bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Relative Patron Saints & Connection Check */}
            <div className="settings-group">
              <h3 className="group-title">Bổn Mạng Thân Nhân & Kết Nối</h3>
              <p className="group-desc">
                Nhập mã kết nối của thân nhân để kiểm tra 2 người dùng đã add nhau hay chưa và nhắc nhớ Lễ Bổn Mạng.
              </p>

              <div className="connection-input-box">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập mã kết nối của thân nhân (VD: CP-A1B2C3)"
                  value={connectCodeInput}
                  onChange={(e) => setConnectCodeInput(e.target.value)}
                />
                <button className="btn-action primary small" onClick={handleAddConnection}>
                  <IconLink size={16} />
                  <span>Kết Nối</span>
                </button>
              </div>

              <button className="btn-action secondary" style={{ marginTop: '12px' }} onClick={() => setShowPatronModal(true)}>
                <IconPlus size={18} />
                <span>Thêm Thân Nhân Mới</span>
              </button>

              {state.relativePatrons.length > 0 && (
                <div className="patrons-list">
                  {state.relativePatrons.map(p => {
                    const isConnected = state.isUserConnected(p.linkedUserCode);
                    return (
                      <div key={p.id} className="patron-item">
                        <div className="patron-info">
                          <div className="patron-main-line">
                            <strong>{p.name}</strong> — {p.saintName} ({p.feastDate})
                          </div>
                          {p.linkedUserCode && (
                            <div className={`connection-status-badge ${isConnected ? 'connected' : 'pending'}`}>
                              {isConnected ? (
                                <>
                                  <IconCheck size={12} />
                                  <span>Đã kết nối mã ({p.linkedUserCode})</span>
                                </>
                              ) : (
                                <>
                                  <IconUsers size={12} />
                                  <span>Mã: {p.linkedUserCode} (Chưa kết nối)</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn-small-danger"
                          onClick={() => state.deleteRelativePatron(p.id)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* App Info */}
            <div className="app-info-box">
              <p>Ứng Dụng Lời Cầu Nguyện Công Giáo PWA</p>
              <p className="sub">Phiên bản 2.1.0 — Thiết kế chuẩn phẳng tinh gọn</p>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================== */}
      {/* NOVENA SELECTION MODAL */}
      {/* ==================================================== */}
      {showNovenaModal && (
        <div className="modal-backdrop" onClick={() => setShowNovenaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Chọn Tuần Cửu Nhật</h3>
              <button className="btn-close" onClick={() => setShowNovenaModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="group-desc">Chọn 1 bài cửu nhật để khởi đầu hành trình 9 ngày cầu nguyện:</p>
              <div className="novena-selection-list">
                {novenaPrayers.map(p => (
                  <button
                    key={p.uid}
                    className="novena-select-item"
                    onClick={() => {
                      state.startNovena(p.uid, p.title);
                      setShowNovenaModal(false);
                    }}
                  >
                    <IconBookOpen size={18} color="var(--gold-primary)" />
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* AUTH LOGIN MODAL */}
      {/* ==================================================== */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Đăng Nhập Tài Khoản</h3>
              <button className="btn-close" onClick={() => setShowAuthModal(false)}>✕</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="modal-body">
              <div className="form-field">
                <label>Họ tên hiển thị *:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: Giuse Nguyễn Văn A"
                  required
                  value={loginNameInput}
                  onChange={(e) => setLoginNameInput(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Email cá nhân *:</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Ví dụ: a@gmail.com"
                  required
                  value={loginEmailInput}
                  onChange={(e) => setLoginEmailInput(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-action primary" style={{ width: '100%', marginTop: '12px' }}>
                <IconLogIn size={18} />
                <span>Xác Nhận Đăng Nhập</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* PATRON SAINT FORM MODAL */}
      {/* ==================================================== */}
      {showPatronModal && (
        <div className="modal-backdrop" onClick={() => setShowPatronModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Thêm Bổn Mạng Thân Nhân</h3>
              <button className="btn-close" onClick={() => setShowPatronModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>Tên thân nhân (VD: Ba, Chị Mai, Chú Tuấn):</label>
                <input
                  type="text"
                  className="form-input"
                  value={patronRelativeName}
                  onChange={(e) => setPatronRelativeName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Mã kết nối của thân nhân (nếu có):</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: CP-X1Y2Z3"
                  value={patronLinkedCode}
                  onChange={(e) => setPatronLinkedCode(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Tên Thánh Bổn Mạng:</label>
                <select
                  className="form-input"
                  value={patronSaintId}
                  onChange={(e) => setPatronSaintId(e.target.value)}
                >
                  {CATHOLIC_SAINTS.map(s => (
                    <option key={s.id} value={s.id}>{s.saintTitle} ({s.date})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-action primary"
                onClick={() => {
                  if (!patronRelativeName.trim()) return;
                  const saint = CATHOLIC_SAINTS.find(s => s.id === patronSaintId);
                  if (saint) {
                    state.saveRelativePatron({
                      name: patronRelativeName.trim(),
                      saintId: saint.id,
                      saintName: saint.saintTitle,
                      feastDate: saint.date,
                      linkedUserCode: patronLinkedCode.trim().toUpperCase()
                    });
                  }
                  setPatronRelativeName('');
                  setPatronLinkedCode('');
                  setShowPatronModal(false);
                }}
              >
                Lưu Thân Nhân
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRAYER VIEW MODAL (FOR SEARCH RESULTS) */}
      {selectedPrayerModal && (
        <div className="modal-backdrop" onClick={() => setSelectedPrayerModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedPrayerModal.title}</h3>
              <button className="btn-close" onClick={() => setSelectedPrayerModal(null)}>✕</button>
            </div>
            <div className="modal-body bible-text" dangerouslySetInnerHTML={{ __html: selectedPrayerModal.content }} />
            <div className="modal-footer">
              <button
                className="btn-action primary"
                onClick={() => handleShare(selectedPrayerModal)}
              >
                <IconShare size={18} />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar with Vector Flat Icons */}
      <nav className="app-nav">
        <button
          className={`nav-item ${state.activeTab === 'home' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('home')}
        >
          <IconHome active={state.activeTab === 'home'} />
          <span>Trang Chủ</span>
        </button>

        <button
          className={`nav-item ${state.activeTab === 'suggest' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('suggest')}
        >
          <IconSparkles active={state.activeTab === 'suggest'} />
          <span>Gợi Ý</span>
        </button>

        <button
          className={`nav-item ${state.activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => state.setActiveTab('settings')}
        >
          <IconSettings active={state.activeTab === 'settings'} />
          <span>Cài Đặt</span>
        </button>
      </nav>
    </div>
  );
}
