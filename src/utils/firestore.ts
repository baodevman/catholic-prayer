import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'catholic-prayer-e6872.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'catholic-prayer-e6872',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'catholic-prayer-e6872.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '821724653219',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:821724653219:web:9f426dc3b927ef7e48c116',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-2WP54X47JZ'
};

// Singleton Firebase initialization
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export interface FirestoreUserData {
  name?: string;
  email?: string;
  roles?: string[];
  connectionCode?: string;
  favorites?: string[];
  updatedAt?: any;
  createdAt?: any;
}

/**
 * Lấy dữ liệu user từ Firestore qua email hoặc userId
 */
export async function getFirestoreUser(userKey: string): Promise<FirestoreUserData | null> {
  try {
    const cleanKey = userKey.trim().toLowerCase();
    if (!cleanKey) return null;
    const ref = doc(db, 'users', cleanKey);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as FirestoreUserData;
    }
    return null;
  } catch (error) {
    console.warn('⚠️ Lỗi đọc dữ liệu user từ Firestore:', error);
    return null;
  }
}

/**
 * Lưu hoặc cập nhật dữ liệu user trên Firestore
 */
export async function saveFirestoreUser(userKey: string, data: Partial<FirestoreUserData>): Promise<void> {
  try {
    const cleanKey = userKey.trim().toLowerCase();
    if (!cleanKey) return;
    const ref = doc(db, 'users', cleanKey);
    await setDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('⚠️ Lỗi lưu dữ liệu user lên Firestore:', error);
  }
}

/**
 * Lấy danh sách UID các lời cầu nguyện yêu thích
 */
export async function getFirestoreFavorites(userKey: string): Promise<string[]> {
  try {
    const user = await getFirestoreUser(userKey);
    return user?.favorites || [];
  } catch (error) {
    console.warn('⚠️ Lỗi đọc favorites từ Firestore:', error);
    return [];
  }
}

/**
 * Thêm hoặc bỏ một lời cầu nguyện khỏi danh sách yêu thích trên Firestore
 */
export async function toggleFirestoreFavorite(
  userKey: string,
  prayerUid: string,
  currentFavorites: string[]
): Promise<string[]> {
  const cleanKey = userKey.trim().toLowerCase();
  const isFav = currentFavorites.includes(prayerUid);
  const updated = isFav
    ? currentFavorites.filter(id => id !== prayerUid)
    : [...currentFavorites, prayerUid];

  if (!cleanKey) return updated;

  try {
    const ref = doc(db, 'users', cleanKey);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: cleanKey,
        favorites: updated,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(ref, {
        favorites: isFav ? arrayRemove(prayerUid) : arrayUnion(prayerUid),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.warn('⚠️ Lỗi đồng bộ yêu thích lên Firestore:', error);
  }

  return updated;
}

/**
 * Lưu yêu cầu chỉnh sửa lời cầu nguyện vào Firestore audit log
 */
export interface EditPrayerRequest {
  prayerUid: string;
  prayerTitle: string;
  reason: string;
  suggestedContent: string;
  senderEmail?: string;
  senderName?: string;
}

export async function saveEditRequestToFirestore(request: EditPrayerRequest): Promise<boolean> {
  try {
    const colRef = collection(db, 'edit_requests');
    await addDoc(colRef, {
      ...request,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.warn('⚠️ Không thể ghi nhận yêu cầu vào Firestore:', error);
    return false;
  }
}
