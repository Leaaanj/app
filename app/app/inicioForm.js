
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { auth } from './firebase.js'
import { showMessage } from './showMessage.js'

const inicioForm = document.querySelector('#inicio-form');

inicioForm.addEventListener('submit', async e => {
    e.preventDefault()
        const email = inicioForm['inicio-email'].value;
        const contraseña = inicioForm['inicio-contraseña'].value;
        
    try {
        const credentials = await signInWithEmailAndPassword(auth, email, contraseña)
        console.log(credentials)
        $('#modalinicio').modal('hide')
        window.location.href = '../inicioMenu.html'
        console.log("Usuario inició sesión:", credentials.user);
    } catch (error) {
        console.log(error)
        console.log(error.code)

        if (error.code === "auth/invalid-credential"){
            showMessage('Email o Contraseña incorrecta', 'error')
        }
    }
})
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('inicio-contraseña');
    const togglePasswordButton = document.getElementById('toggle-password2');
  
    togglePasswordButton.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });
  });

