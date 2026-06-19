import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp
let auth: Auth

export function initializeFirebase(): FirebaseApp {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  auth = getAuth(app)
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase()
  }
  return auth
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  const auth = getFirebaseAuth()
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {},
    'expired-callback': () => {},
  })
}

export async function sendOTP(
  phone: string,
  recaptchaVerifier: RecaptchaVerifier
) {
  const auth = getFirebaseAuth()
  return signInWithPhoneNumber(auth, phone, recaptchaVerifier)
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth()
  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}

export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

export { auth }
