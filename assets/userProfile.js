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

function saveProfile() {
    closeModal();
    showToast('<svg class="ico" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></svg> تم حفظ التغييرات بنجاح!');
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

function savePassword() {
    const cur = document.getElementById('currentPass').value;
    const nw = document.getElementById('newPass').value;
    const con = document.getElementById('confirmPass').value;

    if (!cur || !nw || !con) { showToast('⚠️ يرجى ملء جميع الحقول'); return; }
    if (nw !== con) { showToast('كلمة المرور الجديدة غير متطابقة'); return; }
    if (nw.length < 8) { showToast('⚠️ كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }

    closePasswordModal();
    showToast('✓ تم تغيير كلمة المرور بنجاح!');
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
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateCounters, 400);
    setTimeout(animateProgress, 400);
});