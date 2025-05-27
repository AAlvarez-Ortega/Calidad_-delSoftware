// main.js
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

import { auth, db, app } from "./firebase.js";

const storage = getStorage(app);

let userProfile = null;

function cerrarSidebarSiVisible() {
  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth <= 768 && sidebar && !sidebar.classList.contains("hidden")) {
    sidebar.classList.add("hidden");
    document.body.classList.remove("sidebar-open");
  }
}

function mostrarFormulario(id) {
  document.querySelectorAll(".formulario").forEach((f) => f.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
  cerrarSidebarSiVisible();
}

window.mostrarFormulario = mostrarFormulario;

// Subir archivo
const formSubir = document.getElementById("formSubirArchivo");
formSubir?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("archivoSubir").files[0];
  if (!file) return alert("Selecciona un archivo");

  const storageRef = ref(storage, `archivos/${file.name}`);
  await uploadBytes(storageRef, file);
  alert("Archivo subido exitosamente");
  formSubir.reset();
});

// Listar archivos por tipo
const filtros = document.querySelectorAll(".filtro-descarga");
filtros.forEach((icono) => {
  icono.addEventListener("click", async () => {
    const tipo = icono.dataset.tipo;
    const lista = document.getElementById("listaDescargas");
    lista.innerHTML = "Cargando...";
    const folderRef = ref(storage, "archivos");
    const res = await listAll(folderRef);
    lista.innerHTML = "";

    res.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const name = itemRef.name;
      if (tipo === "todos" || name.endsWith(tipo)) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
        lista.appendChild(li);
      }
    });
  });
});

// Eliminar archivos
const filtrosEliminar = document.querySelectorAll(".filtro-eliminar");
filtrosEliminar.forEach((icono) => {
  icono.addEventListener("click", async () => {
    const tipo = icono.dataset.tipo;
    const lista = document.getElementById("listaEliminar");
    lista.innerHTML = "Cargando...";
    const folderRef = ref(storage, "archivos");
    const res = await listAll(folderRef);
    lista.innerHTML = "";

    res.items.forEach(async (itemRef) => {
      const name = itemRef.name;
      if (tipo === "todos" || name.endsWith(tipo)) {
        const li = document.createElement("li");
        li.innerHTML = `${name} <button data-path="${itemRef.fullPath}">Eliminar</button>`;
        lista.appendChild(li);
      }
    });
  });
});

document.getElementById("listaEliminar")?.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const path = e.target.dataset.path;
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    alert("Archivo eliminado");
    e.target.parentElement.remove();
  }
});

// Crear usuario
const formCrearUsuario = document.getElementById("formCrearUsuario");
formCrearUsuario?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!userProfile || userProfile.perfil !== "admin") return alert("No tienes permisos para crear usuarios");

  const email = document.getElementById("nuevoCorreo").value;
  const password = document.getElementById("nuevaClave").value;
  const perfil = document.getElementById("perfilUsuario").value;

  const secondaryApp = initializeApp(app.options, "Secundaria");
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await setDoc(doc(getFirestore(secondaryApp), "usuarios", cred.user.uid), {
      correo: email,
      perfil,
      creado: new Date()
    });
    alert("Usuario creado correctamente");
  } catch (err) {
    console.error(err);
    alert("Error al crear usuario");
  } finally {
    await signOut(secondaryAuth);
  }
});

// Logout
const btnLogout = document.getElementById("btnLogout");
btnLogout?.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });
});

// Validar acceso
onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "index.html");
  const snap = await getDoc(doc(db, "usuarios", user.uid));
  if (snap.exists()) {
    userProfile = snap.data();
    document.getElementById("userInfo").textContent = `${userProfile.correo} (${userProfile.perfil})`;
    if (userProfile.perfil !== "admin") {
      document.getElementById("agregar")?.remove();
      document.getElementById("eliminar")?.remove();
    }
  }
});
