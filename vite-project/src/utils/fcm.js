import { getToken } from "firebase/messaging";
import { messaging } from "./firebase-config";

export const requestPermissionAndGetToken = async () => {
  try {
    if (
      typeof window === "undefined" ||
      !messaging ||
      (window.location.protocol !== "https:" && window.location.hostname !== "localhost")
    ) {
      console.warn("⚠️ FCM is not supported in this context.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("✅ FCM token:", token);
      return token;
    } else {
      console.warn("⚠️ Notification permission not granted.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};
