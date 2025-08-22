import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKBgd3kkFxOG-Tbum21zyX9ajupPKlaR4",
  authDomain: "messagingapp-15f53.firebaseapp.com",
  projectId: "messagingapp-15f53",
  storageBucket: "messagingapp-15f53.firebasestorage.app",
  messagingSenderId: "140150478101",
  appId: "1:140150478101:web:232512854e3353a0a9c51c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);