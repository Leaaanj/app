import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { app, auth } from './firebase.js';

const database = getDatabase(app);
const resultadosBusqueda = document.getElementById('resultadosBusqueda');
let infoUsuarioActual; // Almacena la información del usuario actual

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');

  // Verifica si los elementos existen antes de agregar listeners
  if (searchInput && resultadosBusqueda) {
    // Agrega un listener al input para mostrar/ocultar la lista al escribir en él
    searchInput.addEventListener('input', function () {
      buscarUsuarios();
    });

    // Cierra la lista si se hace clic fuera del área de búsqueda
    document.addEventListener('click', function (event) {
      if (!searchInput.contains(event.target) && !resultadosBusqueda.contains(event.target)) {
        ocultarResultados();
      }
    });
  } else {
    console.error('Elementos no encontrados en el DOM.');
  }
});

async function buscarUsuarios() {
  const searchInputValue = searchInput.value.toLowerCase();
  resultadosBusqueda.innerHTML = ''; // Limpia los resultados anteriores

  // Almacena la información del usuario actual antes de la búsqueda
  infoUsuarioActual = await obtenerInfoUsuarioActual();

  if (searchInputValue.length >= 1) {
    const usuariosRef = ref(database, 'usuarios');
    onValue(usuariosRef, (snapshot) => {
      const usuarios = snapshot.val();

      if (usuarios) {
        Object.keys(usuarios).forEach((key) => {
          const usuario = usuarios[key];
          // Comprueba si el nombre de usuario coincide con la búsqueda
          if (usuario.nombreUsuario.toLowerCase().includes(searchInputValue)) {
            // Agrega el resultado a la interfaz
            const resultadoElemento = document.createElement('div');
            const enlacePerfil = document.createElement('a');
            enlacePerfil.textContent = `${usuario.nombreUsuario || 'N/A'}`;
            enlacePerfil.href = `/perfil.html?uid=${key}`; // Agrega el UID al enlace
            resultadoElemento.appendChild(enlacePerfil);
            resultadosBusqueda.appendChild(resultadoElemento);
          }
        });
      } else {
        resultadosBusqueda.textContent = 'No se encontraron resultados';
      }

      // Muestra la lista de resultados
      resultadosBusqueda.style.display = 'block';
    });
  } else {
    // Restaura la información del usuario actual si la búsqueda está vacía
    resultadosBusqueda.style.display = 'none';
    restaurarInfoUsuarioActual();
  }
}

function obtenerInfoUsuarioActual() {
  // Obtiene la información del usuario actual de Firebase Auth o de donde sea necesario
  const usuarioActual = auth.currentUser;
  if (usuarioActual) {
    return {
      nombreUsuario: usuarioActual.displayName || 'N/A',
      // Agrega más información si es necesario
    };
  } else {
    return null;
  }
}

function restaurarInfoUsuarioActual() {
  // Restaura la información del usuario actual después de la búsqueda
  if (infoUsuarioActual) {
    const resultadoElemento = document.createElement('div');
    const enlacePerfil = document.createElement('a');
    enlacePerfil.textContent = `${infoUsuarioActual.nombreUsuario || 'N/A'}`;
    enlacePerfil.href = `/perfil.html?uid=${auth.currentUser.uid}`;
    resultadoElemento.appendChild(enlacePerfil);
    resultadosBusqueda.appendChild(resultadoElemento);
  }
}

function ocultarResultados() {
  resultadosBusqueda.style.display = 'none';
}
