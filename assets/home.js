
/* ===================================================
   مصلحتك – JavaScript
   الصورة مضمَّنة كـ base64 مباشرةً في الكود
=================================================== */

/* ----- Category Icons ----- */
const categoryIcons = {

  'الأحوال المدنية': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="13" y2="14"/>
    </svg>`,

  'الخدمات القانونية': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M12 3v18"/>
      <path d="M6 7h12"/>
      <path d="M8 21h8"/>
      <path d="M5 9l-3 4h6z"/>
      <path d="M19 9l-3 4h6z"/>
    </svg>`,

  'الإسكان': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M3 10l9-7 9 7"/>
      <path d="M5 10v10h14V10"/>
      <path d="M10 20v-6h4v6"/>
    </svg>`,

  'التموين والدعم': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`,

  'المرافق': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,

  'الصحة': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>
    </svg>`,

  'المرور': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="1" y="3" width="15" height="13" rx="2"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>`,

  'العمل': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <rect x="3" y="7" width="18" height="12" rx="2"/>
      <path d="M9 7V5h6v2"/>
    </svg>`,

  'الخدمات الأمنية': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"/>
    </svg>`,

  'التعليم': `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <path d="M2 7l10-5 10 5-10 5-10-5z"/>
      <path d="M6 10v5c0 2 3 4 6 4s6-2 6-4v-5"/>
    </svg>`
};

const defaultIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;


document.addEventListener('DOMContentLoaded', () => {

  /* ----- Inject hero background image (FIXED - no animation) ----- */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.style.backgroundImage = "url('" + CAIRO_IMAGE + "')";
  }

  /* ----- Navbar scroll effect ----- */
  const navbar = document.getElementById('header');
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

  // Dropdown container
  const dropdown = document.createElement('div');
  dropdown.id = 'search-dropdown';

  const searchBar = document.querySelector('.search-section-bar');
  searchBar.style.position = 'relative';
  searchBar.appendChild(dropdown);

  // إخفاء الـ dropdown لما اليوزر يضغط برا
  document.addEventListener('click', function (e) {
    if (!searchBar.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  let searchTimeout = null;

  if (mainSearch) {
    mainSearch.addEventListener('input', function () {
      const val = this.value.trim();
      clearTimeout(searchTimeout);

      if (!val) {
        dropdown.style.display = 'none';
        return;
      }

      // debounce 300ms عشان مايبعتش request بكل حرف
      searchTimeout = setTimeout(() => {
        fetchSearchDropdown(val);
      }, 300);
    });
  }

  // زرار البحث - يوجه لصفحة نتايج لو عايزة، أو تسيبيه فاضي
  if (mainSearchBtn) {
    mainSearchBtn.addEventListener('click', function () {
      const val = mainSearch.value.trim();
      if (val) fetchSearchDropdown(val);
    });
  }

  async function fetchSearchDropdown(query) {
    try {
      const res = await fetch(
        `https://localhost:7162/api/Services?search=${encodeURIComponent(query)}&pageSize=8`
      );
      if (!res.ok) return;
      const result = await res.json();
      renderDropdown(result.data, query);
    } catch (err) {
      console.error('Search error:', err);
    }
  }

  function renderDropdown(services, query) {
    dropdown.innerHTML = '';

    if (!services || services.length === 0) {
      dropdown.innerHTML = `
      <div style="padding:20px;text-align:center;">
        <div style="font-size:1.8rem;margin-bottom:8px;">🔍</div>
        <div style="color:#6E788F;font-size:0.88rem;">لا توجد نتائج لـ "<strong style="color:#132244">${query}</strong>"</div>
      </div>`;
      dropdown.style.display = 'block';
      return;
    }

    services.forEach(service => {
      const item = document.createElement('a');
      item.href = `servicePage.html?id=${service.id}`;
      item.className = 'search-drop-item';
      item.innerHTML = `
      <div class="search-drop-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DA523B" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <div class="search-drop-info">
        <div class="search-drop-title">${service.title}</div>
        <div class="search-drop-cat">${service.categoryName}</div>
      </div>
      <svg class="search-drop-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    `;
      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  }

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
  /* ----- Load Categories من الـ API ----- */
  loadCategories();
  loadCommunityPreview();
  loadHeroStats();

});


/* ===================================================
   Categories API Functions
=================================================== */

async function loadCategories() {
  try {

    console.log("Start Loading");

    const res = await fetch('https://localhost:7162/api/Categories');

    console.log("Status =", res.status);

    const categories = await res.json();

    console.log("Data =", categories);

    renderCategories(categories);

  } catch (err) {
    console.error("ERROR:", err);
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
    card.href = `servicesincategoryPage.html?categoryId=${cat.id}`;
    card.className = `dept-card ${isFeatured}`;
    card.innerHTML = `
  <div class="dept-icon">${icon}</div>

  <h3>${cat.name}</h3>

  <p>${cat.services?.join('، ') || ''}</p>

  <span class="dept-count">
      ${cat.servicesCount} خدمة
  </span>

  <div class="dept-arrow">←</div>
`;
    grid.appendChild(card);
  });

  // رجّع كارت الاقتراح في الآخر
  if (suggestCard) grid.appendChild(suggestCard);

  // شغّل الـ scroll reveal على الكاردات الجديدة
  reapplyScrollReveal();
}
async function loadCommunityPreview() {
  try {
    const res = await fetch('https://localhost:7162/api/posts');
    if (!res.ok) return;
    const posts = await res.json();
    if (!posts || posts.length === 0) return;

    const shuffled = posts.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 2);

    const cards = document.querySelectorAll('.community-card');

    picked.forEach((post, i) => {
      const card = cards[i];
      if (!card) return;

      const initials = post.userName
        ? post.userName.trim().split(' ').slice(0, 2).map(w => w[0]).join('.')
        : '؟';

      const date = new Date(post.createdAt + 'Z');
      const now = new Date(new Date().toISOString()); const diffMs = now - date;
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      let timeStr = diffDays > 0 ? `منذ ${diffDays} يوم` : `منذ ${diffHours} ساعة`;

      card.querySelector('.card-avatar').textContent = initials;
      card.querySelector('.card-meta strong').textContent = post.userName || 'مستخدم';
      card.querySelector('.card-meta span').textContent = '';
      card.querySelector('.card-question').textContent = post.content;
      card.querySelector('.card-replies').innerHTML =
        `<span>${post.commentsCount} رد</span><span>•</span><span>${timeStr}</span>`;

      const tag = card.querySelector('.card-tag');
      if (tag) tag.style.display = 'none';
    });

  } catch (err) {
    console.error('Community preview error:', err);
  }
}
async function searchServices(query) {
  try {
    const res = await fetch(`https://localhost:7162/api/Services?search=${encodeURIComponent(query)}&pageSize=20`);
    if (!res.ok) return;
    const result = await res.json();
    renderSearchResults(result.data);
  } catch (err) {
    console.error('Search error:', err);
  }
}

function renderSearchResults(services) {
  const grid = document.getElementById('deptGrid');
  const suggestCard = grid.querySelector('.dept-card--suggest');

  grid.innerHTML = '';

  if (!services || services.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted);padding:2rem;">لا توجد نتائج</p>';
    if (suggestCard) grid.appendChild(suggestCard);
    return;
  }

  services.forEach((service) => {
    const card = document.createElement('a');
    card.href = `services.html?categoryId=${service.categoryId}`;
    card.className = 'dept-card';
    card.innerHTML = `
      <div class="dept-icon">${defaultIcon}</div>
      <h3>${service.title}</h3>
      <p>${service.description || ''}</p>
      <span class="dept-count">${service.categoryName}</span>
      <div class="dept-arrow">←</div>
    `;
    grid.appendChild(card);
  });

  if (suggestCard) grid.appendChild(suggestCard);
  reapplyScrollReveal();
}
async function loadHeroStats() {
  try {
    const res = await fetch('https://localhost:7162/api/Dashboard/stats');
    if (!res.ok) return;
    const stats = await res.json();

    const serviceEl = document.querySelector('.stat-num:first-child');
    const statsEls = document.querySelectorAll('.stat-num');

    // عدد الخدمات — أول stat
    if (statsEls[0] && stats.totalServices != null) {
      statsEls[0].textContent = '+' + stats.totalServices;
      animateCounter(statsEls[0]);
    }

    if (statsEls[2] && stats.totalVisitors != null) {
      statsEls[2].textContent = '+' + stats.totalVisitors;
      animateCounter(statsEls[2]);
    }

  } catch (err) {
    console.error('Hero stats error:', err);
  }
}