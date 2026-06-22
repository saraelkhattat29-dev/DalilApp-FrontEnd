// ===== FORM SUBMISSION =====
function submitForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    // Reset errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('subjectError').textContent = '';
    document.getElementById('messageError').textContent = '';

    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
        document.getElementById('nameError').textContent = 'يرجى إدخال الاسم';
        isValid = false;
    }
    if (!email || !emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'يرجى إدخال بريد إلكتروني صحيح';
        isValid = false;
    }
    if (!subject) {
        document.getElementById('subjectError').textContent = 'يرجى اختيار موضوع الرسالة';
        isValid = false;
    }
    if (!message) {
        document.getElementById('messageError').textContent = 'يرجى كتابة رسالتك';
        isValid = false;
    }

    if (!isValid) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';

    // Simulate sending (replace with real API call)
    setTimeout(() => {
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('success-msg').style.display = 'block';
    }, 1500);
}

// ===== SCROLL ANIMATION =====
const animatedEls = document.querySelectorAll('.info-card, .form-card');

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
    el.style.transition = `0.6s ease ${i * 0.1}s`;
    observer.observe(el);
});