// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Read config from environment variables.
 * - For Create React App use REACT_APP_FIREBASE_*
 * - For Vite use VITE_FIREBASE_*
 * - For Next.js use NEXT_PUBLIC_FIREBASE_*
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Basic runtime check (only helpful in dev)
if (
  process.env.NODE_ENV === "development" &&
  !firebaseConfig.apiKey
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Firebase API key not found in environment. Make sure to set REACT_APP_FIREBASE_* or VITE_FIREBASE_* variables."
  );
}

// Prevent initializing the app more than once (works with HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export auth and app for use across the app
export const auth = getAuth(app);
export default app;