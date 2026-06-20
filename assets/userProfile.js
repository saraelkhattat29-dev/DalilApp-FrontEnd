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

/* ===== TOGGLE PASSWORD VISIBILITY ===== */
function togglePassword(fieldId, btn) {
    const input = document.getElementById(fieldId);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";

    const eyeOpen = btn.querySelector(".eye-open");
    const eyeClosed = btn.querySelector(".eye-closed");

    if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? "none" : "block";
        eyeClosed.style.display = isPassword ? "block" : "none";
    }
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


async function savePassword() {
    const cur = document.getElementById('currentPass').value;
    const nw = document.getElementById('newPass').value;
    const con = document.getElementById('confirmPass').value;

    // ===== Front-end Validation =====
    if (!cur || !nw || !con) { showToast('⚠️ يرجى ملء جميع الحقول'); return; }
    if (nw !== con) { showToast('⚠️ كلمة المرور الجديدة غير متطابقة'); return; }
    if (nw.length < 8) { showToast('⚠️ كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }

    const token = getToken();
    if (!token) {
        window.location.href = 'logIn.html';
        return;
    }

    // ===== Loading State =====
    const saveBtn = document.getElementById('savePassBtn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.textContent = 'جاري الحفظ...';

    try {
        const res = await fetch(`${API_BASE_URL}/profile/change-password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CurrentPassword: cur,
                NewPassword: nw,
                ConfirmPassword: con
            })
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'logIn.html';
            return;
        }

        if (!res.ok) {
            let msg = 'حصل خطأ أثناء تغيير كلمة المرور';
            try {
                const errData = await res.json();
                if (typeof errData === 'string') {
                    msg = errData === 'Current password is wrong'
                        ? 'كلمة المرور الحالية غير صحيحة'
                        : errData;
                } else if (errData?.message) {
                    msg = errData.message;
                } else if (errData?.title) {
                    msg = errData.title;
                }
            } catch { }
            showToast('⚠️ ' + msg);
            return;
        }

        closePasswordModal();
        showToast('✓ تم تغيير كلمة المرور بنجاح!');

    } catch (err) {
        console.error(err);
        showToast('⚠️ تعذر الاتصال بالسيرفر');

    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalHTML;
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

/* ===== LOAD MY POSTS ===== */
async function loadMyPosts() {
    const token = getToken();
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE_URL}/profile/my-posts`, {
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
            showToast('⚠️ تعذر تحميل منشوراتك');
            return;
        }

        const posts = await res.json();
        renderPosts(posts);

    } catch (err) {
        console.error(err);
        showToast('⚠️ تعذر الاتصال بالسيرفر');
    }
}

function renderPosts(posts) {
    const container = document.getElementById('postsList');

    if (!posts || posts.length === 0) {
        container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">لا توجد منشورات حتى الآن</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-head">
                <div class="post-title">${escapeHtml(truncateText(post.content, 60))}</div>
                <div class="post-date">${timeAgo(post.createdAt)}</div>
            </div>
            <div class="post-body">${escapeHtml(post.content)}</div>
            <div class="post-meta">
                <span><svg class="ico" viewBox="0 0 24 24" fill="none">
                        <path d="M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm0 0 4-8a2 2 0 0 1 2 2v5h6a2 2 0 0 1 2 2.2l-1.2 7A2 2 0 0 1 18 21H9a2 2 0 0 1-2-2v-8Z" />
                    </svg> ${post.likes} إعجاب</span>
                <span><svg class="ico" viewBox="0 0 24 24" fill="none">
                        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-5.5A8.4 8.4 0 0 1 21 11.5Z" />
                    </svg> ${post.commentsCount} تعليق</span>
            </div>
        </div>
    `).join('');
}

/* ===== HELPERS ===== */
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function timeAgo(dateString) {
    let isoString = dateString;
    if (typeof isoString === 'string' && !isoString.endsWith('Z') && !isoString.includes('+')) {
        isoString += 'Z';
    }
    const date = new Date(isoString);
    const now = new Date();
    const diffMin = Math.floor((now - date) / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1) return 'الآن';
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    if (diffHr < 24) return `منذ ${diffHr} ساعة`;
    if (diffDay === 1) return 'البارحة';
    if (diffDay < 7) return `منذ ${diffDay} أيام`;
    if (diffDay < 30) return `منذ ${Math.floor(diffDay / 7)} أسبوع`;
    return date.toLocaleDateString('ar-EG');
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadMyPosts();
    setTimeout(animateCounters, 400);
    setTimeout(animateProgress, 400);
});
