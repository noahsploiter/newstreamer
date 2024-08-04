// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZSP0rECq7mRNvHiGlAGfQVd5w8VBqw4s",
  authDomain: "videos-b9e81.firebaseapp.com",
  projectId: "videos-b9e81",
  storageBucket: "videos-b9e81.appspot.com",
  messagingSenderId: "363531166325",
  appId: "1:363531166325:web:d8a188219746f682db0e3c",
  measurementId: "G-LP56E5ZW7P",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
