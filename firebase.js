// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCkX7d7xBj3gQ0eKnSmL_VnCY4Xw5iKxMc",
  authDomain: "byteai-cc66b.firebaseapp.com",
  projectId: "byteai-cc66b",
  storageBucket: "byteai-cc66b.firebasestorage.app",
  messagingSenderId: "529568994668",
  appId: "1:529568994668:web:98c18d0d8c0be7d4e1f7a9"
};

// Initialize Firebase
let app;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { app, db, storage };
