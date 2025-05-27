document.addEventListener("DOMContentLoaded", () => {
  // Mostrar u ocultar formularios
  function mostrarFormulario(id) {
    const formularios = document.querySelectorAll('.formulario');
    formularios.forEach(f => f.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
  }

  // Hacer accesible globalmente
  window.mostrarFormulario = mostrarFormulario;

  // Mostrar subformulario de descarga
  window.mostrarFormularioDescarga = function (tipo) {
    const form = document.getElementById('formularioDescarga');
    if (form) {
      form.classList.remove('hidden');
      document.getElementById('tipoArchivoDescarga').value = tipo;
      document.getElementById('tipoSeleccionadoDescarga').innerText = tipo.toUpperCase();
    }
  };

  // Mostrar subformulario de eliminación
  window.mostrarFormularioEliminar = function (tipo) {
    const form = document.getElementById('formularioEliminar');
    if (form) {
      form.classList.remove('hidden');
      document.getElementById('tipoArchivoEliminar').value = tipo;
      document.getElementById('tipoSeleccionadoEliminar').innerText = tipo.toUpperCase();
    }
  };

  // Lógica del botón de menú
  const toggleBtn = document.getElementById('toggleMenu');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
    });
  }
});
