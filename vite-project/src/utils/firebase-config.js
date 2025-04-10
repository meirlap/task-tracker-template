// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDbbgEtBQTaKpGCo4ZJNHEZzdignH0Sbm8",
  authDomain: "task-tarack.firebaseapp.com",
  projectId: "task-tarack",
  storageBucket: "task-tarack.firebasestorage.app",
  messagingSenderId: "311895794008",
  appId: "1:311895794008:web:154d345da9c5714dd7452d",
  measurementId: "G-GQM1YEEGJT"
};

const app = initializeApp(firebaseConfig);

// ✅ נטען רק אם זה localhost או HTTPS
let messaging = null;
if (
  typeof window !== "undefined" &&
  (window.location.protocol === "https:" || window.location.hostname === "localhost")
) {
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("⚠️ Messaging init failed:", e);
  }
}

export { messaging, getToken, onMessage };
