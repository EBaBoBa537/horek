// Прокрутка секции awards
const scrollSection = document.querySelector('.awards-list');

scrollSection.addEventListener('wheel', function(e) {
    if (e.deltaY !== 0) {
        e.preventDefault();
        scrollSection.scrollLeft += (e.deltaY)*2.5;
    }
}, { passive: false }); // важно: passive: false, чтобы preventDefault работал