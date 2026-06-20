/* ===== API CONFIG ===== */
const API_BASE_URL = 'https://localhost:7162/api';
const TOKEN_KEY = 'token'; // 🔴 المفتاح اللي متخزن بيه التوكن في localStorage

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

let currentProfile = null;

/* ===== LOAD PROFILE ===== */
async function loadProfile() {
    const token = getToken();
    if (!token) {
        window.location.href = 'logIn.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'logIn.html';
            return;
        }

        if (!res.ok) {
            showToast('⚠️ حصل خطأ أثناء تحميل البيانات');
            return;
        }

        const data = await res.json();
        renderProfile(data);

    } catch (err) {
        console.error(err);
        showToast('⚠️ تعذر الاتصال بالسيرفر');
    }
}

function renderProfile(data) {
    currentProfile = data;
    document.getElementById('heroName').textContent = data.fullName;
    document.getElementById('profileEmail').textContent = data.email;
    document.getElementById('avatarRing').textContent = data.fullName ? data.fullName.charAt(0).toUpperCase() : '?';
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
    if (currentProfile) {
        document.getElementById('editFullName').value = currentProfile.fullName;
        document.getElementById('editEmail').value = currentProfile.email;
    }
    document.getElementById('editModal').classList.add('open');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('open');
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('editModal')) closeModal();
}

async function saveProfile() {
    const fullName = document.getElementById('editFullName').value.trim();
    const email = document.getElementById('editEmail').value.trim();

    // ===== Validation =====
    if (!fullName) {
        showToast('⚠️ يرجى إدخال الاسم الكامل');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        showToast('⚠️ يرجى إدخال بريد إلكتروني صحيح');
        return;
    }

    const token = getToken();
    if (!token) {
        window.location.href = 'logIn.html';
        return;
    }

    // ===== Loading State =====
    const saveBtn = document.getElementById('saveProfileBtn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.textContent = 'جاري الحفظ...';

    try {
        const res = await fetch(`${API_BASE_URL}/profile/edit`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ FullName: fullName, Email: email })
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'logIn.html';
            return;
        }

        if (!res.ok) {
            let msg = 'حصل خطأ أثناء حفظ البيانات';
            try {
                const errData = await res.json();
                msg = errData?.message || errData?.title || msg;
            } catch { }
            showToast('⚠️ ' + msg);
            return;
        }

        // ===== تحديث الواجهة محلياً بدون إعادة تحميل =====
        currentProfile.fullName = fullName;
        currentProfile.email = email;
        document.getElementById('heroName').textContent = fullName;
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('avatarRing').textContent = fullName.charAt(0).toUpperCase();

        closeModal();
        showToast('<i class="fa-solid fa-circle-check"></i> تم حفظ التغييرات بنجاح!');

    } catch (err) {
        console.error(err);
        showToast('⚠️ تعذر الاتصال بالسيرفر');

    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalHTML;
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
}

function handlePasswordOverlayClick(e) {
    if (e.target === document.getElementById('passwordModal')) closePasswordModal();
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
    loadProfile();
    setTimeout(animateCounters, 400);
    setTimeout(animateProgress, 400);
});
