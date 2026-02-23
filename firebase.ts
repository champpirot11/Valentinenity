import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMhM2O1e8jX0GrQ5oC0fXBRyFkANgHOhk",
  authDomain: "valentine-2bcf1.firebaseapp.com",
  projectId: "valentine-2bcf1",
  storageBucket: "valentine-2bcf1.firebasestorage.app",
  messagingSenderId: "516901727651",
  appId: "1:516901727651:web:4f6b42cb0b416772523e16"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
