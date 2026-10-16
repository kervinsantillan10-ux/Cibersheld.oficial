document.addEventListener("DOMContentLoaded", function() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    // Verifica si hay sesión iniciada
    const isLogged = localStorage.getItem('cs_username');

    if (isLogged) {
        // Inyecta los enlaces limpios; el CSS se encargará de darles el estilo y el hover
        authContainer.innerHTML = `
            <li><a href="usuario.html">MI PERFIL</a></li>
            <li><a href="#" onclick="cerrarSesion()">CERRAR SESIÓN</a></li>
        `;
    }
});

function cerrarSesion() {
    localStorage.removeItem('cs_username');
    localStorage.removeItem('cs_userphoto');
    window.location.reload(); 
}