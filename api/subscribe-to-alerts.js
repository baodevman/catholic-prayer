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
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('Warning: FIREBASE_SERVICE_ACCOUNT is missing in environment variables.');
    }
  } else {
    isFirebaseAdminInitialized = true;
  }
} catch (err) {
  console.error('Error initializing firebase-admin:', err);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing required registration token' });
  }

  // If Firebase Admin is not configured on server, log warning and return success for client local mode
  if (!isFirebaseAdminInitialized && !admin.apps.length) {
    return res.status(200).json({
      success: true,
      warning: 'FIREBASE_SERVICE_ACCOUNT chưa được cấu hình trên Vercel. Đã ghi nhận token cho chế độ thông báo cục bộ.',
      message: 'Kích hoạt thông báo trên thiết bị thành công!'
    });
  }

  try {
    let registrationToken = '';
    if (typeof token === 'string') {
      registrationToken = token;
    } else if (token && typeof token === 'object') {
      const endpoint = token.endpoint || '';
      if (endpoint.includes('/') && (endpoint.startsWith('http://') || endpoint.startsWith('https://'))) {
        const parts = endpoint.split('/');
        registrationToken = parts[parts.length - 1];
      } else {
        registrationToken = token.token || token.endpoint || '';
      }
    }

    if (!registrationToken) {
       return res.status(400).json({ error: 'Không thể trích xuất Registration Token từ trình duyệt.' });
    }

    const response = await admin.messaging().subscribeToTopic(registrationToken, 'prayer-alerts');
    console.log('FCM subscribeToTopic response:', JSON.stringify(response, null, 2));

    if (response.failureCount > 0) {
      const firstErr = response.errors && response.errors[0] ? response.errors[0].error : null;
      const errMsg = firstErr?.message || firstErr?.code || 'Token không hợp lệ hoặc đã hết hạn trên FCM.';
      console.warn('FCM Topic Subscription Failed:', errMsg);

      return res.status(400).json({
        success: false,
        error: `FCM từ chối Token: ${errMsg}. Hệ thống sẽ xin lại Token mới.`
      });
    }

    return res.status(200).json({ success: true, message: 'Đăng ký nhận thông báo đẩy thành công!' });
  } catch (error) {
    console.error('Error subscribing token to FCM topic:', error);
    // Graceful fallback response
    return res.status(200).json({
      success: true,
      warning: error.message || 'Lỗi kết nối FCM topic.',
      message: 'Đã bật thông báo cục bộ trên thiết bị!'
    });
  }
}
