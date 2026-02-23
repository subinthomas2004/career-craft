
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEz1U9IjwTUZZ-xkGtpG7iEYDHsddYD4A",
  authDomain: "carrer-craft-7194f.firebaseapp.com",
  projectId: "carrer-craft-7194f",
  storageBucket: "carrer-craft-7194f.firebasestorage.app",
  messagingSenderId: "649699222175",
  appId: "1:649699222175:web:7c7669c31fe8637f9478aa",
  measurementId: "G-JNJS87MFNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
