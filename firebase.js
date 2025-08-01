// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDamYi0EG45_ITmW_fuUcqZLQEnZ33fZgQ",
  authDomain: "moodboard-ej45.firebaseapp.com",
  projectId: "moodboard-ej45",
  storageBucket: "moodboard-ej45.firebasestorage.app",
  messagingSenderId: "656854799054",
  appId: "1:656854799054:web:cd2d6012e65979a6cdf69f",
  measurementId: "G-SQ80MRCELC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);