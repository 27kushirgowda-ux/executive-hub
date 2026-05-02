import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAa2TW7hVEtuw-Bj0E98VssOGf6Ni2Y_pc",
  authDomain: "interntrack-635c7.firebaseapp.com",
  projectId: "interntrack-635c7",
  storageBucket: "interntrack-635c7.firebasestorage.app",
  messagingSenderId: "1025977528363",
  appId: "1:1025977528363:web:056c3b4d1da7969eb7fa6e"
};;

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);