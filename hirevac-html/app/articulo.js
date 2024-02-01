import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getDatabase, ref as databaseRef, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { auth } from "./firebase.js";

function mostrarImagen() {
    const inputFoto = document.getElementById("fotoArticulo");
    const vistaPrevia = document.getElementById("vistaPrevia");

    // Limpia la vista previa anterior
    vistaPrevia.innerHTML = "";

    // Lee la imagen seleccionada
    const archivos = inputFoto.files;
    if (archivos && archivos.length > 0) {
        const imagen = archivos[0];

        // Crea un objeto URL para la imagen
        const urlImagen = URL.createObjectURL(imagen);

        // Crea un elemento de imagen y establece el src
        const imgElemento = document.createElement("img");
        imgElemento.src = urlImagen;
        imgElemento.classList.add("img-fluid");

        // Agrega la imagen a la vista previa
        vistaPrevia.appendChild(imgElemento);
    }
}
async function subirImagenAFirebaseStorage() {
    const inputFoto = document.getElementById("fotoArticulo");
    const archivos = inputFoto.files;

    if (archivos && archivos.length > 0) {
        const imagen = archivos[0];
        
        try {
               // Subir la foto a Firebase Storage
            const storage = getStorage(); // Asegúrate de obtener la instancia de almacenamiento
            const storageRef = ref(storage, `fotosArticulo/${imagen.name}`);
            await uploadBytes(storageRef, imagen);

            // Obtener la URL de descarga de la foto
            const downloadURL = await getDownloadURL(storageRef);
            console.log("URL de descarga:", downloadURL);
 
             // Obtener los valores de los campos del formulario
             const titulo = document.getElementById("tituloArticulo").value;
             const precio = document.getElementById("precioArticulo").value;
             const tipoArticulo = document.getElementById("tipoArticulo").value;
             const detallesArticulo = document.getElementById("detallesArticulo").value;
 
             // Guardar los valores en la base de datos
             const database = getDatabase();
             const articulosRef = databaseRef(database, 'articulos');
             const nuevoArticuloRef = push(articulosRef);
             // Guarda los datos del artículo en la base de datos
             set(nuevoArticuloRef, {
                titulo,
                precio,
                tipoArticulo,
                detallesArticulo,
                imagenURL: downloadURL
            });
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const usuariosRef = databaseRef(database, 'usuarios/' + userId + '/articulos');
                const nuevoArticuloUsuarioRef = push(usuariosRef);
                set(nuevoArticuloUsuarioRef, {
                    titulo,
                    precio,
                    tipoArticulo,
                    detallesArticulo,
                    imagenURL: downloadURL
                });
                 // Espera 2 segundos (puedes ajustar este valor según tus necesidades)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirige al usuario a otro HTML
           
        
            
            window.location.href = `perfil.html?uid=${userId}`;
        
               
            }
           
        } catch (error) {
            console.error("Error al subir la foto:", error);
        }
    } else {
        console.warn("No se seleccionó ninguna foto");
    }
}


// Llama a la función subirImagenAFirebaseStorage cuando sea necesario, por ejemplo, al hacer clic en un botón
document.getElementById("subirFoto").addEventListener("click", subirImagenAFirebaseStorage);
document.getElementById("fotoArticulo").addEventListener("change", mostrarImagen);
