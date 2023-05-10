const arrows = document.querySelectorAll('.arrow');

arrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
        const currentSection = arrow.closest('.section');
        const nextSection = currentSection.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

$.scrollify({
  section: '.section',
  scrollSpeed: 1100,
  easing: 'easeOutExpo',
});
