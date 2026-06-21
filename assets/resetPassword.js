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
// جلب الإيميل والـ OTP اللي جايين من صفحة التحقق
// (الباك إند بيتأكد من الـ OTP تاني هنا، فلازم نبعته تاني)
// =============================================
const userEmail = sessionStorage.getItem("resetEmail");
const resetOtp = sessionStorage.getItem("resetOtp");

// =============================================
// استخراج رسالة الخطأ سواء رجعت string عادي أو object
// =============================================
function extractErrorMessage(data, fallback) {
    if (!data) return fallback;
    if (typeof data === "string") return data;
    return data.message || data.title || fallback;
}

// =============================================
// إرسال كلمة المرور الجديدة
// =============================================
document.getElementById("resetBtn").addEventListener("click", async function () {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const newPasswordError = document.getElementById("newPasswordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    newPasswordError.textContent = "";
    confirmPasswordError.textContent = "";

    let isValid = true;

    // ===== Validation: كلمة المرور الجديدة =====
    if (!newPassword) {
        newPasswordError.textContent = "يرجى إدخال كلمة المرور الجديدة";
        isValid = false;
    } else if (newPassword.length < 8) {
        newPasswordError.textContent = "كلمة المرور يجب ألا تقل عن 8 أحرف";
        isValid = false;
    }

    // ===== Validation: تأكيد كلمة المرور =====
    if (!confirmPassword) {
        confirmPasswordError.textContent = "يرجى تأكيد كلمة المرور";
        isValid = false;
    } else if (newPassword && confirmPassword !== newPassword) {
        confirmPasswordError.textContent = "كلمتا المرور غير متطابقتين";
        isValid = false;
    }

    if (!isValid) return;

    if (!userEmail || !resetOtp) {
        confirmPasswordError.textContent = "انتهت صلاحية الجلسة، يرجى إعادة المحاولة من البداية";
        return;
    }

    // ===== Loading State =====
    const btn = document.getElementById("resetBtn");
    btn.disabled = true;
    btn.textContent = "جاري الحفظ...";

    try {
        // POST /api/Auth/reset-password { Email, Otp, NewPassword, ConfirmPassword }
        const res = await fetch("https://localhost:7162/api/Auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Email: userEmail,
                Otp: resetOtp,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword
            })
        });

        let data = null;
        try {
            data = await res.json();
        } catch {
            // مفيش body في الرد (زي NotFound())
        }

        if (!res.ok) {
            if (res.status === 404) {
                confirmPasswordError.textContent = "المستخدم غير موجود";
            } else {
                confirmPasswordError.textContent = extractErrorMessage(data, "تعذر تغيير كلمة المرور، حاول مرة أخرى");
            }
            return;
        }

        // نضّف بيانات الجلسة المؤقتة بعد النجاح
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetOtp");

        window.location.href = "login.html";
    } catch (err) {
        console.error("Connection error:", err);
        confirmPasswordError.textContent = "تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend";
    } finally {
        btn.disabled = false;
        btn.textContent = "حفظ كلمة المرور";
    }
});