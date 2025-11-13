
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js"
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBm2y_zC7uxfhNRsK3atIadNypqo99mHww",
    authDomain: "reza-3cd79.firebaseapp.com",
    projectId: "reza-3cd79",
    storageBucket: "reza-3cd79.firebasestorage.app",
    messagingSenderId: "509482431903",
    appId: "1:509482431903:web:8e4a2caa670e0c2b87f9aa"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const messaging = getMessaging(app);

  export { auth, createUserWithEmailAndPassword, db, setDoc, doc, signInWithEmailAndPassword, getDoc, updateDoc, onAuthStateChanged, signOut, sendPasswordResetEmail, messaging, getToken, onMessage, increment, setPersistence, browserSessionPersistence, browserLocalPersistence };