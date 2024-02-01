
const loggedOutLinks = document.querySelectorAll('.salir')
const loggedInLinks = document.querySelectorAll('.iniciado')

export const loginChek = user => {
    if(user){
        loggedInLinks.forEach(link => link.style.display = 'block')
        loggedOutLinks.forEach(link => link.style.display = 'none')
        
        
    }else{
        loggedInLinks.forEach(link => link.style.display = 'none')
        loggedOutLinks.forEach(link => link.style.display = 'block')
 
    }
}
