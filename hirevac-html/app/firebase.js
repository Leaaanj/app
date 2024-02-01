
    // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"; // Asegúrate de importar el módulo correcto para Realtime Database
 // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyAH2-AbZtvfDtZGkg8k7dDFhJV4c24cNqU",
      authDomain: "webapp-8ecad.firebaseapp.com",
      databaseURL: "https://webapp-8ecad-default-rtdb.firebaseio.com",
      projectId: "webapp-8ecad",
      storageBucket: "webapp-8ecad.appspot.com",
      messagingSenderId: "404769827230",
      appId: "1:404769827230:web:49bb85b8fd8d6544af8e8f",
      measurementId: "G-HJ2Y45VJVC"
    };
  
    // Initialize Firebase
   export const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const auth = getAuth(app);
  
  export const storage = getStorage(app);
  export const db = getDatabase(app);
  

