import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import {
  auth,
  db,
  doc,
  setDoc,
   getDoc
} from './firebase.js';

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const perfil = docSnap.data().perfil;

      // Mostrar correo en la interfaz
      document.getElementById('userInfo').textContent = `Perfil: ${perfil}`;

      if (perfil !== 'admin') {
        // Ocultar formularios que no son para usuarios normales
        document.getElementById('agregar').remove();
        document.getElementById('eliminar').remove();
        document.querySelector('img[title="Agregar Usuario"]').remove();
        document.querySelector('img[title="Eliminar Usuario"]').remove();
      }

    } else {
      alert("No se encontró información de perfil.");
    }
  } else {
    window.location.href = 'index.html'; // Redirigir si no hay sesión
  }
});

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

  window.mostrarFormularioDescarga = function (tipo) {
    const form = document.getElementById('formularioDescarga');
    if (form) {
      form.classList.remove('hidden');
      document.getElementById('tipoArchivoDescarga').value = tipo;
      document.getElementById('tipoSeleccionadoDescarga').innerText = tipo.toUpperCase();
      cerrarSidebarSiVisible();
    }
  };

  window.mostrarFormularioEliminar = function (tipo) {
    const form = document.getElementById('formularioEliminar');
    if (form) {
      form.classList.remove('hidden');
      document.getElementById('tipoArchivoEliminar').value = tipo;
      document.getElementById('tipoSeleccionadoEliminar').innerText = tipo.toUpperCase();
      cerrarSidebarSiVisible();
    }
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

  // 🔐 Logout
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

  // 👤 Crear usuario y guardar perfil en Firestore
  if (formCrearUsuario) {
    formCrearUsuario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('nuevoCorreo').value;
      const password = document.getElementById('nuevaClave').value;
      const perfil = document.getElementById('perfilUsuario').value;

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        // Guardar perfil en Firestore
        await setDoc(doc(db, "usuarios", uid), {
          correo: email,
          perfil: perfil,
          creado: new Date()
        });

        alert(`Usuario ${email} creado con éxito como ${perfil}`);
        formCrearUsuario.reset();
      } catch (error) {
        alert("Error al crear usuario.");
        console.error(error.code, error.message);
      }
    });
  }
});

