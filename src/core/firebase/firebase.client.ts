import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { connectFirestoreEmulator, initializeFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === '1';

export const TRIP_ID = process.env.NEXT_PUBLIC_TRIP_ID || 'dalat-3n2d';

export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId && config.appId);
}

interface FirebaseHandles {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let handles: FirebaseHandles | null = null;

function createFirestore(app: FirebaseApp): Firestore {
  // Tự chuyển sang long-polling khi mạng / proxy / antivirus chặn kết nối streaming
  return initializeFirestore(app, { ignoreUndefinedProperties: true, experimentalAutoDetectLongPolling: true });
}

/** Khởi tạo Firebase một lần, chỉ chạy trên trình duyệt. Trả null nếu chưa cấu hình. */
export function getFirebase(): FirebaseHandles | null {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) return null;
  if (handles) return handles;
  const app = getApps()[0] ?? initializeApp(config);
  // Giữ đăng nhập trên máy này cho tới khi bấm Đăng xuất
  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  const db = createFirestore(app);
  if (useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  handles = { app, auth, db };
  return handles;
}
