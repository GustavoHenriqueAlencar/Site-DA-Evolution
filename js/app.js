// Header Background Change on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('#header');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.querySelector('body');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });
}

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenu && navLinks) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
            }

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// Scrollspy: destaca no menu a seção visível
(function () {
    const links = document.querySelectorAll('.nav-link');
    const sections = ['home', 'nutricao', 'moda', 'sobre', 'contato']
        .map(id => document.getElementById(id)).filter(Boolean);
    if (!links.length || !sections.length) return;

    function updateActive() {
        const y = window.scrollY + window.innerHeight * 0.35;
        let current = sections[0].id;
        sections.forEach(sec => {
            if (sec.getBoundingClientRect().top + window.scrollY <= y) current = sec.id;
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('load', updateActive);
    updateActive();
})();

// ==========================================
// GSAP + ScrollTrigger
// Obs.: o CSS usa "transition: all" nos cards/botões, o que brigava com o GSAP
// (elementos ficavam invisíveis/travados dependendo do F5). Por isso o helper
// desliga a transition durante a animação e limpa os estilos inline no final.
// ==========================================
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback sem GSAP
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.category-card, .about-text, .about-img, .info-box, .social-links').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const CLEAR = 'opacity,transform,visibility,transition';

    // Anima elementos "de fora para dentro" sem conflito com o CSS
    function reveal(targets, vars, trigger, start) {
        const els = gsap.utils.toArray(targets);
        if (!els.length) return;
        gsap.set(els, { transition: 'none' });
        const config = Object.assign({
            duration: 0.8,
            ease: 'power3.out',
            clearProps: CLEAR,
            immediateRender: true
        }, vars);
        if (trigger) {
            config.scrollTrigger = {
                trigger: trigger,
                start: start || 'top 88%',
                once: true
            };
        }
        gsap.from(els, config);
    }

    // Hero (roda imediatamente)
    const heroEls = gsap.utils.toArray('.hero h1, .hero p, .hero-btns .btn');
    gsap.set(heroEls, { transition: 'none' });
    gsap.set('#header', { transition: 'none' });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: CLEAR } });
    tl.from('#header', { y: -50, opacity: 0, duration: 0.8 })
      .from('.hero h1', { y: 40, opacity: 0, duration: 1 }, '-=0.4')
      .from('.hero p', { y: 25, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-btns .btn', { y: 20, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.4');

    // Seções
    gsap.utils.toArray('.section-title').forEach(t => reveal(t, { y: 30, opacity: 0 }, t, 'top 90%'));

    gsap.utils.toArray('.category-card').forEach(card => {
        reveal(card, { y: 50, opacity: 0, duration: 0.9 }, card, 'top 90%');
        reveal(card.querySelectorAll('.features li'), { x: -12, opacity: 0, stagger: 0.04, duration: 0.5 }, card.querySelector('.product-grid'), 'top 90%');
        reveal(card.querySelectorAll('.brand-item'), { scale: 0.85, opacity: 0, stagger: 0.05, duration: 0.5, ease: 'back.out(1.6)' }, card.querySelector('.brand-box'), 'top 95%');
    });

    reveal('.about-text > *:not(.about-pillars):not(.stats)', { y: 22, opacity: 0, stagger: 0.1 }, '#sobre', 'top 75%');
    reveal('.pillar-card', { y: 30, opacity: 0, stagger: 0.1, duration: 0.7 }, '.about-pillars', 'top 90%');
    reveal('.stat-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '.stats', 'top 95%');
    reveal('.about-img', { x: 40, opacity: 0, duration: 1 }, '#sobre', 'top 70%');

    reveal('.map-container', { y: 30, opacity: 0 }, '#contato', 'top 80%');
    reveal('.dark-box, .google-review-card', { x: -30, opacity: 0, stagger: 0.1, duration: 0.7 }, '.contact-grid', 'top 80%');
    reveal('.social-btn', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '.social-links', 'top 90%');

    // Recalcula posições após imagens/fontes carregarem (evita bugs no F5 / scroll restaurado)
    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();

// ==========================================
// Status Dinâmico da Loja (Horário do Gama/DF)
// ==========================================
(function initStoreStatus() {
    function updateStoreStatus() {
        const statusEl = document.getElementById('store-status');
        if (!statusEl) return;

        // Horário oficial de Brasília
        const now = new Date();
        const brTimeStr = now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
        const brDate = new Date(brTimeStr);

        const day = brDate.getDay(); // 0 = Dom, 1 = Seg, ..., 6 = Sab
        const hours = brDate.getHours();
        const minutes = brDate.getMinutes();
        const timeNum = hours + minutes / 60;

        let isOpen = false;
        let nextOpenMsg = '';

        if (day >= 1 && day <= 4) {
            // Segunda a Quinta: 08h às 21h
            if (timeNum >= 8 && timeNum < 21) isOpen = true;
            else if (timeNum < 8) nextOpenMsg = 'Abre hoje às 08h';
            else nextOpenMsg = 'Abre amanhã às 08h';
        } else if (day === 5) {
            // Sexta: 08h às 20h
            if (timeNum >= 8 && timeNum < 20) isOpen = true;
            else if (timeNum < 8) nextOpenMsg = 'Abre hoje às 08h';
            else nextOpenMsg = 'Abre amanhã às 09h';
        } else if (day === 6) {
            // Sábado: 09h às 18h
            if (timeNum >= 9 && timeNum < 18) isOpen = true;
            else if (timeNum < 9) nextOpenMsg = 'Abre hoje às 09h';
            else nextOpenMsg = 'Abre segunda às 08h';
        } else {
            // Domingo: Fechado
            isOpen = false;
            nextOpenMsg = 'Abre segunda às 08h';
        }

        if (isOpen) {
            statusEl.className = 'store-status-badge status-open';
            statusEl.innerHTML = '<span class="status-dot pulse"></span> Aberto agora';
        } else {
            statusEl.className = 'store-status-badge status-closed';
            statusEl.innerHTML = `<span class="status-dot"></span> Fechado &bull; ${nextOpenMsg}`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateStoreStatus);
    } else {
        updateStoreStatus();
    }
    setInterval(updateStoreStatus, 60000);
})();
