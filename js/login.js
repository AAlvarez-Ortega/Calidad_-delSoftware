import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('usuario').value;
    const password = document.getElementById('contrasena').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem('usuario', user.email); // opcional
      window.location.href = 'main.html';
    } catch (error) {
      alert("Correo o contraseña incorrectos.");
      console.error("Firebase auth error:", error);
    }
  });
});
