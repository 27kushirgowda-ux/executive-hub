import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- SECURE CONFIGURATION ---
// These variables pull data from the Environment Variables you saved in Vercel
const firebaseConfig = {
  apiKey: "AIzaSyAa2TW7hVEtuw-Bj0E98VssOGf6Ni2Y_pc",
  authDomain: "interntrack-635c7.firebaseapp.com",
  projectId: "interntrack-635c7",
  storageBucket: "interntrack-635c7.firebasestorage.app",
  messagingSenderId: "1025977528363",
  appId: "1:1025977528363:web:056c3b4d1da7969eb7fa6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in your Hub
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);