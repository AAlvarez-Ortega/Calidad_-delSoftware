document.addEventListener("DOMContentLoaded", () => {
  // Función para mostrar formularios
  window.mostrarFormulario = function (id) {
    const formularios = document.querySelectorAll('.formulario');
    formularios.forEach(f => f.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
    cerrarSidebarSiVisible();
  };

  // Subformulario: descarga
  window.mostrarFormularioDescarga = function (tipo) {
    const form = document.getElementById('formularioDescarga');
    if (form) {
      form.classList.remove('hidden');
      document.getElementById('tipoArchivoDescarga').value = tipo;
      document.getElementById('tipoSeleccionadoDescarga').innerText = tipo.toUpperCase();
      cerrarSidebarSiVisible();
    }
  };

  // Subformulario: eliminación
  window.mostrarFormularioEliminar = function (tipo) {
    const form = document.getElementById('formularioEliminar');
    if (form) {
      form.classList.remove('hidden');
      document.getElementById('tipoArchivoEliminar').value = tipo;
      document.getElementById('tipoSeleccionadoEliminar').innerText = tipo.toUpperCase();
      cerrarSidebarSiVisible();
    }
  };

  // Botón para desplegar menú
  const toggleBtn = document.getElementById('toggleMenu');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      document.body.classList.toggle('sidebar-open', !sidebar.classList.contains('hidden'));
    });
  }

  // Cerrar menú automáticamente en móvil
  function cerrarSidebarSiVisible() {
    if (window.innerWidth <= 768 && sidebar && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
      document.body.classList.remove('sidebar-open');
    }
  }
});
