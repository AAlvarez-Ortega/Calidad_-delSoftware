import { auth, signInWithEmailAndPassword } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('usuario').value;
    const password = document.getElementById('contrasena').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Usuario autenticado correctamente
        const user = userCredential.user;
        localStorage.setItem('usuario', user.email); // Guardamos el email (puedes guardar más si quieres)
        window.location.href = 'main.html'; // Redirige al menú principal
      })
      .catch((error) => {
        alert("Correo o contraseña incorrectos.");
        console.error(error);
      });
  });
});
