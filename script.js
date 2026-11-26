document.documentElement.classList.remove('no-js');

const header = document.querySelector('#header');
const menuButton = document.querySelector('#menu-button');
const navLinks = document.querySelector('#nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');

function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuButton.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
}

menuButton.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navAnchors.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);

    let current = '';
    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 160) current = section.id;
    });
    navAnchors.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // também mostra o que já ficou para trás (ex.: quando o usuário pula direto por um link do menu)
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((el) => observer.observe(el));
} else {
    revealItems.forEach((el) => el.classList.add('visible'));
}

/* ---------- Animações de rolagem nas imagens ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    document.documentElement.classList.add('motion');

    // Imagens entram com um efeito de "abertura" ao aparecer na tela
    const shots = document.querySelectorAll('.project-shot, .photo-frame');
    if ('IntersectionObserver' in window) {
        const shotObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio >= 0.2 || entry.boundingClientRect.top < 0) {
                    entry.target.classList.add('in');
                    shotObserver.unobserve(entry.target);
                }
            });
        }, { threshold: [0, 0.2] });
        shots.forEach((el) => shotObserver.observe(el));
    } else {
        shots.forEach((el) => el.classList.add('in'));
    }

    // Parallax: as imagens se movem em velocidade diferente da página ao rolar
    const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
    let ticking = false;

    function updateParallax() {
        const vh = window.innerHeight;
        parallaxItems.forEach((el) => {
            const box = (el.hasAttribute('data-noscale') ? el : el.parentElement).getBoundingClientRect();
            if (box.bottom < -200 || box.top > vh + 200) return;

            // progresso: 1 = entrando por baixo, 0 = centro da tela, -1 = saindo por cima
            const progress = Math.max(-1, Math.min(1, (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2)));
            const speed = parseFloat(el.dataset.parallax) || 0;

            el.style.setProperty('--py', `${(progress * speed).toFixed(1)}px`);
            if (!el.hasAttribute('data-noscale')) {
                // começa com zoom e "assenta" quando chega ao centro
                el.style.setProperty('--ps', (1.06 + Math.abs(progress) * 0.04).toFixed(3));
            }
        });
        ticking = false;
    }

    function requestParallax() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
    updateParallax();
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
