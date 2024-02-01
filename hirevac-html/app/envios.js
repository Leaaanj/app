import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";


// Evento que se activa cuando el estado de autenticación cambia (iniciar sesión, cerrar sesión, etc.)
auth.onAuthStateChanged((usuario) => {
    // Actualiza el nombre de usuario cuando cambia el estado de autenticación
   
  });
  
  
    onAuthStateChanged(auth, (user) => {
      const perfilLink = document.querySelector('.nav-item.iniciado a[href="perfil.html"]');
      
      if (perfilLink) {
      
        if (user) {
          perfilLink.href = `perfil.html?uid=${user.uid}`;
        } else {
          perfilLink.href = 'inicio.html';
        }
      } else {
        
      }
});
  
  