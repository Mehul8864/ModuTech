import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const isConfigured = !!firebaseConfig.apiKey;

let app = null;
let auth = null;

if (isConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} else {
  console.warn(
    "Firebase not configured. Set REACT_APP_FIREBASE_* in client/.env to enable auth."
  );
  // Provide a no-op auth stub so imports don't crash
  auth = {
    currentUser: null,
    onAuthStateChanged: (_observer) => () => {},
    signInWithEmailAndPassword: async () => { throw new Error("Firebase not configured"); },
    createUserWithEmailAndPassword: async () => { throw new Error("Firebase not configured"); },
    signOut: async () => {},
  };
}

export { auth };
export default app;
