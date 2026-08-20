const menuButton = document.querySelector('#menu-icon');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');

menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuButton.setAttribute('aria-expanded', isOpen);
    menuButton.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 170;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    navAnchors.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
});

const year = document.querySelector('#year');
if (year) {
    year.textContent = new Date().getFullYear();
}
