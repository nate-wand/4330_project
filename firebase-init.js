
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js"
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging.js";

  const firebaseConfig = {
    apiKey: "AIzaSyC4hqYqSmvbDDsDHKn6dBJLwMXcUw1xDKw",
    authDomain: "pulsar-ai-1890e.firebaseapp.com",
    projectId: "pulsar-ai-1890e",
    storageBucket: "pulsar-ai-1890e.firebasestorage.app",
    messagingSenderId: "767506424716",
    appId: "1:767506424716:web:48a0fbdf100026edbaeca9",
    measurementId: "G-LJG6V8PY44"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const messaging = getMessaging(app);

  export { auth, createUserWithEmailAndPassword, db, setDoc, doc, signInWithEmailAndPassword, getDoc, updateDoc, onAuthStateChanged, signOut, sendPasswordResetEmail, messaging, getToken, onMessage, increment, setPersistence, browserSessionPersistence, browserLocalPersistence };