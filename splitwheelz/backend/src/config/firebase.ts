import admin from 'firebase-admin';
import { logger } from './logger';

let firebaseApp: admin.app.App;

export function initializeFirebase(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      logger.warn('Firebase credentials not fully configured — auth will fail');
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    logger.info('✅ Firebase Admin initialized');
    return firebaseApp;
  } catch (error) {
    logger.error('❌ Firebase initialization failed:', error);
    throw error;
  }
}

export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
}

export async function verifyFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken> {
  const app = getFirebaseAdmin();
  return app.auth().verifyIdToken(token);
}

export async function sendFCMNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  if (!tokens || tokens.length === 0) return;

  const app = getFirebaseAdmin();
  const messaging = app.messaging();

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title, body },
    data: data || {},
    android: {
      priority: 'high',
      notification: {
        channelId: 'splitwheelz',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          alert: { title, body },
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    logger.info(`FCM: ${response.successCount} success, ${response.failureCount} failures`);
  } catch (error) {
    logger.error('FCM send failed:', error);
  }
}

export default { initializeFirebase, getFirebaseAdmin, verifyFirebaseToken, sendFCMNotification };
