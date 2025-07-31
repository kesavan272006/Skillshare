import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA5fMlQZT1YETUOwcrfHOEo_RT-xufmyk4",
  authDomain: "skillshare-4efaf.firebaseapp.com",
  projectId: "skillshare-4efaf",
  storageBucket: "skillshare-4efaf.firebasestorage.app",
  messagingSenderId: "609880518474",
  appId: "1:609880518474:web:5d4e0f9108770dc2cb9bb3",
  measurementId: "G-B5FYQ5W563"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider(app);
export const database = getFirestore(app);