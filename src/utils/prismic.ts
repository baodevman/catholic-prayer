import { createClient } from '@prismicio/client';
import { storage } from './storage';

// --- Custom Types ---
export interface Prayer {
  uid: string;
  title: string;
  category: string; // morning-work | morning-school | evening-weekday | evening-weekend | feast-holiday | novena
  content: string; // HTML formatted string
  isNovena?: boolean;
  novenaDays?: NovenaDay[];
}

export interface NovenaDay {
  day: number;
  title: string;
  content: string; // HTML formatted string
}

// Key for storing Prismic Repository Name in LocalStorage
const REPO_NAME_KEY = 'catholic_prayer_prismic_repo';

export const getPrismicRepoName = (): string => {
  return localStorage.getItem(REPO_NAME_KEY) || '';
};

export const setPrismicRepoName = (repoName: string): void => {
  localStorage.setItem(REPO_NAME_KEY, repoName.trim());
};

// Helper to convert Prismic RichText to simple HTML string
// (Since we are keeping the PWA dependency-free and lightweight)
const richTextToHtml = (richTextField: any): string => {
  if (!richTextField || !Array.isArray(richTextField)) return '';
  return richTextField
    .map((block: any) => {
      const text = block.text || '';
      if (block.type === 'heading1') return `<h1>${text}</h1>`;
      if (block.type === 'heading2') return `<h2>${text}</h2>`;
      if (block.type === 'heading3') return `<h3>${text}</h3>`;
      if (block.type === 'paragraph') {
        // Handle basic bolding if present
        let htmlText = text;
        if (block.spans && Array.isArray(block.spans)) {
          // Sort spans in reverse order to insert tags without messing up indices
          const sortedSpans = [...block.spans].sort((a, b) => b.start - a.start);
          sortedSpans.forEach((span: any) => {
            if (span.type === 'strong') {
              htmlText =
                htmlText.slice(0, span.start) +
                `<b>${htmlText.slice(span.start, span.end)}</b>` +
                htmlText.slice(span.end);
            }
          });
        }
        return `<p>${htmlText}</p>`;
      }
      return text;
    })
    .join('');
};

// Main fetching function with robust fallback chain
export const fetchAllPrayers = async (): Promise<Prayer[]> => {
  const repoName = getPrismicRepoName();

  // 1. If Prismic is configured, attempt to fetch from Prismic
  if (repoName) {
    try {
      const client = createClient(repoName);
      // Fetch all documents of type 'prayer', ordering by title
      const response = await client.getAllByType('prayer');

      // Map Prismic documents to our clean Prayer interface
      const prayers: Prayer[] = response.map((doc: any) => {
        const d = doc.data;
        const isNovena = d.is_novena === true || doc.category === 'novena';
        
        let novenaDays: NovenaDay[] = [];
        if (isNovena && d.novena_days && Array.isArray(d.novena_days)) {
          novenaDays = d.novena_days.map((item: any) => ({
            day: Number(item.day || 1),
            title: item.day_title || `Ngày thứ ${item.day}`,
            content: richTextToHtml(item.day_content),
          })).sort((a: NovenaDay, b: NovenaDay) => a.day - b.day);
        }

        return {
          uid: doc.uid || doc.id,
          title: d.title || 'Kinh không tên',
          category: d.category || 'feast-holiday',
          content: richTextToHtml(d.content),
          isNovena,
          ...(isNovena && { novenaDays }),
        };
      });

      // If user enabled offline caching, update IndexedDB cache
      if (storage.isOfflineEnabled()) {
        await storage.setCachedPrayers(prayers);
      }

      return prayers;
    } catch (error) {
      console.warn('Prismic fetch failed, trying IndexedDB cache...', error);
    }
  }

  // 2. Fallback to IndexedDB cache
  try {
    const cached = await storage.getCachedPrayers();
    if (cached && cached.length > 0) {
      return cached;
    }
  } catch (e) {
    console.error('IndexedDB read failed', e);
  }

  // 3. Ultimate Fallback to local prayers.json
  try {
    const response = await fetch('/prayers.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Local JSON fetch failed', error);
  }

  return [];
};
