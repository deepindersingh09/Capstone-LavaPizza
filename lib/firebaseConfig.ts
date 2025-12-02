import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5AevqcU5AfLqQ1QV6AjQMStDDfd0TeBk",
  authDomain: "lava-pizza.firebaseapp.com",
  projectId: "lava-pizza",
  storageBucket: "lava-pizza.firebasestorage.app",
  messagingSenderId: "898725473422",
  appId: "1:898725473422:web:493925b270a984f1396ddf"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };