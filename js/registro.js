const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue en blanco
            
            alert('¡Registro exitoso!'); // El mensaje que saldrá en la pantalla
            
            // ABAJO PONES EL ARCHIVO O CARPETA A DONDE QUIERES QUE TE LLEVE
            window.location.href = 'index.html'; 
        });
    }