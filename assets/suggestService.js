(function () {
    "use strict";

    var form = document.getElementById("suggestionForm");
    var submitBtn = document.getElementById("submitBtn");
    var overlay = document.getElementById("successOverlay");
    var refNumber = document.getElementById("refNumber");

    var REQUIRED = ["serviceName", "fullName", "email"];

    /* ── validate single field ── */
    function validateField(field) {
        var wrap = field.closest(".field-wrap");
        if (!wrap) return true;
        var value = field.value.trim();
        var valid = (value !== "");
        if (field.type === "email" && value !== "") {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        wrap.classList.toggle("has-error", !valid);
        return valid;
    }

    /* ── validate all ── */
    function validateAll() {
        var ok = true;
        REQUIRED.forEach(function (id) {
            var f = document.getElementById(id);
            if (f && !validateField(f)) ok = false;
        });
        return ok;
    }

    /* ── live validation ── */
    REQUIRED.forEach(function (id) {
        var f = document.getElementById(id);
        if (!f) return;
        f.addEventListener("blur", function () { validateField(f); });
        f.addEventListener("input", function () {
            if (f.closest(".field-wrap").classList.contains("has-error")) validateField(f);
        });
    });

    /* ── scroll to first error ── */
    function scrollToFirstError() {
        var el = form.querySelector(".field-wrap.has-error");
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        var inp = el.querySelector("input, select, textarea");
        if (inp) inp.focus();
    }

    /* ── generate ref ── */
    function generateRef() {
        return "SRV-" + new Date().getFullYear() + "-" + (Math.floor(Math.random() * 900000) + 100000);
    }

    /* ── show / hide overlay ── */
    function showSuccess() {
        refNumber.textContent = generateRef();
        overlay.removeAttribute("hidden");          /* ← يشيل hidden */
        document.body.style.overflow = "hidden";
    }

    function hideSuccess() {
        overlay.setAttribute("hidden", "");         /* ← يرجع hidden */
        document.body.style.overflow = "";
        form.reset();
        form.querySelectorAll(".field-wrap").forEach(function (w) {
            w.classList.remove("has-error");
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /* ── زرار "تقديم اقتراح جديد" ── */
    var btnNew = document.querySelector(".btn-new");
    if (btnNew) {
        btnNew.addEventListener("click", hideSuccess);
    }

    /* ── إغلاق بالضغط على الخلفية ── */
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) hideSuccess();
    });

    /* ── loading state ── */
    function setLoading(on) {
        submitBtn.disabled = on;
        var t = submitBtn.querySelector(".btn-text");
        var l = submitBtn.querySelector(".btn-loader");
        if (t) t.style.display = on ? "none" : "";
        if (l) l.style.display = on ? "flex" : "none";
    }

    /* ── submit ── */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateAll()) { scrollToFirstError(); return; }
        setLoading(true);
        setTimeout(function () {
            setLoading(false);
            showSuccess();
        }, 1500);
    });

})();
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

/* ── Mobile Menu ── */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
        if (!e.target.closest(".navbar")) {
            navLinks.classList.remove("open");
        }
    });
}