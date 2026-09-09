import fs from 'fs';
import path from 'path';
import * as prismic from '@prismicio/client';
import { extractTagsFromPrayer } from '../src/utils/prismic.ts';

// Load .env file programmatically
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

const repoName = process.env.PRISMIC_REPO || process.env.VITE_PRISMIC_REPO || 'catholic-prayer';
const writeToken = process.env.PRISMIC_WRITE_TOKEN || '';
const accessToken = process.env.PRISMIC_ACCESS_TOKEN || process.env.VITE_PRISMIC_ACCESS_TOKEN || '';

if (!writeToken) {
  console.error('❌ Missing PRISMIC_WRITE_TOKEN in environment variables.');
  process.exit(1);
}

async function runTagSync() {
  console.log(`🚀 Starting tag sync for Prismic repository: "${repoName}"...`);

  const readClient = prismic.createClient(repoName, accessToken ? { accessToken } : undefined);
  const writeClient = prismic.createWriteClient(repoName, {
    writeToken,
    accessToken: accessToken || undefined
  });

  const allPrayers = await readClient.getAllByType('prayer');
  console.log(`📖 Found ${allPrayers.length} prayers in Prismic.`);

  const migration = prismic.createMigration();
  let updatedCount = 0;

  for (const doc of allPrayers) {
    const title = doc.data.title || '';
    const content = Array.isArray(doc.data.content)
      ? doc.data.content.map((b: any) => b.text || '').join(' ')
      : '';
    const timeOfDay = doc.data.time_of_day || 'bat_ky';
    const roles = Array.isArray(doc.data.roles) ? doc.data.roles.map((r: any) => r.role || r) : [];
    const category = doc.data.category?.uid || '';

    const currentTags: string[] = doc.tags || [];
    const generatedTags = extractTagsFromPrayer({
      title,
      content,
      timeOfDay,
      roles,
      tags: currentTags,
      category
    });

    const newTags = Array.from(new Set([...currentTags, ...generatedTags]));

    // Check if tags changed
    if (newTags.length !== currentTags.length || newTags.some(t => !currentTags.includes(t))) {
      const allowedFields = [
        'title', 'category', 'categories', 'content', 'time_of_day',
        'roles', 'is_user_submitted', 'submitted_by_user', 'is_novena'
      ];
      const cleanData: any = {};
      for (const key of allowedFields) {
        if (doc.data[key] !== undefined) {
          cleanData[key] = doc.data[key];
        }
      }

      migration.updateDocument({
        id: doc.id,
        type: doc.type,
        lang: doc.lang,
        tags: newTags,
        data: cleanData
      } as any, title || doc.id);
      updatedCount++;
      console.log(`🏷️ [${doc.uid || doc.id}] "${title}": Added tags -> ${newTags.join(', ')}`);
    }
  }

  if (updatedCount === 0) {
    console.log('✅ All prayers already have complete tags. Nothing to migrate.');
    return;
  }

  console.log(`📦 Committing migration for ${updatedCount} documents to Prismic...`);
  await writeClient.migrate(migration);
  console.log(`🎉 Successfully updated tags for ${updatedCount} prayers on Prismic CMS!`);
}

runTagSync().catch(err => {
  console.error('❌ Error during Prismic tag sync:', err);
  if (err.response) {
    console.error('API Response details:', JSON.stringify(err.response, null, 2));
  }
  process.exit(1);
});
