/*=============== MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== LOGIN SYSTEM ===============*/
const authSection = document.getElementById("auth-section");

function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

function renderAuthSection() {
    if (isLoggedIn()) {
        authSection.innerHTML = `
            <div class="profile-section">
                <a href="userProfile.html" class="profile-icon">
                    <i class="fa-regular fa-user"></i>
                </a>
                <button class="logout-btn" id="logout-btn">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
        `;
        document.getElementById("logout-btn").addEventListener("click", logout);
    } else {
        authSection.innerHTML = `
            <button class="login-btn" id="login-btn">تسجيل الدخول</button>
        `;
        document.getElementById("login-btn").addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    renderAuthSection();
});