import React, { useState } from 'react';
import type { Prayer } from '../utils/prismic';
import { saveEditRequestToFirestore } from '../utils/firestore';
import { IconCheck, IconWheat } from './FlatIcons';

interface EditPrayerModalProps {
  prayer: Prayer | null;
  onClose: () => void;
  currentUser?: { name?: string; email?: string } | null;
}

export const EditPrayerModal: React.FC<EditPrayerModalProps> = ({
  prayer,
  onClose,
  currentUser
}) => {
  const [reason, setReason] = useState<string>('spelling');
  const [suggestedContent, setSuggestedContent] = useState<string>('');
  const [senderName, setSenderName] = useState<string>(currentUser?.name || '');
  const [senderEmail, setSenderEmail] = useState<string>(currentUser?.email || '');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!prayer) return null;

  const reasonLabels: Record<string, string> = {
    spelling: 'Lỗi chính tả / ngữ pháp',
    missing: 'Thiếu câu / đoạn trong lời nguyện',
    wrong_category: 'Sai thể loại hoặc thời điểm đọc',
    other: 'Góp ý hoặc đính chính khác'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestedContent.trim()) {
      setErrorMessage('Vui lòng nhập nội dung góp ý hoặc đề xuất sửa đổi.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      prayerUid: prayer.uid,
      prayerTitle: prayer.title,
      reason: reasonLabels[reason] || reason,
      suggestedContent: suggestedContent.trim(),
      senderName: senderName.trim() || 'Người dùng ẩn danh',
      senderEmail: senderEmail.trim() || ''
    };

    try {
      // 1. Lưu bản ghi vào Firestore (đảm bảo không bao giờ thất lạc dữ liệu)
      await saveEditRequestToFirestore(payload);

      // 2. Gửi email qua serverless API endpoint
      try {
        const res = await fetch('/api/request-edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.warn('API email response not OK:', data);
        }
      } catch (apiErr) {
        console.warn('Gửi qua API email thất bại (đã sao lưu vào Firestore):', apiErr);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Lỗi khi gửi yêu cầu chỉnh sửa:', err);
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconWheat size={22} color="var(--gold-primary)" />
            <h3 className="modal-title" style={{ fontSize: '18px', margin: 0 }}>Góp Ý / Yêu Cầu Chỉnh Sửa</h3>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        {submitted ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <IconCheck size={28} color="#16a34a" />
            </div>
            <h4 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
              Cảm Ơn Đóng Góp Của Bạn!
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              Yêu cầu chỉnh sửa cho lời nguyện <strong>"{prayer.title}"</strong> đã được tiếp nhận và lưu trữ. Chúng tôi sẽ rà soát và cập nhật trong thời gian sớm nhất.
            </p>
            <button
              className="btn-action primary"
              style={{ width: '100%', padding: '12px' }}
              onClick={onClose}
            >
              Hoàn Tất
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <div style={{
              background: 'rgba(140, 107, 45, 0.08)',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '18px',
              fontSize: '14px',
              borderLeft: '3px solid var(--gold-primary)'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{prayer.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Mã định danh: {prayer.uid}
              </div>
            </div>

            {errorMessage && (
              <div style={{
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {errorMessage}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Vấn đề phát hiện:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-bible)',
                  background: '#FFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="spelling">Lỗi chính tả / từ ngữ</option>
                <option value="missing">Thiếu câu / đoạn trong lời nguyện</option>
                <option value="wrong_category">Sai phân loại / thời điểm đọc</option>
                <option value="other">Góp ý khác</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Chi tiết nội dung cần sửa hoặc bản dịch chuẩn: <span style={{ color: '#E11D48' }}>*</span>
              </label>
              <textarea
                value={suggestedContent}
                onChange={(e) => setSuggestedContent(e.target.value)}
                rows={5}
                placeholder="Ví dụ: Đoạn thứ 2 từ '...' nên đổi thành '...' theo đúng sách Lời Nguyện chung..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-bible)',
                  background: '#FFF',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Họ tên của bạn (tùy chọn)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Tên bạn"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-bible)',
                    background: '#FFF',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Email liên hệ (tùy chọn)
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-bible)',
                    background: '#FFF',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-action"
                onClick={onClose}
                disabled={submitting}
                style={{ padding: '10px 18px' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-action primary"
                disabled={submitting}
                style={{ padding: '10px 20px' }}
              >
                {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
