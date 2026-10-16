document.addEventListener("DOMContentLoaded", () => {
    console.log("CiberShield - Efectos visuales inicializados.");

    // Efectos hover para las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 15px 35px rgba(255, 222, 89, 0.5)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });

    // Efectos de foco para los campos de texto
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#FFDE59';
            input.style.boxShadow = '0 0 10px rgba(255, 222, 89, 0.4)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
    });
});