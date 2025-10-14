// lib/firebase.ts - SIMPLE VERSION
import 'react-native-get-random-values';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD5AevqcU5AfLqQ1QV6AjQMStDDfd0TeBk",
  authDomain: "lava-pizza.firebaseapp.com",
  projectId: "lava-pizza",
  storageBucket: "lava-pizza.firebasestorage.app",
  messagingSenderId: "898725473422",
  appId: "1:898725473422:web:493925b270a984f1396ddf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);

console.log('🔥 Firebase initialized');
console.log('✅ Auth:', !!auth);

export { auth};