import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (provided by user)
const firebaseConfig = {
  apiKey: "AIzaSyD1Q2l-e-XmcnWbAwdxa-ptw7scpyDyFXg",
  authDomain: "project-6228630619687548592.firebaseapp.com",
  projectId: "project-6228630619687548592",
  storageBucket: "project-6228630619687548592.firebasestorage.app",
  messagingSenderId: "60097002739",
  appId: "1:60097002739:web:ccc1f5a4f2f21d971c0b86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile,
  onAuthStateChanged
};
