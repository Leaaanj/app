

import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { auth } from './firebase.js'
import { showMessage } from './showMessage.js'


const googleButtons = document.querySelectorAll('#googleLogin');

googleButtons.forEach((googleButton) => {
  googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();

    try {
      const credentials = await signInWithPopup(auth, provider);
      console.log(credentials);
      // Assuming the modal is a parent of the button
      $('#modalinicio').modal('hide')
      window.location.href = '../inicioMenu.html'
      showMessage('Bienvenido ' + credentials.user.displayName, 'success');
     
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  });
});