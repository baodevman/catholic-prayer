import { createClient } from '@prismicio/client';

// --- Custom Types ---
export interface Prayer {
  uid: string;
  title: string;
  category: string; // Primary Category UID
  categories?: string[]; // List of Category UIDs linked from Prismic (N links)
  content: string; // HTML formatted string
  timeOfDay?: 'sang' | 'trua' | 'chieu' | 'toi' | 'bat_ky';
  isUserSubmitted?: boolean;
  submittedByUser?: string;
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

        // Collect all N category links from Prismic document
        const categoryUids: string[] = [];
        if (d.category && d.category.uid) {
          categoryUids.push(d.category.uid);
        } else if (typeof d.category === 'string' && d.category) {
          categoryUids.push(d.category);
        }

        if (d.categories && Array.isArray(d.categories)) {
          d.categories.forEach((item: any) => {
            const linkUid = item.category_link?.uid || item.category?.uid || (typeof item === 'string' ? item : null);
            if (linkUid && !categoryUids.includes(linkUid)) {
              categoryUids.push(linkUid);
            }
          });
        }

        return {
          uid: doc.uid || doc.id,
          title: d.title || 'Lời cầu nguyện',
          category: categoryUids[0] || '',
          categories: categoryUids,
          content: richTextToHtml(d.content),
          timeOfDay: d.time_of_day || 'bat_ky',
          isUserSubmitted: Boolean(d.is_user_submitted),
          submittedByUser: d.submitted_by_user || '',
          isNovena,
          ...(isNovena && { novenaDays }),
        };
      });

      return prayers;
    } catch (error) {
      console.warn('Prismic fetch failed, falling back to local prayers.json...', error);
    }
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

// Fetch Catholic Saints documents from Prismic with fallback to local CATHOLIC_SAINTS dataset
export const fetchSaintsFromPrismic = async (): Promise<any[]> => {
  const repoName = getPrismicRepoName();
  if (repoName) {
    try {
      const accessToken = getPrismicAccessToken();
      const client = createClient(repoName, accessToken ? { accessToken } : undefined);
      const response = await client.getAllByType('catholic_saint');

      if (response && response.length > 0) {
        return response.map((doc: any) => ({
          id: doc.uid || doc.data.saint_id || doc.id,
          name: doc.data.name || '',
          saintTitle: doc.data.saint_title || doc.data.name || '',
          date: doc.data.date || '01-01',
          month: Number((doc.data.date || '01-01').split('-')[0]),
          day: Number((doc.data.date || '01-01').split('-')[1]),
          type: doc.data.type || 'memorial',
          description: doc.data.description || ''
        }));
      }
    } catch (e) {
      console.warn('Prismic fetch catholic_saint failed, using local dataset fallback', e);
    }
  }
  return [];
};
