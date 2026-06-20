function updateAuthBtn() {
    const btn = document.getElementById("auth-btn");
    if (!btn) return;

    const token = localStorage.getItem("token");
    if (!token) {
        btn.outerHTML = `<a href="logIn.html" class="login-btn" id="auth-btn">تسجيل الدخول</a>`;
        return;
    }

    try {
        btn.outerHTML = `
    <div class="auth-actions" id="auth-btn">
        <a href="profile.html" class="user-icon-btn" title="الملف الشخصي">
            <i class="fa-regular fa-user"></i>
        </a>
        <button class="logout-btn" onclick="logout()" title="تسجيل الخروج">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
    </div>`;
    } catch {
        btn.outerHTML = `<a href="logIn.html" class="login-btn" id="auth-btn">تسجيل الدخول</a>`;
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "logIn.html";
}
updateAuthBtn();