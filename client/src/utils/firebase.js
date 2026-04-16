
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
authDomain: "exam-notes-ai-8281d.firebaseapp.com",
  projectId: "exam-notes-ai-8281d",
  storageBucket: "exam-notes-ai-8281d.firebasestorage.app",
  messagingSenderId: "910021514838",
  appId: "1:910021514838:web:5cbf3ab245b504311c8df7"
 };


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}