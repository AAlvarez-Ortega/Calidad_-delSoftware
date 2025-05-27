import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js"; // ✅

const firebaseConfig = {
  apiKey: "AIzaSyBeX3lbKvNlx6JXZWFmg1Dw091DV2Qg7go",
  authDomain: "calidad-del-software-fcd98.firebaseapp.com",
  projectId: "calidad-del-software-fcd98",
  storageBucket: "calidad-del-software-fcd98.appspot.com",
  messagingSenderId: "808993979877",
  appId: "1:808993979877:web:3ab418caf2e7e8bc21030c",
  measurementId: "G-08S65YPHTH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // ✅

export { app, auth, db, doc, setDoc, getDoc }; // ✅
