
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

import { showMessage } from './showMessage.js'
// Importa el módulo de la base de datos
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { app, auth } from './firebase.js'; // Asegúrate de importar 'app' y 'auth' desde tu archivo firebase.js

const database = getDatabase(app);

const registroForm = document.querySelector('#registro-form');
registroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = registroForm['registro-email'].value;
  const contraseña = registroForm['registro-contraseña'].value;
  const nombreUsuario = registroForm['nombre-usuario'].value;
  const nombreNegocio = registroForm['nombre-negocio'].value;
  const coverURL = "gs://webapp-8ecad.appspot.com/blanco.png";
  const profileURL = "gs://webapp-8ecad.appspot.com/negro.png";
  const contacto = registroForm['contacto'].value
  try {
    // Registrar el usuario con Firebase
    const userCredentials = await createUserWithEmailAndPassword(auth, email, contraseña);
    
    // Almacenar el nombre de usuario en la base de datos
    await set(ref(database, `usuarios/${userCredentials.user.uid}`), {
      nombreUsuario: nombreUsuario,
      nombreNegocio: nombreNegocio,
      email: email,
      coverURL: coverURL,
      profileURL: profileURL,
      telefono: contacto
      // Puedes agregar más campos según tus necesidades
    });

    console.log(userCredentials);
    $('#modalregistro').modal('hide');
    window.location.href = '../inicioMenu.html';
    showMessage("Bienvenido " + userCredentials.user.email);
  } catch (error) {
    console.error(error);
    console.error(error.code);

    // Manejar diferentes códigos de error según sea necesario
    if (error.code === 'auth/invalid-email') {
      showMessage("Email inválido", "error");
    } else if (error.code === 'auth/weak-password') {
      showMessage("La contraseña es demasiado débil", "error");
    } else if (error.code === 'auth/email-already-in-use') {
      showMessage("El Email ya está registrado", "error");
    } else {
      showMessage("Algo salió mal", "error");
    }
  }
});

  const passwordInput = document.getElementById('registro-contraseña');
  const togglePasswordButton = document.getElementById('toggle-password');

  togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
  });
