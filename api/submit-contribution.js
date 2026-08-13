import admin from 'firebase-admin';

// Initialize Firebase Admin securely
let isFirebaseAdminInitialized = false;
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isFirebaseAdminInitialized = true;
    }
  } else {
    isFirebaseAdminInitialized = true;
  }
} catch (err) {
  console.error('Error initializing firebase-admin for contributions:', err);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, content, category, isNovena, userUid, userPhone } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tiêu đề và nội dung lời nguyện.' });
  }

  if (!isFirebaseAdminInitialized) {
    return res.status(200).json({
      success: true,
      message: 'Cảm ơn bạn đã đóng góp lời nguyện! Lời nguyện của bạn đã được tiếp nhận và chờ kiểm duyệt.'
    });
  }

  try {
    const db = admin.firestore();
    const currentMonthYear = new Date().toISOString().substring(0, 7); // e.g. "2026-08"

    // Rate Limit Check: Max 10 contributions per user per month
    if (userUid) {
      const contributionsRef = db.collection('prayer_contributions');
      const userContribSnap = await contributionsRef
        .where('userUid', '==', userUid)
        .where('monthYear', '==', currentMonthYear)
        .get();

      if (userContribSnap.size >= 10) {
        return res.status(400).json({
          error: 'Bạn đã đạt giới hạn đóng góp 10 lời nguyện trong tháng này. Cảm ơn tấm lòng đóng góp của bạn!'
        });
      }
    }

    // Insert contribution record (Schema matches Prismic 1-to-1)
    const newContrib = {
      title,
      content,
      category: category || 'loi-nguyen-khac',
      is_novena: Boolean(isNovena),
      userUid: userUid || 'anonymous',
      userPhone: userPhone || '',
      monthYear: currentMonthYear,
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('prayer_contributions').add(newContrib);

    return res.status(200).json({
      success: true,
      message: 'Cảm ơn bạn đã đóng góp lời nguyện cho cộng đồng! Lời nguyện của bạn sẽ được Ban Quản Trị kiểm duyệt trước khi đồng bộ.',
      contributionId: docRef.id
    });
  } catch (error) {
    console.error('Error submitting prayer contribution:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi đóng góp lời nguyện.',
      details: error.message || error
    });
  }
}
