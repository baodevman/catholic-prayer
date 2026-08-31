import fs from 'fs';
import path from 'path';
import * as prismic from '@prismicio/client';
import { CATHOLIC_SAINTS } from '../src/utils/catholicSaints.js';

// Load .env file programmatically if it exists
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

console.log('🚀 [Prismic Sync CLI] Preparing Catholic Saints, Categories & Prayers dataset for Prismic CMS...');

const outputDir = path.join(process.cwd(), 'prismic-export');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to convert HTML text to Prismic StructuredText blocks with paragraphs and bold spans
const htmlToRichText = (htmlText: string) => {
  if (!htmlText) return [{ type: 'paragraph', text: '', spans: [] }];
  
  // Split by paragraph tags or newlines
  const paragraphs = htmlText
    .replace(/<br\s*\/?>/gi, '\n')
    .split(/<\/p>|\n/)
    .map(p => p.replace(/<p>/gi, '').trim())
    .filter(p => p.length > 0);

  if (paragraphs.length === 0) {
    const cleanText = htmlText.replace(/<[^>]*>?/gm, '').trim();
    return [{ type: 'paragraph', text: cleanText || '', spans: [] }];
  }

  return paragraphs.map(p => {
    const boldRegex = /<b>(.*?)<\/b>|<strong>(.*?)<\/strong>/gi;
    let text = p.replace(/<b[^>]*>/gi, '').replace(/<\/b>/gi, '').replace(/<strong[^>]*>/gi, '').replace(/<\/strong>/gi, '');
    text = text.replace(/<[^>]*>?/gm, ''); // Remove any remaining tags
    
    const spans: any[] = [];
    let match;
    const tempP = p;
    let offset = 0;

    while ((match = boldRegex.exec(tempP)) !== null) {
      const matchedText = match[1] || match[2];
      if (matchedText) {
        const start = match.index - offset;
        const end = start + matchedText.length;
        spans.push({
          start,
          end,
          type: 'strong'
        });
        offset += match[0].length - matchedText.length;
      }
    }

    return {
      type: 'paragraph',
      text,
      spans
    };
  });
};

// ==========================================
// 1. Catholic Saints Export & Custom Type Schema
// ==========================================
const saintsExport = CATHOLIC_SAINTS.map(saint => ({
  id: saint.id,
  uid: saint.id,
  type: 'catholic_saint',
  data: {
    saint_id: saint.id,
    name: saint.name,
    saint_title: saint.saintTitle,
    date: saint.date,
    month: saint.month,
    day: saint.day,
    type: saint.type,
    description: saint.description
  }
}));

const saintsFilePath = path.join(outputDir, 'catholic_saints_prismic.json');
fs.writeFileSync(saintsFilePath, JSON.stringify(saintsExport, null, 2), 'utf-8');

const saintCustomTypeSchema = {
  id: 'catholic_saint',
  label: 'Catholic Saint',
  repeatable: true,
  status: true,
  json: {
    Main: {
      saint_id: { type: 'Text', config: { label: 'Saint ID' } },
      name: { type: 'Text', config: { label: 'Tên Thánh / Ngày Lễ' } },
      saint_title: { type: 'Text', config: { label: 'Tên Tước Hiệu Đầy Đủ' } },
      date: { type: 'Text', config: { label: 'Ngày Lễ (MM-DD)' } },
      month: { type: 'Number', config: { label: 'Tháng' } },
      day: { type: 'Number', config: { label: 'Ngày' } },
      type: {
        type: 'Select',
        config: {
          label: 'Loại Lễ',
          options: ['solemnity', 'feast', 'memorial', 'commemoration']
        }
      },
      description: { type: 'Text', config: { label: 'Mô tả ngắn' } }
    }
  }
};
fs.writeFileSync(path.join(outputDir, 'custom_type_catholic_saint.json'), JSON.stringify(saintCustomTypeSchema, null, 2), 'utf-8');

const sliceMachineCustomTypeDir = path.join(process.cwd(), 'customtypes', 'catholic_saint');
if (!fs.existsSync(sliceMachineCustomTypeDir)) {
  fs.mkdirSync(sliceMachineCustomTypeDir, { recursive: true });
}
fs.writeFileSync(path.join(sliceMachineCustomTypeDir, 'index.json'), JSON.stringify(saintCustomTypeSchema, null, 2), 'utf-8');

console.log(`✅ [Saints Export] Exported ${CATHOLIC_SAINTS.length} Saints to Slice Machine & Export folder.`);

// ==========================================
// 2. Categories Export & Custom Type Schema
// ==========================================
let categoriesList: any[] = [];
const categoriesSrcPath = path.join(process.cwd(), 'import-categories.json');
if (fs.existsSync(categoriesSrcPath)) {
  categoriesList = JSON.parse(fs.readFileSync(categoriesSrcPath, 'utf-8'));
}

const categoriesExport = categoriesList.map(cat => ({
  uid: cat.uid,
  type: 'category',
  data: {
    name: cat.name,
    parent: cat.parent ? { link_type: 'Document', uid: cat.parent } : null
  }
}));
fs.writeFileSync(path.join(outputDir, 'categories_prismic.json'), JSON.stringify(categoriesExport, null, 2), 'utf-8');

const categoryCustomTypeSchema = {
  id: 'category',
  label: 'Category',
  repeatable: true,
  status: true,
  json: {
    Main: {
      name: { type: 'Text', config: { label: 'Tên Danh Mục' } },
      parent: { type: 'Link', config: { label: 'Danh Mục Cha', select: 'document', customtypes: ['category'] } }
    }
  }
};
fs.writeFileSync(path.join(outputDir, 'custom_type_category.json'), JSON.stringify(categoryCustomTypeSchema, null, 2), 'utf-8');
console.log(`✅ [Categories Export] Exported ${categoriesList.length} Categories to Export folder.`);

// ==========================================
// 3. Prayers Export & Custom Type Schema
// ==========================================
let prayersList: any[] = [];
const prayersSrcPath = path.join(process.cwd(), 'public', 'prayers.json');
const altPrayersSrcPath = path.join(process.cwd(), 'import-prayers.json');

if (fs.existsSync(prayersSrcPath)) {
  prayersList = JSON.parse(fs.readFileSync(prayersSrcPath, 'utf-8'));
} else if (fs.existsSync(altPrayersSrcPath)) {
  prayersList = JSON.parse(fs.readFileSync(altPrayersSrcPath, 'utf-8'));
}

const prayersExport = prayersList.map(prayer => ({
  uid: prayer.uid || prayer.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-'),
  type: 'prayer',
  data: {
    title: prayer.title,
    category: { link_type: 'Document', uid: prayer.category },
    content: htmlToRichText(prayer.content),
    time_of_day: prayer.timeOfDay || 'bat_ky',
    is_user_submitted: Boolean(prayer.isUserSubmitted),
    submitted_by_user: prayer.submittedByUser || '',
    is_novena: Boolean(prayer.isNovena)
  }
}));
fs.writeFileSync(path.join(outputDir, 'prayers_prismic.json'), JSON.stringify(prayersExport, null, 2), 'utf-8');

const prayerCustomTypeSchema = {
  id: 'prayer',
  label: 'Prayer',
  repeatable: true,
  status: true,
  json: {
    Main: {
      title: { type: 'Text', config: { label: 'Tiêu Đề Lời Cầu Nguyện' } },
      category: { type: 'Link', config: { label: 'Danh Mục Chính (Single)', select: 'document', customtypes: ['category'] } },
      categories: {
        type: 'Group',
        config: {
          label: 'Danh Mục Liên Kết (N Categories)',
          fields: {
            category_link: { type: 'Link', config: { label: 'Danh Mục Liên Kết', select: 'document', customtypes: ['category'] } }
          }
        }
      },
      content: { type: 'StructuredText', config: { label: 'Nội dung Lời Nguyện', multi: 'paragraph,preformatted,heading1,heading2,heading3,strong,em' } },
      time_of_day: { type: 'Select', config: { label: 'Khung Giờ Cầu Nguyện', options: ['sang', 'trua', 'chieu', 'toi', 'bat_ky'] } },
      is_user_submitted: { type: 'Boolean', config: { label: 'Do Người Dùng Đóng Góp' } },
      submitted_by_user: { type: 'Text', config: { label: 'Thông Tin Người Đóng Góp' } },
      is_novena: { type: 'Boolean', config: { label: 'Là Tuần Cửu Nhật' } }
    }
  }
};
fs.writeFileSync(path.join(outputDir, 'custom_type_prayer.json'), JSON.stringify(prayerCustomTypeSchema, null, 2), 'utf-8');

const userSearchIntentSchema = {
  id: 'user_search_intent',
  label: 'User Search Intent',
  repeatable: true,
  status: true,
  json: {
    Main: {
      keyword: { type: 'Text', config: { label: 'Nội Dung Hoàn Cảnh / Từ Khóa Tìm Kiếm' } },
      time_of_day: { type: 'Text', config: { label: 'Thời Gian Tìm Kiếm (Buổi)' } },
      matched_prayers: { type: 'Text', config: { label: 'Kết Quả Lời Cầu Nguyện Đã Gợi Ý' } },
      user_role: { type: 'Text', config: { label: 'Vai Trò Người Dùng' } },
      timestamp: { type: 'Text', config: { label: 'Thời Gian (ISO String)' } }
    }
  }
};
fs.writeFileSync(path.join(outputDir, 'custom_type_user_search_intent.json'), JSON.stringify(userSearchIntentSchema, null, 2), 'utf-8');

const prayerSliceMachineDir = path.join(process.cwd(), 'customtypes', 'prayer');
if (!fs.existsSync(prayerSliceMachineDir)) {
  fs.mkdirSync(prayerSliceMachineDir, { recursive: true });
}
fs.writeFileSync(path.join(prayerSliceMachineDir, 'index.json'), JSON.stringify(prayerCustomTypeSchema, null, 2), 'utf-8');

const intentSliceMachineDir = path.join(process.cwd(), 'customtypes', 'user_search_intent');
if (!fs.existsSync(intentSliceMachineDir)) {
  fs.mkdirSync(intentSliceMachineDir, { recursive: true });
}
fs.writeFileSync(path.join(intentSliceMachineDir, 'index.json'), JSON.stringify(userSearchIntentSchema, null, 2), 'utf-8');

console.log(`✅ [Prayers Export] Exported ${prayersList.length} Prayers with N-category links & RichText schema to Slice Machine & Export folder.`);

// ==========================================
// 4. Remote Prismic API Push / Migration (if Tokens are configured)
// ==========================================
const repoName = process.env.PRISMIC_REPO || '';
const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';
const accessToken = process.env.PRISMIC_ACCESS_TOKEN || process.env.VITE_PRISMIC_ACCESS_TOKEN || '';
const docLang = process.env.PRISMIC_LANG || 'vi';

if (repoName && writeToken) {
  console.log(`\n🌐 [Prismic Push] Connecting to Prismic repository "${repoName}"...`);
  pushToPrismicRemote().catch(err => {
    console.error('❌ [Prismic Push Failed]:', err.message || err);
    if (err.response) {
      console.error('  Chi tiết phản hồi từ Prismic API:', JSON.stringify(err.response, null, 2));
    }
  });
} else {
  console.log('\n💡 [Hướng Dẫn Push Trực Tiếp Lên Prismic Remote]:');
  console.log(' - File xuất tại ./prismic-export và ./customtypes đã được tạo xong.');
  console.log(' - Để tự động đẩy 53 Ngày Lễ Các Thánh + 31 Danh Mục + 104 Lời Nguyện lên Prismic CMS, hãy mở file .env và điền:');
  console.log('   PRISMIC_REPO=tên-repo-của-bạn');
  console.log('   PRISMIC_WRITE_TOKEN=token-viet-tu-prismic-dashboard');
}

async function pushToPrismicRemote() {
  const writeClient = prismic.createWriteClient(repoName, {
    writeToken: writeToken,
    accessToken: accessToken || undefined
  });

  // 1. Migrate Saints
  try {
    const saintsMigration = prismic.createMigration();
    console.log('  📤 [Pushing Saints] Queueing 53 Catholic Saints documents...');
    for (const saint of CATHOLIC_SAINTS) {
      saintsMigration.createDocument({
        type: 'catholic_saint',
        lang: docLang,
        data: {
          saint_id: saint.id,
          name: saint.name,
          saint_title: saint.saintTitle,
          date: saint.date,
          type: saint.type,
          description: saint.description
        }
      }, saint.saintTitle);
    }
    console.log('  🚀 Migrating 53 Catholic Saints to Prismic Releases...');
    await writeClient.migrate(saintsMigration);
    console.log('  ✅ [Saints] Successfully pushed 53 Catholic Saints to Prismic Releases!');
  } catch (err: any) {
    console.warn('  ⚠️ [Saints Migration Warning]:', err.message || err);
    if (err.response) {
      console.warn('  Chi tiết lỗi Prismic:', JSON.stringify(err.response, null, 2));
    }
  }

  // 2. Migrate Categories & Prayers
  try {
    const mainMigration = prismic.createMigration();
    console.log('  📤 [Pushing Categories & Prayers] Queueing categories and prayers...');
    const categoryRefs: { [uid: string]: any } = {};
    for (const cat of categoriesList) {
      const docRef = mainMigration.createDocument({
        type: 'category',
        uid: cat.uid,
        lang: docLang,
        data: { name: cat.name }
      }, cat.name);
      categoryRefs[cat.uid] = docRef;
    }

    for (const prayer of prayersList) {
      const uid = prayer.uid || prayer.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
      mainMigration.createDocument({
        type: 'prayer',
        uid: uid,
        lang: docLang,
        data: {
          title: prayer.title,
          category: categoryRefs[prayer.category] || undefined,
          content: htmlToRichText(prayer.content),
          is_novena: Boolean(prayer.isNovena)
        }
      }, prayer.title);
    }

    console.log('  🚀 Migrating Categories & Prayers to Prismic Releases...');
    await writeClient.migrate(mainMigration);
    console.log('  ✅ [Categories & Prayers] Successfully pushed to Prismic Releases!');
  } catch (err: any) {
    console.warn('  ℹ️ [Categories/Prayers Info]:', err.message || err);
  }

  console.log('\n✨ [Prismic Remote Push Complete] Please open Prismic Dashboard -> Releases and click PUBLISH.');
}
