/* ===== API CONFIG ===== */
const API_BASE_URL = '/api'; // عدّلها لو الباك شغال على دومين منفصل، مثال: 'https://api.dalil.com/api'

function getToken() {
    return localStorage.getItem('token');
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    if (res.status === 401) {
        // الجلسة منتهية - ممكن تحوّل المستخدم لصفحة تسجيل الدخول هنا لو حابب
        throw new Error('UNAUTHORIZED');
    }
    if (!res.ok) {
        let msg = `خطأ ${res.status}`;
        try {
            const data = await res.json();
            msg = (typeof data === 'string') ? data : (data?.message || data?.title || msg);
        } catch (_) { /* الرد مش JSON */ }
        throw new Error(msg);
    }
    // بعض الـ endpoints بترجع 200 برسالة نصية بسيطة، نتعامل مع الحالتين
    const text = await res.text();
    try { return JSON.parse(text); } catch (_) { return text; }
}

/* ===== TIME FORMAT ===== */
function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? 'البارحة' : `منذ ${days} أيام`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `منذ ${weeks} أسبوع`;
    const months = Math.floor(days / 30);
    if (months < 12) return `منذ ${months} شهر`;
    return `منذ ${Math.floor(days / 365)} سنة`;
}

/* ===== ICON HELPERS (مبدئيًا أيقونة واحدة موحّدة، اظبطها بعدين حسب النوع) ===== */
const DEFAULT_ACT_ICON = `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-5.5A8.4 8.4 0 0 1 21 11.5Z"/></svg>`;
const DEFAULT_NOTIF_ICON = `<svg class="ico" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;

function getActivityIcon(activityType) {
    // TODO: لما تتأكد من قيم ActivityType الحقيقية، حط mapping هنا
    // مثال: if (activityType === 'Comment' || activityType === 0) return '<svg ...>';
    return DEFAULT_ACT_ICON;
}

function getNotifIcon(type) {
    // TODO: لما تتأكد من قيم Notification.Type الحقيقية، حط mapping هنا
    return DEFAULT_NOTIF_ICON;
}

function getActivityDotClass(index) {
    const classes = ['dot-blue', 'dot-green', 'dot-gold', 'dot-red'];
    return classes[index % classes.length];
}

/* ===== LOAD PROFILE (بيانات + إحصائيات) ===== */
async function loadProfile() {
    try {
        const profile = await apiFetch('/profile');

        // الاسم والحرف الأول في الأفاتار
        const nameEl = document.querySelector('.hero-name');
        if (nameEl) nameEl.textContent = profile.fullName;

        const avatarEl = document.querySelector('.avatar-ring');
        if (avatarEl) avatarEl.textContent = profile.fullName ? profile.fullName.charAt(0) : '؟';

        // البريد الإلكتروني
        const emailEl = document.querySelector('.info-val');
        if (emailEl) emailEl.textContent = profile.email;

        // عدّادات الإحصائيات لو موجودة في الصفحة (data-target)
        const postsStat = document.querySelector('[data-stat="posts"]');
        if (postsStat) postsStat.dataset.target = profile.postsCount;

        const sugStat = document.querySelector('[data-stat="suggestions"]');
        if (sugStat) sugStat.dataset.target = profile.suggestionsCount;

        // تعبئة فورم تعديل الملف لو موجود
        const editName = document.querySelector('#editModal input[type="text"]');
        if (editName) editName.value = profile.fullName;
        const editEmail = document.querySelector('#editModal input[type="email"]');
        if (editEmail) editEmail.value = profile.email;

    } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
            showToast('⚠️ انتهت الجلسة، يرجى تسجيل الدخول مجدداً');
        } else {
            showToast('⚠️ تعذّر تحميل بيانات الملف الشخصي');
        }
    }
}

/* ===== LOAD ACTIVITIES ===== */
async function loadActivities() {
    const container = document.querySelector('.activity-list');
    if (!container) return;

    try {
        const activities = await apiFetch('/profile/activities');

        if (!activities || activities.length === 0) {
            container.innerHTML = `<div class="act-text" style="padding:12px;color:var(--muted);">لا يوجد نشاط بعد</div>`;
            return;
        }

        container.innerHTML = activities.map((a, i) => `
            <div class="activity-item">
                <div class="act-dot ${getActivityDotClass(i)}">${getActivityIcon(a.activityType)}</div>
                <div class="act-text">
                    <div class="act-main">${a.description ?? ''}</div>
                    <div class="act-time">${timeAgo(a.createdAt)}</div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        container.innerHTML = `<div class="act-text" style="padding:12px;color:var(--muted);">تعذّر تحميل النشاطات</div>`;
    }
}

/* ===== LOAD NOTIFICATIONS ===== */
async function loadNotifications() {
    const container = document.getElementById('notifList');
    if (!container) return;

    try {
        const notifications = await apiFetch('/profile/notifications');

        if (!notifications || notifications.length === 0) {
            container.innerHTML = `<div class="notif-text" style="padding:12px;color:var(--muted);">لا توجد إشعارات</div>`;
            updateNotifBadge(0);
            return;
        }

        container.innerHTML = notifications.map((n, i) => `
            <div class="notif-item ${n.isRead ? '' : 'unread'}">
                <div class="notif-dot ${getActivityDotClass(i)}">${getNotifIcon(n.type)}</div>
                <div class="notif-text">
                    <div class="notif-main"><strong>${n.senderName ?? ''}</strong> ${notifTypeLabel(n.type)}</div>
                    <div class="notif-time">${timeAgo(n.createdAt)}</div>
                </div>
            </div>
        `).join('');

        const unreadCount = notifications.filter(n => !n.isRead).length;
        updateNotifBadge(unreadCount);

    } catch (err) {
        container.innerHTML = `<div class="notif-text" style="padding:12px;color:var(--muted);">تعذّر تحميل الإشعارات</div>`;
    }
}

function notifTypeLabel(type) {
    // TODO: اربطها بنص حقيقي حسب نوع الإشعار (تعليق / إعجاب / رد...) لما تتأكد من القيم
    return 'تفاعل مع نشاطك';
}

function updateNotifBadge(count) {
    const badge = document.getElementById('notifCount');
    if (!badge) return;
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = '';
    } else {
        badge.style.display = 'none';
    }
}

/* ===== LOAD MY POSTS ===== */
async function loadMyPosts() {
    const container = document.querySelector('#tab-posts .posts-list');
    if (!container) return;

    try {
        const posts = await apiFetch('/profile/my-posts');

        if (!posts || posts.length === 0) {
            container.innerHTML = `<div style="padding:12px;color:var(--muted);">لا توجد منشورات بعد</div>`;
            return;
        }

        container.innerHTML = posts.map(p => `
            <div class="post-card">
                <div class="post-head">
                    <div class="post-title">${p.content ? p.content.slice(0, 60) : ''}</div>
                    <div class="post-date">${timeAgo(p.createdAt)}</div>
                </div>
                <div class="post-body">${p.content ?? ''}</div>
                <div class="post-meta">
                    <span>${DEFAULT_ACT_ICON} ${p.likes ?? 0} إعجاب</span>
                    <span>${DEFAULT_ACT_ICON} ${p.commentsCount ?? 0} تعليق</span>
                </div>
            </div>
        `).join('');

    } catch (err) {
        container.innerHTML = `<div style="padding:12px;color:var(--muted);">تعذّر تحميل المنشورات</div>`;
    }
}

/* ===== LOAD MY SUGGESTIONS ===== */
async function loadMySuggestions() {
    const container = document.querySelector('#tab-suggestions .suggestion-list');
    if (!container) return;

    try {
        const suggestions = await apiFetch('/profile/my-suggestions');

        if (!suggestions || suggestions.length === 0) {
            container.innerHTML = `<div style="padding:12px;color:var(--muted);">لا توجد اقتراحات بعد</div>`;
            return;
        }

        container.innerHTML = suggestions.map(s => `
            <div class="suggestion-item">
                <div class="sug-ico">${DEFAULT_ACT_ICON}</div>
                <div class="sug-info">
                    <div class="sug-name">${s.title ?? ''}</div>
                    <div class="sug-desc">${s.description ?? ''}</div>
                </div>
                <span class="sug-badge ${s.isApproved ? 'badge-approved' : 'badge-pending'}">
                    ${s.isApproved ? 'مقبول' : 'قيد المراجعة'}
                </span>
            </div>
        `).join('');

    } catch (err) {
        container.innerHTML = `<div style="padding:12px;color:var(--muted);">تعذّر تحميل الاقتراحات</div>`;
    }
}

/* ===== LOAD EVERYTHING ===== */
function loadAllProfileData() {
    loadProfile();
    loadActivities();
    loadNotifications();
    loadMyPosts();
    loadMySuggestions();
}

/* ===== TABS ===== */
function switchTab(btn, id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + id).classList.add('active');
}

/* ===== EDIT MODAL ===== */
function openModal() {
    document.getElementById('editModal').classList.add('open');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('open');
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('editModal')) closeModal();
}

async function saveProfile() {
    const nameInput = document.querySelector('#editModal input[type="text"]');
    const emailInput = document.querySelector('#editModal input[type="email"]');

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!fullName || !email) { showToast('⚠️ يرجى ملء جميع الحقول'); return; }

    try {
        await apiFetch('/profile/edit', {
            method: 'PUT',
            body: JSON.stringify({ fullName, email })
        });
        closeModal();
        showToast('<svg class="ico" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></svg> تم حفظ التغييرات بنجاح!');
        loadProfile(); // تحديث الاسم/الإيميل المعروضين في الصفحة
    } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
            showToast('⚠️ انتهت الجلسة، يرجى تسجيل الدخول مجدداً');
        } else {
            showToast(`⚠️ ${err.message || 'تعذّر حفظ التغييرات'}`);
        }
    }
}

/* ===== PASSWORD MODAL ===== */
function openPasswordModal() {
    document.getElementById('passwordModal').classList.add('open');
}

function closePasswordModal() {
    document.getElementById('passwordModal').classList.remove('open');
    document.getElementById('currentPass').value = '';
    document.getElementById('newPass').value = '';
    document.getElementById('confirmPass').value = '';
    document.getElementById('strengthBar').style.width = '0%';
    document.getElementById('strengthHint').textContent = '';
}

function handlePasswordOverlayClick(e) {
    if (e.target === document.getElementById('passwordModal')) closePasswordModal();
}

function checkPassStrength(val) {
    const bar = document.getElementById('strengthBar');
    const hint = document.getElementById('strengthHint');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
        { w: '0%', c: '#e53e3e', t: '' },
        { w: '25%', c: '#e53e3e', t: 'ضعيفة جداً' },
        { w: '50%', c: '#dd9b27', t: 'متوسطة' },
        { w: '75%', c: '#2f9e5b', t: 'جيدة' },
        { w: '100%', c: '#1a7a4a', t: 'قوية جداً ✓' },
    ];
    const lv = val.length === 0 ? levels[0] : levels[score];
    bar.style.width = lv.w;
    bar.style.background = lv.c;
    hint.textContent = lv.t;
    hint.style.color = lv.c;
}

async function savePassword() {
    const cur = document.getElementById('currentPass').value;
    const nw = document.getElementById('newPass').value;
    const con = document.getElementById('confirmPass').value;

    if (!cur || !nw || !con) { showToast('⚠️ يرجى ملء جميع الحقول'); return; }
    if (nw !== con) { showToast('⚠️ كلمة المرور الجديدة غير متطابقة'); return; }
    if (nw.length < 8) { showToast('⚠️ كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }

    const saveBtn = document.getElementById('savePassBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = 'جاري الحفظ...';

    try {
        await apiFetch('/profile/change-password', {
            method: 'PUT',
            body: JSON.stringify({
                currentPassword: cur,
                newPassword: nw,
                confirmPassword: con
            })
        });
        closePasswordModal();
        showToast('✓ تم تغيير كلمة المرور بنجاح!');
    } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
            showToast('⚠️ انتهت الجلسة، يرجى تسجيل الدخول مجدداً');
        } else {
            showToast(`⚠️ ${err.message || 'حدث خطأ أثناء تغيير كلمة المرور'}`);
        }
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

/* ===== NOTIFICATIONS ===== */
function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    document.getElementById('notifCount').style.display = 'none';
    showToast('✓ تم تعليم كل الإشعارات كمقروءة');
}

/* ===== TOAST ===== */
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

/* ===== COUNT-UP ANIMATION ===== */
function animateCounters() {
    document.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const step = target / (1200 / 16);
        let cur = 0;
        const timer = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = Math.round(cur).toLocaleString('ar-EG');
            if (cur >= target) clearInterval(timer);
        }, 16);
    });
}

/* ===== PROGRESS BARS ===== */
function animateProgress() {
    document.querySelectorAll('.progress-fill[data-width]').forEach(el => {
        setTimeout(() => { el.style.width = el.dataset.width; }, 300);
    });
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', async () => {
    await loadAllProfileData();
    setTimeout(animateCounters, 100);
    setTimeout(animateProgress, 100);
});