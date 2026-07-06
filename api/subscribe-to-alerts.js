const admin = require('firebase-admin');

// Initialize Firebase Admin securely
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

module.exports = async (req, res) => {
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
    // Subscribe the token to FCM topic
    // FCM subscription token can be a string or a registration token object
    const registrationToken = typeof token === 'string' ? token : (token.token || token.endpoint);
    
    if (!registrationToken) {
       return res.status(400).json({ error: 'Invalid registration token format' });
    }

    const response = await admin.messaging().subscribeToTopic(registrationToken, 'prayer-alerts');
    console.log('Successfully subscribed token to prayer-alerts:', response);

    return res.status(200).json({ success: true, message: 'Đăng ký nhận thông báo đẩy thành công!' });
  } catch (error) {
    console.error('Error subscribing token to FCM topic:', error);
    return res.status(500).json({ error: error.message || 'Không thể đăng ký thiết bị nhận thông báo.' });
  }
};
