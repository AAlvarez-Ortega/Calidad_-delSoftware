import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import {
  auth,
  db,
  firebaseConfig
} from './firebase.js';

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('toggleMenu');
  const sidebar = document.getElementById('sidebar');
  const btnLogout = document.getElementById('btnLogout');
  const formCrearUsuario = document.getElementById('formCrearUsuario');

  // Mostrar formularios
  window.mostrarFormulario = function (id) {
    const formularios = document.querySelectorAll('.formulario');
    formularios.forEach(f => f.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
    cerrarSidebarSiVisible();
  };

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      document.body.classList.toggle('sidebar-open', !sidebar.classList.contains('hidden'));
    });
  }

  function cerrarSidebarSiVisible() {
    if (window.innerWidth <= 768 && sidebar && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
      document.body.classList.remove('sidebar-open');
    }
  }

  // Validar perfil
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docSnap = await getDoc(doc(db, "usuarios", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("userInfo").textContent = `${data.correo} (${data.perfil})`;

        if (data.perfil !== "admin") {
          document.getElementById("agregar").style.display = "none";
          document.getElementById("eliminar").style.display = "none";
        }
      } else {
        alert("No se encontró el perfil del usuario.");
      }
    } else {
      window.location.href = "index.html";
    }
  });

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      signOut(auth).then(() => {
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
      }).catch((error) => {
        alert('Error al cerrar sesión.');
        console.error(error);
      });
    });
  }

  // Crear usuario sin cerrar sesión del admin
  if (formCrearUsuario) {
    formCrearUsuario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('nuevoCorreo').value;
      const password = document.getElementById('nuevaClave').value;
      const perfil = document.getElementById('perfilUsuario').value;

      try {
        // Crear app secundaria
        const secondaryApp = initializeApp(firebaseConfig, "Secondary");
        const secondaryAuth = getAuth(secondaryApp);

        const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const uid = cred.user.uid;

        await setDoc(doc(db, "usuarios", uid), {
          correo: email,
          perfil: perfil,
          creado: new Date()
        });

        alert(`Usuario ${email} creado con éxito como ${perfil}`);

        await signOut(secondaryAuth);
        formCrearUsuario.reset();
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("El correo ya está registrado.");
        } else {
          alert("Error al crear usuario.");
        }
        console.error(error.code, error.message);
      }
    });
  }
});
