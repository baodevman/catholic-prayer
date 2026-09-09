import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    prayerUid,
    prayerTitle,
    reason,
    suggestedContent,
    senderName,
    senderEmail
  } = req.body || {};

  if (!prayerTitle || !suggestedContent) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (prayerTitle, suggestedContent).' });
  }

  const gmailUser = process.env.GMAIL_USER || 'bao.devman@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPass) {
    console.warn('⚠️ GMAIL_APP_PASSWORD chưa được cấu hình. Yêu cầu đã được lưu Firestore client-side.');
    return res.status(200).json({
      success: true,
      warning: 'GMAIL_APP_PASSWORD is not set, saved to Firestore backup.',
      message: 'Yêu cầu của bạn đã được tiếp nhận và ghi nhận.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    const mailOptions = {
      from: `"Catholic Prayer App" <${gmailUser}>`,
      to: gmailUser,
      replyTo: senderEmail || undefined,
      subject: `[Catholic Prayer] Góp ý chỉnh sửa: ${prayerTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #8C6B2D; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #8C6B2D; margin: 0; font-size: 20px;">Yêu Cầu Chỉnh Sửa Lời Cầu Nguyện</h2>
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Nhận từ ứng dụng Catholic Prayer PWA</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 140px; font-weight: 600;">Lời cầu nguyện:</td>
              <td style="padding: 8px 0; color: #111827; font-weight: bold;">${prayerTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Mã định danh (UID):</td>
              <td style="padding: 8px 0; color: #4b5563; font-family: monospace;">${prayerUid || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phân loại vấn đề:</td>
              <td style="padding: 8px 0; color: #d97706; font-weight: 600;">${reason || 'Khác'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Người gửi:</td>
              <td style="padding: 8px 0; color: #111827;">${senderName || 'Ẩn danh'} (${senderEmail || 'Không để lại email'})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Thời gian gửi:</td>
              <td style="padding: 8px 0; color: #6b7280;">${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
            </tr>
          </table>

          <div style="background-color: #f9fafb; border-left: 4px solid #8C6B2D; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <div style="font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Nội dung đề xuất chỉnh sửa:</div>
            <div style="color: #1f2937; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${suggestedContent}</div>
          </div>

          <div style="font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 12px;">
            Email tự động từ hệ thống phản hồi Catholic Prayer PWA
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Đã gửi email góp ý thành công!' });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email qua Gmail SMTP:', error);
    return res.status(500).json({
      error: 'Không thể gửi email qua Gmail SMTP.',
      details: error.message || error
    });
  }
}
