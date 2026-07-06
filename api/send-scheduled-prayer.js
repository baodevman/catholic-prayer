const admin = require('firebase-admin');
const prismic = require('@prismicio/client');

// Initialize Firebase Admin
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err);
      admin.initializeApp();
    }
  } else {
    admin.initializeApp();
  }
}

function prismicRichTextToPlain(richTextArray) {
  if (!Array.isArray(richTextArray)) return '';
  return richTextArray.map(block => block.text || '').join('\n');
}

module.exports = async (req, res) => {
  // Verify Vercel Cron authorization header (optional but recommended for security)
  // Vercel sends a CRON authorization token or bypass if testing
  const cronAuth = req.headers.authorization;
  const isLocalDev = process.env.NODE_ENV === 'development';
  
  // You can trigger manually via browser, but we log it
  console.log(`Cron check triggered. Method: ${req.method}, Query:`, req.query);

  const period = req.query.period || 'morning'; // 'morning' or 'evening'
  const repoName = process.env.PRISMIC_REPO || 'easyforpray';

  try {
    const client = prismic.createClient(repoName);
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
          // Select one randomly for variety
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
      // Absolute fallback if no matching category prayers
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
};
