import { db, auth } from './firebase.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
document.addEventListener('DOMContentLoaded', function () {
  // Verificar si hay un usuario autenticado
  auth.onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;

      // Resto del código para obtener los detalles del artículo
      const urlParams = new URLSearchParams(window.location.search);
      const articuloId = urlParams.get('articuloId');

      // Referencia al artículo dentro del nodo del usuario
      const articuloRef = ref(db, `usuarios/${userId}/articulos/${articuloId}`);
      const usuarioRef = ref(db, `usuarios/${userId}`);

      // Obtener los detalles del artículo desde Firebase Realtime Database
      Promise.all([get(articuloRef), get(usuarioRef)]).then((results) => {
        const articuloSnapshot = results[0];
        const usuarioSnapshot = results[1];

        const articulo = articuloSnapshot.val();
        const usuario = usuarioSnapshot.val();

        // Mostrar los detalles del artículo en el contenedor
        const detalleArticuloContainer = document.getElementById('detalleArticuloContainer');
        if (detalleArticuloContainer && articulo && usuario) {
          // Construir la estructura HTML con los detalles del producto
          const html = `
            <h2 class="att">${articulo.titulo}</h2>
            <p class="at">$${articulo.precio}</p>
            <img src="${articulo.imagenURL}" class="imgDa" alt="Cover Image">
            <p class="attt">Detalles: ${articulo.detallesArticulo}</p>
           
            <p class="att" >Telefono: ${usuario.telefono} </p>
            
            <!-- Agregar más detalles según tu estructura de datos -->
            
          `;

          // Insertar el HTML en el contenedor
          detalleArticuloContainer.innerHTML = html;
        } else {
          console.error('El artículo no fue encontrado o usuario no encontrado.');
        }
      }).catch((error) => {
        console.error('Error al obtener los detalles del artículo:', error);
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  });
});
