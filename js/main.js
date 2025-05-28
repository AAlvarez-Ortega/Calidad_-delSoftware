import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import {
  auth,
  db
} from './firebase.js';

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('toggleMenu');
  const sidebar = document.getElementById('sidebar');
  const btnLogout = document.getElementById('btnLogout');
  const formCrearUsuario = document.getElementById('formCrearUsuario');
  const formSubirArchivo = document.getElementById('formSubirArchivo');

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

  // Crear usuario
  if (formCrearUsuario) {
    formCrearUsuario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('nuevoCorreo').value;
      const password = document.getElementById('nuevaClave').value;
      const perfil = document.getElementById('perfilUsuario').value;

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
        await setDoc(doc(db, "usuarios", uid), {
          correo: email,
          perfil: perfil,
          creado: new Date()
        });
        alert(`Usuario ${email} creado con éxito como ${perfil}`);
        formCrearUsuario.reset();
        signOut(auth); // cerrar sesión automática tras creación
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

// Subir archivo a Supabase
if (formSubirArchivo) {
  formSubirArchivo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('archivoSubir');
    const file = fileInput.files[0];
    if (!file) return alert("Selecciona un archivo primero.");

    // Sanitiza el nombre del archivo (quita acentos y caracteres especiales)
    const safeFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w.-]/g, '_');

    const { data, error } = await supabase.storage.from('archivos').upload(safeFileName, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (error) {
      alert('Error al subir archivo');
      console.error(error);
    } else {
      alert('Archivo subido con éxito');
      fileInput.value = '';
      cargarArchivos();
    }
  });
}



  // Cargar archivos disponibles para descarga y eliminación
  async function cargarArchivos() {
    const { data, error } = await supabase.storage.from('archivos').list();
    const listaDescargas = document.getElementById('listaDescargas');
    const listaEliminar = document.getElementById('listaEliminar');

    if (error) {
      console.error(error);
      return;
    }

    listaDescargas.innerHTML = '';
    listaEliminar.innerHTML = '';

    data.forEach(archivo => {
      const liDescargar = document.createElement('li');
      const a = document.createElement('a');
      a.href = `https://peihwfqfumcgxdbdshgf.supabase.co/storage/v1/object/public/archivos/${archivo.name}`;
      a.textContent = archivo.name;
      a.target = '_blank';
      liDescargar.appendChild(a);
      listaDescargas.appendChild(liDescargar);

      const liEliminar = document.createElement('li');
      liEliminar.textContent = archivo.name;
      liEliminar.style.cursor = 'pointer';
      liEliminar.addEventListener('click', async () => {
        const confirmar = confirm(`¿Deseas eliminar el archivo ${archivo.name}?`);
        if (!confirmar) return;
        const { error } = await supabase.storage.from('archivos').remove([archivo.name]);
        if (error) {
          alert('Error al eliminar archivo');
          console.error(error);
        } else {
          alert('Archivo eliminado con éxito');
          cargarArchivos();
        }
      });
      listaEliminar.appendChild(liEliminar);
    });
  }

  // Cargar archivos al entrar
  cargarArchivos();
});
