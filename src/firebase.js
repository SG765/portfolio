// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import  {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: "portfolio-af38c.firebaseapp.com",
  projectId: "portfolio-af38c",
  storageBucket: "portfolio-af38c.appspot.com",
  messagingSenderId: "335839383554",
  appId: "1:335839383554:web:13cd84f2749f7b49e7171b",
  measurementId: "G-0BNXPSRK9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore(app)