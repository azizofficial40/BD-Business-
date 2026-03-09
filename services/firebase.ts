import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Import the Firebase configuration
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };

/**
 * RECOMMENDED FIRESTORE SECURITY RULES:
 *
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /{document=**} {
 *       allow read, write: if true; // FOR DEMO ONLY - Update for production!
 *     }
 *   }
 * }
 */
