// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-4477209579-d0721",
  "appId": "1:785901241499:web:29ea71fd2ea6b9c5eeb23e",
  "apiKey": "AIzaSyB5u8vPgJ6NugbE2O2mmmNBstcb6axq37M",
  "authDomain": "studio-4477209579-d0721.firebaseapp.com",
  "measurementId": "G-5G3W9Q1H0D",
  "messagingSenderId": "785901241499",
  "storageBucket": "studio-4477209579-d0721.appspot.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, db, storage };
