import * as fs from 'fs';
import * as path from 'path';
import { createMigration, run } from '@prismicio/migrate';

// Ensure required environment variables are set
const repoName = process.env.PRISMIC_REPO || '';
const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';

if (!repoName || !writeToken) {
  console.error('❌ Lỗi: Thiếu biến môi trường PRISMIC_REPO hoặc PRISMIC_WRITE_TOKEN.');
  console.log('Vui lòng chạy script với định dạng:');
  console.log('PRISMIC_REPO=your-repo PRISMIC_WRITE_TOKEN=your-token npx tsx scripts/import-prayers.ts');
  process.exit(1);
}

// Custom interface for the input JSON
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

const inputFilePath = path.join(process.cwd(), 'import-prayers.json');

// Helper to construct Prismic rich text structure from plain text/simple HTML
const textToRichText = (htmlText: string) => {
  // Simple parser: split by paragraphs <p> or newlines
  const clean = htmlText
    .replace(/<p>/g, '')
    .split(/<\/p>/);

  return clean
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      // Check if there are <b> tags for bold spans
      const boldRegex = /<b>(.*?)<\/b>/g;
      let text = p.replace(/<b>/g, '').replace(/<\/b>/g, '');
      const spans: any[] = [];
      
      let match;
      const tempP = p;
      // Re-calculate indices for bold spans in raw text
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
        boldOffset += 7; // Length of <b> and </b> tags removed
      }

      return {
        type: 'paragraph',
        text,
        spans
      };
    });
};

async function executeMigration() {
  if (!fs.existsSync(inputFilePath)) {
    console.error(`❌ Lỗi: Không tìm thấy tệp dữ liệu tại ${inputFilePath}`);
    console.log('Vui lòng tạo tệp "import-prayers.json" ở thư mục gốc của dự án với danh sách các kinh nguyện.');
    process.exit(1);
  }

  console.log(`📖 Đang đọc dữ liệu từ ${inputFilePath}...`);
  const rawData = fs.readFileSync(inputFilePath, 'utf8');
  let prayersToImport: InputPrayer[] = [];

  try {
    prayersToImport = JSON.parse(rawData);
    if (!Array.isArray(prayersToImport)) {
      throw new Error('Dữ liệu JSON phải là một mảng các đối tượng kinh nguyện.');
    }
  } catch (e: any) {
    console.error('❌ Lỗi: Định dạng tệp JSON không hợp lệ.', e.message);
    process.exit(1);
  }

  console.log(`🚀 Đang chuẩn bị đẩy ${prayersToImport.length} kinh nguyện lên Prismic repo "${repoName}"...`);

  try {
    // 1. Create Prismic migration session
    const migration = createMigration({
      repositoryName: repoName,
      token: writeToken,
    });

    // 2. Queue documents
    for (const prayer of prayersToImport) {
      // Create UID from title
      const uid = prayer.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      console.log(` - Đang xếp hàng: ${prayer.title} (uid: ${uid})`);

      const docData: any = {
        title: prayer.title,
        category: prayer.category,
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
        title: prayer.title,
        data: docData
      });
    }

    // 3. Run migration with rate limits (automatically handled by run())
    console.log('📤 Đang thực hiện đẩy dữ liệu lên Prismic Migration Release (1 request/giây)...');
    await run(migration);

    console.log('✅ Hoàn thành di chuyển dữ liệu thành công!');
    console.log('Hãy truy cập Prismic Dashboard -> Releases của bạn để xem và nhấn PUBLISH các bản nháp vừa tạo.');

  } catch (error: any) {
    console.error('❌ Lỗi trong quá trình di chuyển dữ liệu:', error.message || error);
    process.exit(1);
  }
}

executeMigration();
