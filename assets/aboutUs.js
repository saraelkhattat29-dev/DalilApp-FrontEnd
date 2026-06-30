// ===== NAV TOGGLE (لو موجود زي السابق) =====
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===== SCROLL ANIMATION (IntersectionObserver - زي صفحة التواصل) =====
const animatedEls = document.querySelectorAll(
    '.feature-card, .service-box, .timeline-item, .stat-box, .vision-card'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animatedEls.forEach((el, i) => {
    el.style.transition = `0.6s ease ${i * 0.05}s`;
    observer.observe(el);
});