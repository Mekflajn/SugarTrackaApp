// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYeJR6HqIQNL6C-bS2NGO_r4Lf9drE-Yo",
  authDomain: "sugartrackapp.firebaseapp.com",
  projectId: "sugartrackapp",
  storageBucket: "sugartrackapp.firebasestorage.app",
  messagingSenderId: "25011344869",
  appId: "1:25011344869:web:eeb590952c7ec7dd5c4b0c"
};

const FIREBASE_APP = initializeApp(firebaseConfig);

// Inicijalizacija Auth sa perzistencijom
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const FIREBASE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_AUTH, FIREBASE_DB, firebaseConfig };

export { firebase };