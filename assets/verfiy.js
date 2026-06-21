// =============================================
// Toggle Password Visibility
// =============================================
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
// =============================================
// Login Form Validation & Submission
// =============================================
document.getElementById("loginBtn").addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    // Reset errors
    emailError.textContent = "";
    passwordError.textContent = "";
    let isValid = true;
    // ===== Validation: البريد الإلكتروني =====
    // إصلاح: regex صحيح بدل includes("@")
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        emailError.textContent = "يرجى إدخال البريد الإلكتروني";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = "يرجى إدخال بريد إلكتروني صحيح";
        isValid = false;
    }
    // ===== Validation: كلمة المرور =====
    if (!password) {
        passwordError.textContent = "يرجى إدخال كلمة المرور";
        isValid = false;
    }
    if (!isValid) return;
    // ===== Loading State =====
    const btn = document.getElementById("loginBtn");
    btn.disabled = true;
    btn.textContent = "جاري تسجيل الدخول...";
    try {
        // إصلاح: http بدل https على localhost
        const res = await fetch("https://localhost:7162/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email: email, Password: password })
        });
        // إصلاح: اقرأ الـ body أولاً عشان تاخد رسالة الـ error
        let data = null;
        try {
            data = await res.json();
        } catch {
            // لو الـ response مش JSON
        }
        if (!res.ok) {
            // إصلاح: استخدم رسالة الـ API لو موجودة
            if (res.status === 401) {
                passwordError.textContent = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
            } else {
                const apiMessage = data?.message || data?.title || "فشل تسجيل الدخول، حاول مرة أخرى";
                passwordError.textContent = apiMessage;
            }
            return;
        }
        // لو الـ backend بيرجع token احفظه
        if (data?.token) {
            localStorage.setItem("token", data.token);
        }
        console.log("تم تسجيل الدخول بنجاح:", data);
        // وجّه المستخدم للصفحة الرئيسية بعد النجاح
        window.location.href = "index.html";
    } catch (err) {
        // Network error أو CORS
        console.error("Connection error:", err);
        passwordError.textContent = "تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend";
    } finally {
        // ارجّع الزرار لحالته الأصلية دايمًا
        btn.disabled = false;
        btn.textContent = "تسجيل الدخول";
    }
});

// =============================================
// نسيت كلمة المرور — بنستخدم نفس حقل الإيميل في فورم
// الـ login، نبعت عليه الكود، ونوديه لصفحة التحقق
// =============================================
document.getElementById("forgotPasswordLink").addEventListener("click", async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const email = emailInput.value.trim();

    emailError.textContent = "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        emailError.textContent = "يرجى إدخال البريد الإلكتروني أولاً عشان نبعتلك كود التفعيل";
        emailInput.focus();
        return;
    }
    if (!emailPattern.test(email)) {
        emailError.textContent = "يرجى إدخال بريد إلكتروني صحيح";
        emailInput.focus();
        return;
    }

    const link = this;
    const originalText = link.textContent;
    link.textContent = "جاري الإرسال...";
    link.style.pointerEvents = "none";

    try {
        // POST /api/Auth/forgot-password { Email }
        const res = await fetch("https://localhost:7162/api/Auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email })
        });

        let data = null;
        try {
            data = await res.json();
        } catch {
            // مفيش body في الرد
        }

        if (!res.ok) {
            if (res.status === 404) {
                emailError.textContent = "هذا البريد الإلكتروني غير مسجل";
            } else {
                const apiMessage = typeof data === "string" ? data : (data?.message || data?.title);
                emailError.textContent = apiMessage || "تعذر إرسال الكود، حاول مرة أخرى";
            }
            return;
        }

        // احفظ الإيميل عشان صفحة التحقق تستخدمه
        sessionStorage.setItem("resetEmail", email);
        window.location.href = "verify.html";

    } catch (err) {
        console.error("Connection error:", err);
        emailError.textContent = "تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend";
    } finally {
        link.textContent = originalText;
        link.style.pointerEvents = "auto";
    }
});