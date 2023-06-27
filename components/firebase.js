// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: "AIzaSyCNL-wMHF6HlKTJzeB3EECYfHpPaQ6QVvo",
//   authDomain: "prokemia-file-upload.firebaseapp.com",
//   projectId: "prokemia-file-upload",
//   storageBucket: "prokemia-file-upload.appspot.com",
//   messagingSenderId: "1079835605633",
//   appId: "1:1079835605633:web:7f76b78360b0b91c8a2b80",
//   measurementId: "G-YTMHNXDY5Q"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDIcyZW4NTpP-bM3CBRAJjtBVY8Aw_UBdY",
  authDomain: "prokemia-file-upload-b636f.firebaseapp.com",
  projectId: "prokemia-file-upload-b636f",
  storageBucket: "prokemia-file-upload-b636f.appspot.com",
  messagingSenderId: "278536712651",
  appId: "1:278536712651:web:e578bb429ab160e288464e",
  measurementId: "G-HRLG03JNGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
//const analytics = getAnalytics(app);