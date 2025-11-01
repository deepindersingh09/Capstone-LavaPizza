// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
// Your web app's Firebase configuration
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

export const auth = getAuth(app);