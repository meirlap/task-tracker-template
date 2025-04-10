/* firebase-messaging-sw.js */

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDbbgEtBQTaKGpCGo4ZJNHEZzdigmH05bm8",
  authDomain: "task-tarack.firebaseapp.com",
  projectId: "task-tarack",
  storageBucket: "task-tarack.appspot.com",
  messagingSenderId: "311895794008",
  appId: "1:311895794008:web:154d345da9c5714dd7452d",
  measurementId: "G-GQM1YEEG3T"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
