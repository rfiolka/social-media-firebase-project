// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnSQUn20Z6XUui6J8SFP6a6WHRhdxWIEw",
  authDomain: "social-media-firebase-project.firebaseapp.com",
  projectId: "social-media-firebase-project",
  storageBucket: "social-media-firebase-project.appspot.com",
  messagingSenderId: "189729434814",
  appId: "1:189729434814:web:fdf3e103f9e492fec1c2ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)             //tells firebase that there is authentication in project
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)