import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

 // Obtener una referencia a la base de datos y almacenamiento de Firebase
 const database = getDatabase();
 const storage = getStorage();

 // Obtener referencia a la sección de videos en el HTML
 const videosContainer = document.getElementById("videosContainer");

 // Escuchar cambios en la base de datos para obtener los artículos
 const articulosRef = databaseRef(database, 'articulos');
 onValue(articulosRef, (snapshot) => {
   const articulos = snapshot.val();


   // Iterar sobre los artículos y agregar elementos al HTML
   for (const key in articulos) {
     if (articulos.hasOwnProperty(key)) {
       const articulo = articulos[key];

       // Crear elemento de video
       const video = document.createElement("div");
       video.classList.add("video");

       // Crear elemento de imagen
       const thumbnail = document.createElement("div");
       thumbnail.classList.add("video__thumbnail");

       const img = document.createElement("img");
       img.alt = articulo.titulo;
       // Obtener URL de descarga de Firebase Storage

                              // console.log("Articulo:", articulo);
       const storageRef = ref(storage, articulo.imagenURL);
                            // console.log("Storage Ref:", storageRef);
       getDownloadURL(storageRef)
         .then((url) => {
                             // console.log("Image URL:", url);
           img.src = url;
         })
         .catch((error) => {
           console.error("Error al obtener URL de descarga:", error);
         });
       


       const details = document.createElement("div");
       details.classList.add("video__details");

       // Crear elemento de título
       const title = document.createElement("div");
       title.classList.add("title");
       title.innerHTML = `<h3>${articulo.titulo}</h3>`;
       
       details.appendChild(title);
       
       const precio = document.createElement("div");
       precio.classList.add("precio");
       precio.innerHTML = `<h5>${articulo.precio}</h5>`;


       // Agregar título al elemento de detalles
      
      

       // Agregar elementos de imagen y detalles al elemento de video
       thumbnail.appendChild(img);
       video.appendChild(thumbnail);
       video.appendChild(details);
       video.appendChild(precio);

       // Agregar elemento de video al contenedor
       if (videosContainer) {
        // Tu código para agregar elementos al contenedor aquí
        videosContainer.appendChild(video);

      } else {
        
      }
   }
}
 });

 

// Función para actualizar el nombre de usuario en el área de navegación
export function actualizarNombreUsuario() {
  const nombreUsuarioSpan = document.getElementById("nombreUsuarioSpan");

  // Verifica si el usuario está autenticado
  const usuario = auth.currentUser;
  if (usuario) {
    let nombreCompleto = usuario.displayName || usuario.email || "nombreUsuario";

    // Utiliza el nombre de usuario antes del primer espacio o "@" en el correo electrónico
    const indiceEspacio = nombreCompleto.indexOf(' ');
    const indiceArroba = nombreCompleto.indexOf('@');
    const indiceSeparador = Math.min(indiceEspacio !== -1 ? indiceEspacio : Infinity, indiceArroba !== -1 ? indiceArroba : Infinity);

    if (indiceSeparador !== -1) {
      nombreCompleto = nombreCompleto.substring(0, indiceSeparador);
    }

    // Actualiza el nombre de usuario
    nombreUsuarioSpan.textContent = nombreCompleto;
  } else {
    nombreUsuarioSpan.textContent = "";
  }
}


auth.onAuthStateChanged((usuario) => {
  // Actualiza el nombre de usuario cuando cambia el estado de autenticación
  actualizarNombreUsuario();
});


  onAuthStateChanged(auth, (user) => {
    const perfilLink = document.querySelector('.nav-item.iniciado a[href="perfil.html"]');
    
    if (perfilLink) {
    
      if (user) {
        perfilLink.href = `perfil.html?uid=${user.uid}`;
      } else {
        perfilLink.href = 'index.html';
      }
    } else {
      
    }
  });

  async function loadUserArticles(userId, selectedCategory) {
    try {
      const articlesRef = databaseRef(db, 'usuarios/' + userId + '/articulos');
      const articlesSnapshot = await get(articlesRef);
  
      const articlesData = articlesSnapshot.val();
  
      if (articlesData) {
        const video = document.getElementById('video');
  
        // Limpiar cualquier contenido existente
        articlesContainer.innerHTML = '';
  
        // Iterar sobre los artículos
        for (const articleId in articlesData) {
          const article = articlesData[articleId];
  
          if (!selectedCategory || selectedCategory === 'todas' || article.tipoArticulo === selectedCategory) {
  
  
            // Evento de clic para redireccionar a una nueva página con la información del artículo
            video.addEventListener('click', function () {
              // Puedes ajustar la URL y los parámetros según tus necesidades
              window.location.href = `detalleArticulo.html?articuloId=${articleId}`;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading user articles:', error);
    }
  }