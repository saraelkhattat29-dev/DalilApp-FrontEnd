// =============================================
// Toggle Password Visibility
// إصلاح: بتتطلب fieldId وعنصر الزرار
// =============================================
function togglePassword(fieldId, btn) {
    const input = document.getElementById(fieldId);
    const isPassword = input.type === "password";

    // تبديل نوع الحقل
    input.type = isPassword ? "text" : "password";

    // تبديل الأيقونة
    const eyeOpen = btn.querySelector(".eye-open");
    const eyeClosed = btn.querySelector(".eye-closed");

    if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? "none" : "block";
        eyeClosed.style.display = isPassword ? "block" : "none";
    }
}

// =============================================
// Signup Form Validation & Submission
// =============================================
document.getElementById("signupBtn").addEventListener("click", async function () {

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    // Reset errors
    [nameError, emailError, passwordError, confirmPasswordError].forEach(el => {
        el.textContent = "";
    });

    let isValid = true;

    // ===== Validation: الاسم =====
    if (!name) {
        nameError.textContent = "يرجى إدخال الاسم بالكامل";
        isValid = false;
    } else if (name.length < 3) {
        nameError.textContent = "الاسم لازم يكون 3 أحرف على الأقل";
        isValid = false;
    }

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
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!password) {
        passwordError.textContent = "يرجى إدخال كلمة المرور";
        isValid = false;
    } else if (!passwordPattern.test(password)) {
        passwordError.textContent = "لازم تكون 8 أحرف على الأقل وتحتوي على حرف كبير وصغير ورقم ورمز خاص";
        isValid = false;
    }

    // ===== Validation: تأكيد كلمة المرور =====
    if (!confirmPassword) {
        confirmPasswordError.textContent = "يرجى تأكيد كلمة المرور";
        isValid = false;
    } else if (confirmPassword !== password) {
        confirmPasswordError.textContent = "كلمتا المرور غير متطابقتين";
        isValid = false;
    }

    if (!isValid) return;

    // ===== Loading State =====
    const btn = document.getElementById("signupBtn");
    btn.disabled = true;
    btn.textContent = "جاري الإنشاء...";

    try {
        // إصلاح: http بدل https على localhost عشان تتجنب SSL error
        // غيّر الـ port لو الـ backend بتاعك على port مختلف
        const res = await fetch("https://localhost:7162/api/Auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullName: name, Email: email, Password: password, ConfirmPassword: confirmPassword })
        });

        // إصلاح: اقرأ الـ response body الأول
        // عشان تاخد رسالة الـ error من الـ API لو فيه
        let data = null;
        try {
            data = await res.json();
        } catch {
            // لو الـ response مش JSON
        }

        if (!res.ok) {
            // إصلاح: استخدم رسالة الـ API لو موجودة
            const apiMessage =
                data?.message ||
                data?.title ||
                data?.errors?.[0] ||
                "فشل إنشاء الحساب، حاول مرة أخرى";

            // لو الـ error متعلق بالإيميل (مثلاً موجود مسبقاً)
            if (res.status === 409) {
                emailError.textContent = "هذا البريد الإلكتروني مسجل بالفعل";
            } else {
                emailError.textContent = apiMessage;
            }
            return;
        }

        // نجح التسجيل
        showToast("تم إنشاء الحساب بنجاح");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (err) {
        // Network error أو CORS
        console.error("Connection error:", err);
        emailError.textContent = "تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend";

    } finally {
        // إصلاح: ارجّع الزرار لحالته الأصلية دايمًا
        btn.disabled = false;
        btn.textContent = "إنشاء حساب";
    }
});
function showToast(message) {
    const old = document.getElementById("signup-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.id = "signup-toast";

    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        ${message}
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}