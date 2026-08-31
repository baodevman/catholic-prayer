import * as prismic from '@prismicio/client';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword, timeOfDay, matchedPrayers, userRole } = req.body || {};

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Missing keyword payload.' });
  }

  const repoName = process.env.PRISMIC_REPO || process.env.VITE_PRISMIC_REPO || '';
  const writeToken = process.env.PRISMIC_WRITE_TOKEN || process.env.PRISMIC_ACCESS_TOKEN || '';
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN || '';

  if (!repoName || !writeToken) {
    // Log locally if Prismic credentials are not configured on server
    console.log(`[Search Intent Logged Locally] Keyword: "${keyword}", Time: "${timeOfDay}", Role: "${userRole}"`);
    return res.status(200).json({ success: true });
  }

  try {
    const timestampStr = new Date().toISOString();
    const uid = `intent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const writeClient = prismic.createWriteClient(repoName, {
      writeToken: writeToken,
      accessToken: accessToken || undefined
    });

    const migration = prismic.createMigration();
    const docLang = process.env.PRISMIC_LANG || 'vi';

    migration.createDocument({
      type: 'user_search_intent',
      uid: uid,
      lang: docLang,
      data: {
        keyword: keyword.trim().slice(0, 300),
        time_of_day: timeOfDay || 'bat_ky',
        matched_prayers: Array.isArray(matchedPrayers) ? matchedPrayers.join(', ') : String(matchedPrayers || ''),
        user_role: userRole || 'worker',
        timestamp: timestampStr
      }
    }, `Search Intent ${timestampStr}`);

    await writeClient.migrate(migration);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Log Search Intent Error:', error);
    // Return 200 to keep failure silent on client side
    return res.status(200).json({ success: false });
  }
}
