
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { auth } from './firebase.js'
import { showMessage } from './showMessage.js'


const salir = document.querySelector('#salir')

salir.addEventListener('click', async () => {
 await  signOut(auth)
  showMessage('Hasta Luego!')
  window.location.href = '../index.html'
})

