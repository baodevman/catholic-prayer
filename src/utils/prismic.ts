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
  return (import.meta.env.VITE_PRISMIC_REPO as string) || localStorage.getItem(REPO_NAME_KEY) || 'easyforpray';
};

export const getPrismicAccessToken = (): string => {
  return (import.meta.env.VITE_PRISMIC_ACCESS_TOKEN as string) || '';
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
      const accessToken = getPrismicAccessToken();
      const client = createClient(repoName, accessToken ? { accessToken } : undefined);
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
          category: (d.category && d.category.uid) ? d.category.uid : (typeof d.category === 'string' ? d.category : ''),
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

export interface PrismicCategory {
  uid: string;
  name: string;
  parentUid?: string;
}

// Fetch all category documents from Prismic with localStorage caching fallback
export const fetchAllCategories = async (): Promise<PrismicCategory[]> => {
  const repoName = getPrismicRepoName();
  const cacheKey = 'catholic_prayer_categories_cache';
  
  if (repoName) {
    try {
      const accessToken = getPrismicAccessToken();
      const client = createClient(repoName, accessToken ? { accessToken } : undefined);
      const response = await client.getAllByType('category');
      
      const categories: PrismicCategory[] = response.map((doc: any) => ({
        uid: doc.uid || '',
        name: doc.data.name || '',
        parentUid: doc.data.parent && doc.data.parent.uid ? doc.data.parent.uid : undefined
      }));

      // Cache locally
      localStorage.setItem(cacheKey, JSON.stringify(categories));
      return categories;
    } catch (error) {
      console.warn('Prismic fetch categories failed, trying local storage cache...', error);
    }
  }

  // Fallback to local storage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  // Fallback to static category list if no cache is available
  try {
    const response = await fetch('/import-categories.json');
    if (response.ok) {
      const list = await response.json();
      return list.map((item: any) => ({
        uid: item.uid,
        name: item.name,
        parentUid: item.parent
      }));
    }
  } catch {}

  return [];
};
