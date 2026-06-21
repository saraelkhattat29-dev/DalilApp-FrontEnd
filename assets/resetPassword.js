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
// جلب الإيميل والـ token اللي جايين من صفحة التحقق
// =============================================
const userEmail = sessionStorage.getItem("resetEmail");
const resetToken = sessionStorage.getItem("resetToken");

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

    if (!userEmail || !resetToken) {
        confirmPasswordError.textContent = "انتهت صلاحية الجلسة، يرجى إعادة المحاولة من البداية";
        return;
    }

    // ===== Loading State =====
    const btn = document.getElementById("resetBtn");
    btn.disabled = true;
    btn.textContent = "جاري الحفظ...";

    try {
        // إصلاح الـ endpoint ده حسب الـ API بتاعك لو الاسم مختلف
        const res = await fetch("https://localhost:7162/api/Auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Email: userEmail,
                Token: resetToken,
                NewPassword: newPassword
            })
        });

        let data = null;
        try {
            data = await res.json();
        } catch {
            // مفيش body في الرد
        }

        if (!res.ok) {
            confirmPasswordError.textContent = data?.message || data?.title || "تعذر تغيير كلمة المرور، حاول مرة أخرى";
            return;
        }

        // نضّف بيانات الجلسة المؤقتة بعد النجاح
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");

        window.location.href = "login.html";
    } catch (err) {
        console.error("Connection error:", err);
        confirmPasswordError.textContent = "تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend";
    } finally {
        btn.disabled = false;
        btn.textContent = "حفظ كلمة المرور";
    }
});