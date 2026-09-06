import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
let firebaseAuth: Auth | undefined;

function getFirebaseAuth(): Auth {
  if (!firebaseConfigured) {
    throw new Error('Firebase authentication is not configured.');
  }

  if (firebaseAuth) {
    return firebaseAuth;
  }

  const app: FirebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
  return firebaseAuth;
}

export function isFirebaseConfigured(): boolean {
  return firebaseConfigured;
}

export async function signInWithFirebase(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return result.user;
}

export async function signOutFromFirebase(): Promise<void> {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  }
}

export function firebaseErrorMessage(error: unknown): string {
  const code = error instanceof Error && 'code' in error
    ? String((error as Error & { code: string }).code)
    : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return error instanceof Error ? error.message : 'Unable to sign in.';
  }
}
