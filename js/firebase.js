import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB...tu_clave...",
  authDomain: "calidad-del-software-fcd98.firebaseapp.com",
  projectId: "calidad-del-software-fcd98",
  storageBucket: "calidad-del-software-fcd98.appspot.com",
  messagingSenderId: "880993979877",
  appId: "1:880993979877:web:3ab418caf2e7e8bc21030c",
  measurementId: "G-0856SYPHTH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
