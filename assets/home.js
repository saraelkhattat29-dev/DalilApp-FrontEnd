/* ===================================================
   مصلحتك – JavaScript
   الصورة مضمَّنة كـ base64 مباشرةً في الكود
=================================================== */



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
  const navLinks  = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const bars   = navToggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      bars[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
      bars[1].style.opacity   = isOpen ? '0' : '1';
      bars[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    });
  }
  /* ----- Active nav link ----- */
  const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      allNavLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });


  /* ----- Search functionality ----- */
  const mainSearch = document.getElementById('mainSearch');
  const mainSearchBtn = document.getElementById('mainSearchBtn');
  const deptCards = document.querySelectorAll('.dept-card:not(.dept-card--suggest)');

  function doSearch() {
    const val = mainSearch.value.trim().toLowerCase();
    deptCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = val === '' || text.includes(val) ? 'block' : 'none';
    });
  }

  if (mainSearchBtn) mainSearchBtn.addEventListener('click', doSearch);
  if (mainSearch) mainSearch.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') doSearch();
  });
  

  /* REMOVED: floating particles - لا particles */

  /* ----- Scroll reveal ----- */
  const revealTargets = document.querySelectorAll(
    '.dept-card, .community-card, .strip-item, .suggest-inner, .footer-col'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease ' + (i * 0.07) + 's, transform 0.5s ease ' + (i * 0.07) + 's';
    observer.observe(el);
  });

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
    var raw  = el.textContent.trim();
    var latin = raw.replace(/[٠-٩]/g, function(d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
    var num  = parseInt(latin.replace(/\D/g, ''));
    var plus = raw.indexOf('+') !== -1;
    var duration = 1500;
    var start    = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = (plus ? '+' : '') + toArabicNumerals(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function toArabicNumerals(n) {
    return n.toString().replace(/\d/g, function(d) {
      return '٠١٢٣٤٥٦٧٨٩'[+d];
    });
  }

  /* ----- Smooth scroll ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });

});