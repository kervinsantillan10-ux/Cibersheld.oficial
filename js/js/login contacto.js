const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          alert('¡Mensaje enviado con éxito!');
          form.reset();
        });
}
