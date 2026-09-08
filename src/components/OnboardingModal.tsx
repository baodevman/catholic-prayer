import React, { useState } from 'react';
import {
  IconWheat,
  IconSparkles,
  IconBookOpen,
  IconCheck
} from './FlatIcons';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    {
      title: "Chào Mừng Đến Với Lời Cầu Nguyện Công Giáo",
      content: (
        <div className="onboarding-step-body">
          <div className="onboarding-hero-icon">
            <IconWheat size={54} color="var(--gold-primary)" />
          </div>
          <p className="onboarding-text">
            Ứng dụng đồng hành cùng quý cộng đoàn trong đời sống đức tin hằng ngày. Giúp bạn dễ dàng tìm thấy những <strong>lời cầu nguyện</strong> sốt sắng, nhẹ nhàng và phù hợp nhất với từng khoảnh khắc sống.
          </p>
        </div>
      )
    },
    {
      title: "Các Tính Năng Nổi Bật",
      content: (
        <div className="onboarding-step-body">
          <ul className="onboarding-features-list">
            <li>
              <span className="feature-icon"><IconWheat size={18} /></span>
              <div>
                <strong>Lời cầu nguyện theo khung giờ & vai trò:</strong>
                <p>Đề xuất lời nguyện phù hợp Buổi Sáng, Trưa, Chiều, Tối dành riêng cho Học tập, Công việc, Gia đình, Độc thân, Cao tuổi hoặc Sức khỏe.</p>
              </div>
            </li>
            <li>
              <span className="feature-icon"><IconSparkles size={18} /></span>
              <div>
                <strong>Gợi ý theo hoàn cảnh sống:</strong>
                <p>Nhập tâm tư hoặc khó khăn bạn đang trải qua (tối đa 50 từ) để nhận gợi ý lời cầu nguyện sát với hoàn cảnh.</p>
              </div>
            </li>
            <li>
              <span className="feature-icon"><IconBookOpen size={18} /></span>
              <div>
                <strong>Tuần Cửu Nhật & Lễ Các Thánh:</strong>
                <p>Theo dõi tiến trình 9 ngày Tuần Cửu Nhật và cập nhật Lễ Các Thánh hằng ngày.</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Cam Kết Miễn Phí & Đóng Góp Ý Kiến",
      content: (
        <div className="onboarding-step-body">
          <div className="commitment-card">
            <div className="commitment-badge">
              <IconCheck size={20} color="#2e7d32" />
              <span>Cam Kết 100% Miễn Phí Mãi Mãi</span>
            </div>
            <p className="commitment-desc">
              Ứng dụng hoàn toàn <strong>miễn phí</strong>, không có quảng cáo làm phiền sự tĩnh lặng trong giờ cầu nguyện của bạn.
            </p>
          </div>

          <div className="feedback-card">
            <h4 className="feedback-title">Lắng Nghe & Đóng Góp Ý Kiến</h4>
            <p className="feedback-desc">
              Do khối lượng dữ liệu lớn, ứng dụng khó tránh khỏi những sai sót nhỏ. Chúng tôi rất mong nhận được những góp ý chân thành từ quý cộng đoàn để ứng dụng ngày càng hoàn thiện hơn.
            </p>
            <div className="email-box">
              <span>Gửi góp ý qua Email: </span>
              <a href="mailto:bao.devman@gmail.com" className="email-link">bao.devman@gmail.com</a>
            </div>
          </div>
        </div>
      )
    }
  ];

  const isLast = currentStep === steps.length;

  return (
    <div className="modal-backdrop onboarding-backdrop" onClick={onClose}>
      <div className="modal-content onboarding-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header onboarding-header">
          <div className="step-indicator">
            Bước {currentStep} / {steps.length}
          </div>
          <h3 className="modal-title">{steps[currentStep - 1].title}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body onboarding-body">
          {steps[currentStep - 1].content}
        </div>

        {/* Footer Navigation */}
        <div className="modal-footer onboarding-footer">
          {currentStep > 1 ? (
            <button
              className="btn-action outline small"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Quay lại
            </button>
          ) : <div />}

          {!isLast ? (
            <button
              className="btn-action primary"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Tiếp theo ➔
            </button>
          ) : (
            <button
              className="btn-action primary"
              onClick={onClose}
            >
              Bắt Đầu Sử Dụng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
