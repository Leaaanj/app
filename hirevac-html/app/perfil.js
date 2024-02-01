import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db, app } from "./firebase.js";
import { get, ref as databaseRef, getDatabase, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { actualizarNombreUsuario } from "./inicioMenu.js";

document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      actualizarNombreUsuario();
      
      // Obtener el ID del usuario autenticado
      const idUsuarioAutenticado = user.uid;
      
      // Obtener el ID del usuario del perfil actual desde la URL
      const urlParams = new URLSearchParams(window.location.search);
      const uidEnURL = urlParams.get('uid');

      // Mostrar el botón solo si el usuario autenticado coincide con el usuario del perfil actual
      if (idUsuarioAutenticado === uidEnURL) {
        document.getElementById("publicarArticulo").style.display = "block";
        
        const publicarArticuloBtn = document.getElementById("publicarArticulo");
        publicarArticuloBtn.addEventListener("click", function () {
          const href = publicarArticuloBtn.getAttribute("href");
          window.location.href = href;
        });
      } else {
        document.getElementById("publicarArticulo").style.display = "none";
      }

      // Obtener el número de teléfono del usuario desde la base de datos
      const userRef = databaseRef(getDatabase(), `usuarios/${uidEnURL}`);
      get(userRef)
        .then((snapshot) => {
          const datosUsuario = snapshot.val();
          const telefono = datosUsuario ? datosUsuario.telefono : null;

          // Mostrar el número de teléfono en el contenedor correspondiente
          const telefonoContainer = document.getElementById('telefonoContainer');
          if (telefonoContainer && telefono) {
            telefonoContainer.textContent = `Teléfono: ${telefono}`;
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario", error);
        });

    } else {
      document.getElementById("publicarArticulo").style.display = "none";
    }
  });

  document.getElementById('coverPhoto').addEventListener('click', function () {
    handleImageClick('cover');
  });

  document.getElementById('profilePhoto').addEventListener('click', function () {
    handleImageClick('profile');
  });

  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('uid');

  updateCategoriesMenu(uid);
  // Llama a la función para cargar las imágenes de perfil y portada del usuario
  fetchAndDisplayImageURLs(uid);
});


function handleImageClick(imageType) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function (e) {
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function () {
        if (imageType === 'cover') {
          document.getElementById('coverImage').src = reader.result;
        } else if (imageType === 'profile') {
          document.getElementById('profileImage').src = reader.result;
        }
        uploadImageToFirebase(imageType, file);
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

async function uploadImageToFirebase(imageType, file) {
  try {
    const storageRef = ref(getStorage(), 'fotosPerfil/' + file.name);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    console.log('URL de descarga:', downloadURL);
   
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = databaseRef(db, 'usuarios/' + userId);
      
      const updateData = {};
      updateData[imageType + 'URL'] = downloadURL;

      await update(userRef, updateData);

      console.log('Información del usuario actualizada correctamente');
    } else {
      console.error('Usuario no autenticado');
    }
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
  }
}
async function fetchAndDisplayImageURLs(userId) {
  try {
    const userRef = databaseRef(db, 'usuarios/' + userId);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    if (userData) {
      const coverImageElement = document.getElementById('coverImage');
      const profileImageElement = document.getElementById('profileImage');
      const nombreUsuarioSpan = document.getElementById('nombreUsuarioSpan');

      if (userData.coverURL) {
        const coverImageURL = await getDownloadURL(ref(getStorage(), userData.coverURL));
        coverImageElement.src = coverImageURL || '';
      } else {
        coverImageElement.src = '';
      }

      if (userData.profileURL) {
        const profileImageURL = await getDownloadURL(ref(getStorage(), userData.profileURL));
        profileImageElement.src = profileImageURL || '';
      } else {
        profileImageElement.src = '';
      }

      const nombreUsuario = userData.nombreUsuario || 'Usuario';

      // Encontrar el primer espacio en el nombre de usuario
      const primerEspacio = nombreUsuario.indexOf(' ');
      
      // Mostrar solo el texto hasta el primer espacio (o el nombre completo si no hay espacios)
      nombreUsuarioSpan.textContent = primerEspacio !== -1 ? nombreUsuario.substring(0, primerEspacio) : nombreUsuario;

      // Llama a la función para cargar los artículos del usuario
      loadUserArticles(userId);
    }
  } catch (error) {
    console.error('Error fetching image URLs:', error);
  }
}
async function loadUserArticles(userId, selectedCategory) {
  try {
    const articlesRef = databaseRef(db, 'usuarios/' + userId + '/articulos');
    const articlesSnapshot = await get(articlesRef);

    const articlesData = articlesSnapshot.val();

    if (articlesData) {
      const articlesContainer = document.getElementById('articulosUsuario');

      // Limpiar cualquier contenido existente
      articlesContainer.innerHTML = '';

      // Iterar sobre los artículos
      for (const articleId in articlesData) {
        const article = articlesData[articleId];

        if (!selectedCategory || selectedCategory === 'todas' || article.tipoArticulo === selectedCategory) {

          // Crear un contenedor para cada artículo
          const articleContainer = document.createElement('div');
          articleContainer.classList.add('article-container');
          articleContainer.style.position = 'relative';

          // Crear una imagen para el artículo
          const articleImage = document.createElement('img');
          articleImage.src = article.imagenURL;
          articleImage.alt = 'Imagen del Artículo';

          // Crear un contenedor para la información adicional
          const infoContainer = document.createElement('div');
          infoContainer.classList.add('info-container');
          infoContainer.style.position = 'absolute';
          infoContainer.style.top = '0';
          infoContainer.style.left = '0';
          infoContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          infoContainer.style.padding = '10px';

          infoContainer.style.display = 'none';
          infoContainer.innerHTML = `
            <p> ${article.titulo}</p>
          `;

          // Agregar la imagen y el contenedor de información al contenedor del artículo
          articleContainer.appendChild(articleImage);
          articleContainer.appendChild(infoContainer);

          // Agregar el contenedor del artículo al contenedor principal
          articlesContainer.appendChild(articleContainer);

          // Eventos para mostrar/ocultar la información al pasar el ratón sobre el contenedor
          articleContainer.addEventListener('mouseenter', function () {
            infoContainer.style.display = 'block';
          });

          articleContainer.addEventListener('mouseleave', function () {
            infoContainer.style.display = 'none';
          });

          // Evento de clic para redireccionar a una nueva página con la información del artículo
          articleContainer.addEventListener('click', function () {
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




async function updateCategoriesMenu(userId) {
  try {
    const userRef = databaseRef(db, 'usuarios/' + userId);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    if (userData) {
      const categoriasSelect = document.getElementById('categorias');

      // Limpiar cualquier contenido existente
      categoriasSelect.addEventListener('change', async function () {
        try {
          const selectedCategory = categoriasSelect.value;
          await loadUserArticles(userId, selectedCategory);
        } catch (error) {
          console.error('Error loading user articles:', error);
        }
      });
      


      // Obtener referencia a los artículos del usuario
      const articulosRef = databaseRef(db, 'usuarios/' + userId + '/articulos');
      const articulosSnapshot = await get(articulosRef);

      if (articulosSnapshot.exists()) {
        const articulosData = articulosSnapshot.val();

        const categoriasSet = new Set();

        // Iterar sobre los artículos y agregar sus categorías al conjunto
        for (const articuloId in articulosData) {
          const articulo = articulosData[articuloId];
          categoriasSet.add(articulo.tipoArticulo);
        }

        categoriasSet.forEach((categoria) => {
          const nuevaOpcion = document.createElement('option');
          nuevaOpcion.value = categoria;
          nuevaOpcion.textContent = categoria;
          categoriasSelect.appendChild(nuevaOpcion);
        });
      }
    }
  } catch (error) {
    console.error('Error updating user categories menu:', error);
  }
}
