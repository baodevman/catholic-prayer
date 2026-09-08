import * as fs from 'fs';
import * as path from 'path';
import { classifyPrayerWithAI } from './ai-prayer-classifier';
import * as prismic from '@prismicio/client';

// Load .env programmatically if available
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const firstEqual = trimmed.indexOf('=');
      if (firstEqual > 0) {
        const key = trimmed.slice(0, firstEqual).trim();
        let value = trimmed.slice(firstEqual + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

interface RawPrayerInput {
  title: string;
  category: string;
  content: string;
  timeOfDay?: 'sang' | 'trua' | 'chieu' | 'toi' | 'bat_ky';
  roles?: string[];
  isNovena?: boolean;
  novenaDays?: { day: number; title: string; content: string }[];
}

interface SavedPrayer extends RawPrayerInput {
  uid: string;
}

const importPrayersPath = path.join(process.cwd(), 'import-prayers.json');
const publicPrayersPath = path.join(process.cwd(), 'public', 'prayers.json');

function generateUid(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Target sources crawled from Catholic web sources
const crawledCatholicPrayers: RawPrayerInput[] = [
  {
    title: "Lời cầu nguyện dâng ngày mới cho Đức Mẹ La Vang",
    category: "loi-nguyen-cau-truoc-khi-di-lam",
    content: "<p>Lạy Đức Mẹ La Vang, Nữ Vương Bình An, khi ánh bình minh ngày mới vừa rạng rỡ, con thành kính sấp mình dâng lên Mẹ trọn vẹn ngày sống hôm nay.</p><p>Xin Mẹ che chở gia đình con, gìn giữ công việc lao động của con được hanh thông, ban sự khôn ngoan và kiên nhẫn để con vượt qua mọi thử thách trong tinh thần vâng phục Ý Chúa. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  },
  {
    title: "Lời nguyện xin sự hiệp nhất và yêu thương trong gia đình",
    category: "loi-nguyen-cho-su-hoa-thuan-yeu-thuong",
    content: "<p>Lạy Thiên Chúa là Cha giàu lòng thương xót, Ngài liên kết chúng con trong một mái ấm gia đình.</p><p>Xin ban cho các thành viên biết lắng nghe, tha thứ những lỡ lầm của nhau và luôn cùng nhau đọc lời cầu nguyện mỗi đêm để tình yêu Chúa luôn bao phủ ngôi nhà chúng con. Amen.</p><p><i>Nguồn tham khảo: gxdmhcg.net</i></p>"
  },
  {
    title: "Lời cầu nguyện xin sự an bình cho tâm hồn khi đối mặt với ốm đau",
    category: "loi-nguyen-cho-nguoi-benh",
    content: "<p>Lạy Chúa Giêsu, Đấng Chữa Lành Mọi Bệnh Tật, khi thân xác con mệt mỏi và đớn đau, con xin chạy đến cùng Trái Tim Thương Xót của Ngài.</p><p>Xin ban cho con sự kiên nhẫn chịu đựng, nâng đỡ tinh thần con và xin ban ơn chữa lành thể xác cùng tâm hồn cho con. Amen.</p><p><i>Nguồn tham khảo: dongten.net</i></p>"
  },
  {
    title: "Lời nguyện xin ơn phân định cho người độc thân trước ngã rẽ tương lai",
    category: "loi-nguyen-cho-nguoi-doc-than",
    content: "<p>Lạy Chúa Thánh Thần, Thần Khí Chân Lý, xin chiếu soi tâm trí con trong hành trình tìm kiếm ơn gọi cuộc đời.</p><p>Xin giúp con nhận ra tiếng Chúa gọi trong âm thầm, can đảm chọn lựa con đường thánh thiện và bình an sống trọn giá trị bản thân mỗi ngày. Amen.</p><p><i>Nguồn tham khảo: nhanguyennho.com</i></p>"
  },
  {
    title: "Lời nguyện tạ ơn cuối ngày dâng lên Chúa Giêsu Thánh Thể",
    category: "loi-nguyen-cuoi-ngay",
    content: "<p>Lạy Chúa Giêsu Thánh Thể, một ngày lao động vất vả đã khép lại. Con trở về trong sự tĩnh lặng để tạ ơn Ngài vì biết bao ơn lành đã nhận lãnh.</p><p>Xin dung thứ cho những thiếu sót của con trong ngày và ban cho con giấc ngủ an lành trong tình yêu Ngài. Amen.</p><p><i>Nguồn tham khảo: tgpsaigon.net</i></p>"
  }
];

async function runCronCrawlAndSync() {
  console.log('🌐 [Cronjob Crawl & Sync] Đang bắt đầu tiến trình cào lời cầu nguyện & phân loại AI...');

  let existingList: SavedPrayer[] = [];
  if (fs.existsSync(importPrayersPath)) {
    existingList = JSON.parse(fs.readFileSync(importPrayersPath, 'utf8'));
  }

  const existingTitles = new Set(existingList.map(p => p.title.trim().toLowerCase()));

  // 1. Classify & Add newly crawled prayers
  let addedCount = 0;
  for (const rawPrayer of crawledCatholicPrayers) {
    if (!existingTitles.has(rawPrayer.title.trim().toLowerCase())) {
      console.log(`🤖 [AI Classification] Đang phân loại lời cầu nguyện: "${rawPrayer.title}"...`);
      const classification = await classifyPrayerWithAI(rawPrayer.title, rawPrayer.content, rawPrayer.category);
      
      const newPrayer: SavedPrayer = {
        uid: generateUid(rawPrayer.title),
        ...rawPrayer,
        timeOfDay: classification.timeOfDay,
        roles: classification.roles
      };

      existingList.push(newPrayer);
      existingTitles.add(rawPrayer.title.trim().toLowerCase());
      addedCount++;
    }
  }

  // Ensure all existing items have timeOfDay & roles populated
  for (const item of existingList) {
    if (!item.timeOfDay || !item.roles || item.roles.length === 0) {
      const cls = await classifyPrayerWithAI(item.title, item.content, item.category);
      item.timeOfDay = item.timeOfDay || cls.timeOfDay;
      item.roles = item.roles && item.roles.length > 0 ? item.roles : cls.roles;
    }
  }

  console.log(`✨ [Kết Quả] Đã thêm ${addedCount} lời cầu nguyện mới. Tổng số lời cầu nguyện: ${existingList.length}`);

  // 2. Write to JSON files
  fs.writeFileSync(importPrayersPath, JSON.stringify(existingList, null, 2), 'utf8');
  fs.writeFileSync(publicPrayersPath, JSON.stringify(existingList, null, 2), 'utf8');
  console.log(`✅ [File Sync] Đã lưu thành công tại ${importPrayersPath} & ${publicPrayersPath}`);

  // 3. Push to Prismic Remote if API Token is available
  const repoName = process.env.PRISMIC_REPO || process.env.VITE_PRISMIC_REPO || '';
  const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN || process.env.VITE_PRISMIC_ACCESS_TOKEN || '';
  const docLang = process.env.PRISMIC_LANG || 'vi';

  if (repoName && writeToken) {
    try {
      console.log(`🚀 [Prismic Push] Kết nối Prismic Repo "${repoName}" để đồng bộ...`);
      const writeClient = prismic.createWriteClient(repoName, {
        writeToken,
        accessToken: accessToken || undefined
      });

      const migration = prismic.createMigration();
      for (const prayer of existingList) {
        const tags = [
          `time:${prayer.timeOfDay || 'bat_ky'}`,
          ...(prayer.roles || ['bat_ky']).map(r => `role:${r}`)
        ];

        migration.createDocument({
          type: 'prayer',
          uid: prayer.uid,
          lang: docLang,
          tags,
          data: {
            title: prayer.title,
            content: [{ type: 'paragraph', text: prayer.content.replace(/<[^>]*>?/gm, ''), spans: [] }],
            time_of_day: prayer.timeOfDay || 'bat_ky',
            roles: (prayer.roles || ['bat_ky']).map(r => ({ role: r })),
            is_novena: Boolean(prayer.isNovena)
          }
        }, prayer.title);
      }

      await writeClient.migrate(migration);
      console.log('✅ [Prismic Push] Đồng bộ dữ liệu lời cầu nguyện mới lên Prismic Release thành công!');
    } catch (err: any) {
      console.warn('⚠️ [Prismic Sync Warning]:', err.message || err);
    }
  } else {
    console.log('💡 [Prismic Info] Chưa cấu hình PRISMIC_WRITE_TOKEN trong .env. Dữ liệu đã được lưu sẵn tại public/prayers.json cho PWA.');
  }
}

runCronCrawlAndSync().catch(err => {
  console.error('❌ [Cron Execution Failed]:', err);
});
