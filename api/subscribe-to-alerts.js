import admin from 'firebase-admin';

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
    console.log('Successfully subscribed token to prayer-alerts:', response);

    return res.status(200).json({ success: true, message: 'Đăng ký nhận thông báo đẩy thành công!' });
  } catch (error) {
    console.error('Error subscribing token to FCM topic:', error);
    return res.status(500).json({ error: error.message || 'Không thể đăng ký thiết bị nhận thông báo.' });
  }
}
