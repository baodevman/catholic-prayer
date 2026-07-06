import admin from 'firebase-admin';
import * as prismic from '@prismicio/client';

// Initialize Firebase Admin securely
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('Warning: FIREBASE_SERVICE_ACCOUNT is missing in environment variables.');
    }
  }
} catch (err) {
  console.error('Error initializing firebase-admin:', err);
}

function prismicRichTextToPlain(richTextArray) {
  if (!Array.isArray(richTextArray)) return '';
  return richTextArray.map(block => block.text || '').join('\n');
}

export default async function handler(req, res) {
  const period = req.query.period || 'morning'; // 'morning' or 'evening'
  const repoName = process.env.PRISMIC_REPO || 'easyforpray';

  try {
    const accessToken = process.env.PRISMIC_ACCESS_TOKEN || process.env.VITE_PRISMIC_ACCESS_TOKEN || '';
    const client = prismic.createClient(repoName, {
      accessToken: accessToken || undefined
    });
    const response = await client.getAllByType('prayer');

    if (response.length === 0) {
      return res.status(200).json({ success: true, message: 'Không có kinh nguyện nào trên Prismic.' });
    }

    let selectedPrayer = null;

    // 1. Check if admin flagged any prayer with "push" tag
    const adminPushPrayer = response.find(doc => doc.tags && doc.tags.includes('push'));
    
    if (adminPushPrayer) {
      selectedPrayer = adminPushPrayer;
      console.log(`Admin override: Found prayer with "push" tag: "${selectedPrayer.data.title}"`);
    } else {
      // 2. Select prayer matching the time period
      if (period === 'morning') {
        const morningCats = [
          'loi-nguyen-cau-truoc-khi-di-lam',
          'loi-nguyen-cau-truoc-khi-di-hoc',
          'loi-nguyen-cau-danh-cho-nguoi-lon-tuoi',
          'loi-nguyen-truoc-mot-chuyen-di',
          'loi-nguyen-cau-buoi-sang'
        ];
        const morningPrayers = response.filter(doc => {
          const cat = doc.data.category?.uid || doc.data.category;
          return morningCats.includes(cat) && !doc.data.is_novena;
        });
        
        if (morningPrayers.length > 0) {
          selectedPrayer = morningPrayers[Math.floor(Math.random() * morningPrayers.length)];
        }
      } else {
        // evening
        const eveningCats = [
          'loi-nguyen-cuoi-ngay-di-lam',
          'loi-nguyen-cuoi-ngay-di-hoc',
          'loi-nguyen-cuoi-ngay-sau-mot-chuyen-di',
          'loi-nguyen-cuoi-ngay-sau-khi-trai-qua-kho-khan',
          'loi-nguyen-cau-buoi-toi',
          'loi-nguyen-cho-su-hoa-thuan-yeu-thuong',
          'loi-nguyen-cho-long-hieu-thao',
          'loi-nguyen-cho-su-binh-an-cua-cha-me-ong-ba',
          'loi-nguyen-danh-cho-con-cai',
          'loi-nguyen-cau-trong-kinh-toi-gia-dinh'
        ];
        const eveningPrayers = response.filter(doc => {
          const cat = doc.data.category?.uid || doc.data.category;
          return eveningCats.includes(cat) && !doc.data.is_novena;
        });
        
        if (eveningPrayers.length > 0) {
          selectedPrayer = eveningPrayers[Math.floor(Math.random() * eveningPrayers.length)];
        }
      }
    }

    if (!selectedPrayer) {
      selectedPrayer = response[0];
    }

    const title = selectedPrayer.data.title || 'Giờ Kinh Nguyện';
    const rawContent = prismicRichTextToPlain(selectedPrayer.data.content);
    const body = rawContent.substring(0, 150) + (rawContent.length > 150 ? '...' : '');

    // Send FCM Notification to all subscribed users via "prayer-alerts" topic
    const payload = {
      data: {
        title,
        body,
        period,
        uid: selectedPrayer.uid || selectedPrayer.id
      },
      topic: 'prayer-alerts'
    };

    console.log(`Sending push notification payload:`, payload);
    const messagingResponse = await admin.messaging().send(payload);
    console.log('FCM push response:', messagingResponse);

    return res.status(200).json({
      success: true,
      message: `Đã gửi thông báo đẩy thành công cho buổi ${period === 'morning' ? 'sáng' : 'tối'}!`,
      prayer: title,
      fcmMessageId: messagingResponse
    });

  } catch (error) {
    console.error('Error in send-scheduled-prayer cron job:', error);
    return res.status(500).json({
      error: 'Lỗi trong quá trình xử lý gửi thông báo đẩy.',
      details: error.message || error
    });
  }
}
