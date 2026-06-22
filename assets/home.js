
/* ===================================================
   مصلحتك – JavaScript
   الصورة مضمَّنة كـ base64 مباشرةً في الكود
=================================================== */

/* ----- Category Icons ----- */
const categoryIcons = {
  'السجل المدني': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'الجوازات والهجرة': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  'المرور': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  'الشهر العقاري': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'الضرائب والجمارك': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  'الصحة والتأمين': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  'السجل التجاري': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  'التموين': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v2H4zM4 8h16v2H4zM4 12h16v2H4zM4 16h16v2H4z"/></svg>`,
  'الكهرباء': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  'المياه': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 5 10 5 14a7 7 0 0 0 14 0c0-4-7-12-7-12z"/></svg>`,
  'النيابة العامة': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M7 7h10"/><path d="M5 11h14"/><path d="M8 21h8"/></svg>`,
  'التعليم': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l10-5 10 5-10 5-10-5z"/><path d="M6 10v5c0 2 3 4 6 4s6-2 6-4v-5"/></svg>`,
};

const defaultIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;


document.addEventListener('DOMContentLoaded', () => {

  /* ----- Inject hero background image (FIXED - no animation) ----- */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.style.backgroundImage = "url('" + CAIRO_IMAGE + "')";
  }

  /* ----- Navbar scroll effect ----- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ----- Mobile nav toggle ----- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const bars = navToggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      bars[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
      bars[1].style.opacity = isOpen ? '0' : '1';
      bars[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    });
  }

  /* ----- Active nav link ----- */
  const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', function () {
      allNavLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ----- Search functionality ----- */
  const mainSearch = document.getElementById('mainSearch');
  const mainSearchBtn = document.getElementById('mainSearchBtn');

  function doSearch() {
    const val = mainSearch.value.trim().toLowerCase();
    const deptCards = document.querySelectorAll('.dept-card:not(.dept-card--suggest)');
    deptCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = val === '' || text.includes(val) ? 'block' : 'none';
    });
  }

  if (mainSearchBtn) mainSearchBtn.addEventListener('click', doSearch);
  if (mainSearch) mainSearch.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') doSearch();
  });

  /* ----- Scroll reveal observer (معرّف هنا عشان reapplyScrollReveal تقدر تستخدمه) ----- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  /* ----- Scroll reveal للعناصر الثابتة ----- */
  const revealTargets = document.querySelectorAll(
    '.community-card, .strip-item, .suggest-inner, .footer-col'
  );
  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease ' + (i * 0.07) + 's, transform 0.5s ease ' + (i * 0.07) + 's';
    observer.observe(el);
  });

  /* ----- reapplyScrollReveal للكاردات الديناميكية ----- */
  window.reapplyScrollReveal = function () {
    const newCards = document.querySelectorAll('.dept-card');
    newCards.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease ' + (i * 0.07) + 's, transform 0.5s ease ' + (i * 0.07) + 's';
      observer.observe(el);
    });
  };

  /* ----- Counter animation ----- */
  const stats = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    var raw = el.textContent.trim();
    var latin = raw.replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
    var num = parseInt(latin.replace(/\D/g, ''));
    var plus = raw.indexOf('+') !== -1;
    var duration = 1500;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (plus ? '+' : '') + toArabicNumerals(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function toArabicNumerals(n) {
    return n.toString().replace(/\d/g, function (d) {
      return '٠١٢٣٤٥٦٧٨٩'[+d];
    });
  }

  /* ----- Smooth scroll ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });

  /* ----- Load Categories من الـ API ----- */
  loadCategories();

});


/* ===================================================
   Categories API Functions
=================================================== */

async function loadCategories() {
  try {
    // استخدم HTTP مش HTTPS
    const res = await fetch('http://localhost:5000/api/Categories');    // ↑ غير البورت ده لبورت الباك إند بتاعك

    if (!res.ok) throw new Error('فشل التحميل');
    const categories = await res.json();
    renderCategories(categories);

  } catch (err) {
    console.error('خطأ في تحميل الكاتيجوريز:', err);
    document.getElementById('deptGrid').innerHTML =
      '<p style="color:red; text-align:center; padding:2rem">حدث خطأ في تحميل الأقسام، تأكد من تشغيل الـ API</p>';
  }
}

function renderCategories(categories) {
  const grid = document.getElementById('deptGrid');
  const suggestCard = grid.querySelector('.dept-card--suggest');

  grid.innerHTML = '';

  categories.forEach((cat, index) => {
    const icon = categoryIcons[cat.name] || defaultIcon;
    const isFeatured = index === 0 ? 'dept-card--featured' : '';

    const card = document.createElement('a');
    card.href = `services.html?categoryId=${cat.id}`;
    card.className = `dept-card ${isFeatured}`;
    card.innerHTML = `
      <div class="dept-icon">${icon}</div>
      <h3>${cat.name}</h3>
      <p>اضغط لاستعراض خدمات ${cat.name}</p>
      <div class="dept-arrow">←</div>
    `;
    grid.appendChild(card);
  });

  // رجّع كارت الاقتراح في الآخر
  if (suggestCard) grid.appendChild(suggestCard);

  // شغّل الـ scroll reveal على الكاردات الجديدة
  reapplyScrollReveal();
}