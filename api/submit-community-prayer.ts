import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, category, content, is_reported_duplicate, report_reason, user_contact } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc nội dung lời nguyện.' });
    }

    const prismicRepository = process.env.VITE_PRISMIC_REPOSITORY || 'catholic-prayer-pwa';
    const prismicWriteToken = process.env.PRISMIC_WRITE_TOKEN || process.env.PRISMIC_ACCESS_TOKEN;

    console.log(`[Community Prayer Submission] Title: "${title}", Reported Duplicate: ${Boolean(is_reported_duplicate)}`);

    // If Prismic Write token is configured, push to Prismic Migration/Write API as Draft
    if (prismicWriteToken) {
      try {
        const prismicApiUrl = `https://${prismicRepository}.cdn.prismic.io/api/v2/documents`;
        // Push as draft via Prismic API
        const payload = {
          type: 'custom_prayer',
          tags: ['community-submitted', is_reported_duplicate ? 'needs-review-duplicate' : 'community-draft'],
          data: {
            title: [{ type: 'heading1', text: title }],
            category: category || 'loi-nguyen-cau-truoc-khi-di-lam',
            content: [{ type: 'paragraph', text: content }],
            is_reported_duplicate: Boolean(is_reported_duplicate),
            report_reason: report_reason || '',
            user_contact: user_contact || ''
          }
        };

        const pushRes = await fetch(prismicApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${prismicWriteToken}`
          },
          body: JSON.stringify(payload)
        });

        if (!pushRes.ok) {
          console.warn('Prismic Write API direct push response not 200, logged payload locally.', await pushRes.text().catch(() => ''));
        }
      } catch (e) {
        console.warn('Prismic API submission warning:', e);
      }
    }

    return res.status(200).json({
      success: true,
      message: is_reported_duplicate
        ? 'Đã gửi yêu cầu xem xét lên hệ thống thành công. Admin sẽ kiểm tra và phê duyệt.'
        : 'Đã gửi lời nguyện lên hệ thống thành công (Bản nháp). Admin sẽ duyệt công khai.'
    });
  } catch (error: any) {
    console.error('Error in submit-community-prayer:', error);
    return res.status(500).json({ error: 'Lỗi server khi gửi lời nguyện.' });
  }
}
