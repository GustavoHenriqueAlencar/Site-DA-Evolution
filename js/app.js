// Header Background Change on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('#header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        header.style.padding = '10px 0';
    } else {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        header.style.padding = '20px 0';
    }
});

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Basic toggle animation or display
    if(navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navLinks.style.padding = '20px';
    }
});

// Smooth Scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if(window.innerWidth <= 992) {
            navLinks.style.display = 'none';
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for animations (Optional enhancement)
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.category-card, .about-text, .about-img').forEach(el => {
    observer.observe(el);
});
