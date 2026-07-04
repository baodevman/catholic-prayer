import * as fs from 'fs';
import * as path from 'path';
import * as prismic from '@prismicio/client';

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

const repoName = process.env.PRISMIC_REPO || '';
const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';
const accessToken = process.env.PRISMIC_ACCESS_TOKEN || process.env.VITE_PRISMIC_ACCESS_TOKEN || '';

if (!repoName || !writeToken) {
  console.error('❌ Lỗi: Thiếu biến môi trường PRISMIC_REPO hoặc PRISMIC_WRITE_TOKEN.');
  console.log('Vui lòng thiết lập chúng trong file .env ở thư mục gốc hoặc chạy script với dạng:');
  console.log('PRISMIC_REPO=your-repo PRISMIC_WRITE_TOKEN=your-token npm run prayers:import');
  process.exit(1);
}

// Interfaces
interface InputCategory {
  uid: string;
  name: string;
  parent?: string;
}

interface InputPrayer {
  title: string;
  category: string;
  content: string;
  isNovena?: boolean;
  novenaDays?: {
    day: number;
    title: string;
    content: string;
  }[];
}

const categoriesFilePath = path.join(process.cwd(), 'import-categories.json');
const prayersFilePath = path.join(process.cwd(), 'import-prayers.json');

// Helper to construct Prismic rich text structure
const textToRichText = (htmlText: string) => {
  const clean = htmlText
    .replace(/<p>/g, '')
    .split(/<\/p>/);

  return clean
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      const boldRegex = /<b>(.*?)<\/b>/g;
      let text = p.replace(/<b>/g, '').replace(/<\/b>/g, '');
      const spans: any[] = [];
      
      let match;
      const tempP = p;
      let boldOffset = 0;
      while ((match = boldRegex.exec(tempP)) !== null) {
        const matchedText = match[1];
        const start = match.index - boldOffset;
        const end = start + matchedText.length;
        spans.push({
          start,
          end,
          type: 'strong'
        });
        boldOffset += 7; // Length of <b> and </b> tags
      }

      return {
        type: 'paragraph',
        text,
        spans
      };
    });
};

async function executeMigration() {
  // Check files
  if (!fs.existsSync(categoriesFilePath) || !fs.existsSync(prayersFilePath)) {
    console.error('❌ Lỗi: Thiếu file dữ liệu import-categories.json hoặc import-prayers.json.');
    process.exit(1);
  }

  const docLang = process.env.PRISMIC_LANG || 'vi';

  console.log('📖 Đang đọc dữ liệu các danh mục...');
  const categories: InputCategory[] = JSON.parse(fs.readFileSync(categoriesFilePath, 'utf8'));

  console.log('📖 Đang đọc dữ liệu các kinh nguyện...');
  const prayers: InputPrayer[] = JSON.parse(fs.readFileSync(prayersFilePath, 'utf8'));

  console.log(`🚀 Đang kết nối tới Prismic repo "${repoName}"...`);

  try {
    // 1. Create Prismic write client
    const writeClient = prismic.createWriteClient(repoName, {
      writeToken: writeToken,
      accessToken: accessToken || undefined
    });

    // 2. Create Prismic migration container
    const migration = prismic.createMigration();

    // Dictionary to hold category document references
    const categoryRefs: { [uid: string]: any } = {};

    // 3. Queue Parent Categories
    console.log('🗂️ Đang xếp hàng các danh mục cha...');
    for (const cat of categories) {
      if (!cat.parent) {
        console.log(` - Danh mục cha: ${cat.name} (uid: ${cat.uid})`);
        const docRef = migration.createDocument({
          type: 'category',
          uid: cat.uid,
          lang: docLang,
          data: {
            name: cat.name
          }
        }, cat.name);
        categoryRefs[cat.uid] = docRef;
      }
    }

    // 4. Queue Child Categories
    console.log('🗂️ Đang xếp hàng các danh mục con...');
    for (const cat of categories) {
      if (cat.parent) {
        console.log(` - Danh mục con: ${cat.name} (parent: ${cat.parent})`);
        const parentRef = categoryRefs[cat.parent];
        const docRef = migration.createDocument({
          type: 'category',
          uid: cat.uid,
          lang: docLang,
          data: {
            name: cat.name,
            parent: parentRef ? parentRef : undefined
          }
        }, cat.name);
        categoryRefs[cat.uid] = docRef;
      }
    }

    // 5. Queue Prayers and Link Categories
    console.log('🙏 Đang xếp hàng các bài kinh nguyện...');
    for (const prayer of prayers) {
      const uid = prayer.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const catRef = categoryRefs[prayer.category];
      if (!catRef) {
        console.warn(`⚠️ Cảnh báo: Không tìm thấy danh mục "${prayer.category}" cho bài kinh "${prayer.title}".`);
      }

      console.log(` - Kinh nguyện: ${prayer.title} (danh mục: ${prayer.category})`);

      const docData: any = {
        title: prayer.title,
        category: catRef ? catRef : undefined,
        content: textToRichText(prayer.content),
        is_novena: prayer.isNovena === true,
      };

      if (prayer.isNovena && prayer.novenaDays) {
        docData.novena_days = prayer.novenaDays.map(day => ({
          day: day.day,
          day_title: day.title,
          day_content: textToRichText(day.content)
        }));
      }

      migration.createDocument({
        type: 'prayer',
        uid: uid,
        lang: docLang,
        data: docData
      }, prayer.title);
    }

    // 6. Execute Migration
    console.log('📤 Đang đồng bộ cấu trúc & tài liệu lên Prismic Migration Release (1 request/giây)...');
    await writeClient.migrate(migration);

    console.log('✅ Hoàn thành đồng bộ dữ liệu danh mục & 75 kinh nguyện lên Prismic thành công!');
    console.log('Hãy vào Prismic Dashboard -> Releases của bạn để xem và nhấn PUBLISH.');

  } catch (error: any) {
    console.error('❌ Lỗi trong quá trình di chuyển dữ liệu:', error.message || error);
    if (error.response) {
      console.error('Chi tiết Lỗi từ Prismic Server:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

executeMigration();
