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

  // Detectar perfil y ocultar formularios si no es admin
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const userDoc = await getDoc(doc(db, "usuarios", uid));
      if (userDoc.exists()) {
        const perfil = userDoc.data().perfil;
        document.getElementById('userInfo').textContent = `Perfil: ${perfil}`;

        if (perfil !== 'admin') {
          const adminForms = ['agregar', 'eliminar'];
          adminForms.forEach(id => {
            const form = document.getElementById(id);
            const icon = document.querySelector(`img[title*="${form?.querySelector('h2')?.innerText?.trim()}"]`);
            if (form) form.remove();
            if (icon) icon.remove();
          });
        }
      }
    } else {
      window.location.href = 'index.html';
    }
  });

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
        if (error.code === 'auth/email-already-in-use') {
          alert('Este correo ya está registrado.');
        } else {
          alert("Error al crear usuario.");
        }
        console.error(error.code, error.message);
      }
    });
  }
});

