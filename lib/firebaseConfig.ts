// lib/firebaseConfig.ts

// Import Firebase SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5AevqcU5AfLqQ1QV6AjQMStDDfd0TeBk",
  authDomain: "lava-pizza.firebaseapp.com",
  projectId: "lava-pizza",
  storageBucket: "lava-pizza.firebasestorage.app",
  messagingSenderId: "898725473422",
  appId: "1:898725473422:web:493925b270a984f1396ddf",
};

// Initialize Firebase (avoid duplicate initialization during Fast Refresh)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export them properly
export { app, auth, db, storage };
export default app;
