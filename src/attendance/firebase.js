import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// API keys for Firebase are safe to include in client code —
// security is enforced through Firestore security rules and Auth.
const firebaseConfig = {
  apiKey: "AIzaSyBew8S-UEtx9oBwud_G9vxIg_nVsT-nW-4",
  authDomain: "gp-project-1-c1bdf.firebaseapp.com",
  projectId: "gp-project-1-c1bdf",
  storageBucket: "gp-project-1-c1bdf.firebasestorage.app",
  messagingSenderId: "1087976538458",
  appId: "1:1087976538458:web:ba4f08af16bfb7cda6b363",
  measurementId: "G-VC299W0PHJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Secondary app — creates new users without signing out the current admin
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
export const secondaryAuth = getAuth(secondaryApp);
