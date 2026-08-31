import * as prismic from '@prismicio/client';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, content, category, submitted_by_user, user_email, time_of_day } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Thiếu các trường bắt buộc: title hoặc content.' });
  }

  const repoName = process.env.PRISMIC_REPO || '';
  const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN || '';

  if (!repoName || !writeToken) {
    console.error('❌ Vercel Server Error: Missing PRISMIC_REPO or PRISMIC_WRITE_TOKEN.');
    return res.status(500).json({ error: 'Cấu hình Vercel thiếu biến môi trường Prismic.' });
  }

  try {
    const uid = (title + '-' + Date.now().toString().slice(-4))
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const writeClient = prismic.createWriteClient(repoName, {
      writeToken: writeToken,
      accessToken: accessToken || undefined
    });

    const migration = prismic.createMigration();

    const prismicContent = typeof content === 'string' 
      ? content
        .split(/<br\s*\/?>|\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => ({
          type: 'paragraph',
          text: p,
          spans: []
        }))
      : content;

    const docLang = process.env.PRISMIC_LANG || 'vi';
    const submitterInfo = submitted_by_user || user_email || 'Thành viên ẩn danh';

    migration.createDocument({
      type: 'prayer',
      uid: uid,
      lang: docLang,
      data: {
        title: title,
        category: category ? {
          link_type: 'Document',
          uid: category,
          type: 'category',
          lang: docLang
        } : undefined,
        content: prismicContent,
        time_of_day: time_of_day || 'bat_ky',
        is_user_submitted: true,
        submitted_by_user: submitterInfo,
        is_novena: false
      }
    }, title);

    await writeClient.migrate(migration);

    return res.status(200).json({ success: true, message: 'Đã gửi lời cầu nguyện lên Prismic thành công!' });
  } catch (error) {
    console.error('❌ Lỗi gửi bản nháp lên Prismic:', error);
    return res.status(500).json({
      error: 'Không thể gửi dữ liệu lên Prismic.',
      details: error.message || error
    });
  }
}
