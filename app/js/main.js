

import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import {loginChek} from '../app/inicioCheck.js'
import {auth} from '../app/firebase.js'
import '../app/salir.js'
import '../app/inicioForm.js'
import '../app/googleLogin.js'
import '../app/registroForm.js'
onAuthStateChanged(auth, async (user) =>{
if(user){
    loginChek(user)
}else{
    loginChek(user)
}


})