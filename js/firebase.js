
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBeX3lbKvNlx6JXZWFmg1Dw091DV2Qg7go",
    authDomain: "calidad-del-software-fcd98.firebaseapp.com",
    projectId: "calidad-del-software-fcd98",
    storageBucket: "calidad-del-software-fcd98.firebasestorage.app",
    messagingSenderId: "808993979877",
    appId: "1:808993979877:web:3ab418caf2e7e8bc21030c",
    measurementId: "G-08S65YPHTH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
