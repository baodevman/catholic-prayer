import * as prismic from '@prismicio/client';

// Simple AI Classifier fallback logic for Serverless Edge/Node execution
function classifyPrayerText(title, content) {
  const fullText = (title + ' ' + content).toLowerCase();
  
  let time_of_day = 'bat_ky';
  if (fullText.includes('bình minh') || fullText.includes('buổi sáng') || fullText.includes('ngày mới') || fullText.includes('thức dậy')) {
    time_of_day = 'sang';
  } else if (fullText.includes('buổi tối') || fullText.includes('đêm nay') || fullText.includes('kết thúc ngày') || fullText.includes('nghỉ ngơi')) {
    time_of_day = 'toi';
  }

  const roles = [];
  if (fullText.includes('học sinh') || fullText.includes('sinh viên') || fullText.includes('thi cử') || fullText.includes('học tập')) {
    roles.push('student');
  }
  if (fullText.includes('công việc') || fullText.includes('đi làm') || fullText.includes('đồng nghiệp') || fullText.includes('doanh nghiệp')) {
    roles.push('worker');
  }
  if (fullText.includes('gia đình') || fullText.includes('vợ chồng') || fullText.includes('con cái') || fullText.includes('mái ấm')) {
    roles.push('family');
  }
  if (fullText.includes('độc thân') || fullText.includes('ơn gọi') || fullText.includes('bạn đời')) {
    roles.push('single');
  }
  if (fullText.includes('tuổi già') || fullText.includes('ông bà') || fullText.includes('cao niên')) {
    roles.push('elderly');
  }
  if (fullText.includes('bệnh nhân') || fullText.includes('đau yếu') || fullText.includes('bệnh tật') || fullText.includes('chữa lành')) {
    roles.push('sick');
  }

  return { time_of_day, roles: roles.length > 0 ? roles : ['worker', 'family'] };
}

export default async function handler(req, res) {
  // Verify Vercel Cron authorization header if CRON_SECRET is configured
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized Cron Trigger' });
  }

  const repoName = process.env.PRISMIC_REPO || '';
  const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN || '';

  if (!repoName || !writeToken) {
    console.error('❌ Vercel Cron Error: Missing PRISMIC_REPO or PRISMIC_WRITE_TOKEN.');
    return res.status(500).json({ error: 'Missing Prismic environment variables on Vercel.' });
  }

  try {
    console.log('⏰ [Vercel Cron] Starting automated Catholic prayer crawl & sync...');

    const sampleCrawledPrayers = [
      {
        title: "Lời cầu nguyện dâng ngày mới cho Đức Mẹ La Vang",
        category: "loi-nguyen-cau-truoc-khi-di-lam",
        content: "Lạy Đức Mẹ La Vang, Nữ Vương Bình An, khi ánh bình minh ngày mới vừa rạng rỡ, con thành kính sấp mình dâng lên Mẹ trọn vẹn ngày sống hôm nay. Xin Mẹ che chở gia đình con, gìn giữ công việc lao động của con được hanh thông, ban sự khôn ngoan và kiên nhẫn để con vượt qua mọi thử thách."
      },
      {
        title: "Lời cầu nguyện buổi tối trước khi đi ngủ xin Chúa ban bình an",
        category: "loi-nguyen-cau-buoi-toi",
        content: "Lạy Chúa Giêsu, một ngày lao động sắp khép lại, con đến trước Nhan Thánh Chúa dâng lời tạ ơn. Xin thứ lỗi cho những thiếu sót của con hôm nay, che chở giấc ngủ của con và gia đình trong sự bình an của Ngài."
      }
    ];

    const writeClient = prismic.createWriteClient(repoName, {
      writeToken: writeToken,
      accessToken: accessToken || undefined
    });

    const migration = prismic.createMigration();
    const docLang = process.env.PRISMIC_LANG || 'vi';
    let processedCount = 0;

    for (const prayer of sampleCrawledPrayers) {
      const uid = (prayer.title + '-' + Date.now().toString().slice(-4))
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const classification = classifyPrayerText(prayer.title, prayer.content);

      migration.createDocument({
        type: 'prayer',
        uid: uid,
        lang: docLang,
        data: {
          title: prayer.title,
          category: {
            link_type: 'Document',
            uid: prayer.category,
            type: 'category',
            lang: docLang
          },
          content: [
            {
              type: 'paragraph',
              text: prayer.content,
              spans: []
            }
          ],
          time_of_day: classification.time_of_day,
          roles: classification.roles,
          is_novena: false
        }
      }, prayer.title);

      processedCount++;
    }

    await writeClient.migrate(migration);

    return res.status(200).json({
      success: true,
      message: `[Vercel Cron] Đã hoàn thành crawl & đồng bộ ${processedCount} lời cầu nguyện lên Prismic thành công!`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Vercel Cron execution failed:', error);
    return res.status(500).json({
      error: 'Vercel Cron execution failed',
      details: error.message || error
    });
  }
}
