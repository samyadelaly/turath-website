import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore, disableNetwork, setLogLevel } from 'firebase/firestore';
import firebaseConfig from "./firebase-applet-config.json";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Silence internal Firestore SDK debug/backoff logs
try {
  setLogLevel('silent');
} catch {}

// Disable Firestore live network stream immediately to prevent "Quota limit exceeded"
// and "Write stream exhausted maximum allowed queued writes" on project 883754661997
// All dynamic persistence is handled by Supabase Free and local storage.
disableNetwork(db).catch(() => {});

export default app;

