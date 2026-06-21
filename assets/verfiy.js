// =============================================
// جلب الإيميل اللي اتبعت له الكود (من الصفحة اللي قبل)
// =============================================
const userEmail = sessionStorage.getItem("resetEmail") || new URLSearchParams(window.location.search).get("email");

if (userEmail) {
    document.getElementById("userEmail").textContent = userEmail;
}

// =============================================
// التحكم في خانات الكود (OTP)
// =============================================
const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = value;

        if (value) {
            input.classList.add("filled");
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        } else {
            input.classList.remove("filled");
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });

    // دعم لصق الكود كامل دفعة واحدة
    input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "");
        if (!pasted) return;

        pasted.split("").forEach((char, i) => {
            if (otpInputs[i]) {
                otpInputs[i].value = char;
                otpInputs[i].classList.add("filled");
            }
        });

        const nextIndex = Math.min(pasted.length, otpInputs.length - 1);
        otpInputs[nextIndex].focus();
    });
});

if (otpInputs.length) {
    otpInputs[0].focus();
}

// =============================================
// عداد إعادة إرسال الكود
// =============================================
const resendTimer = document.getElementById("resendTimer");
const resendLink = document.getElementById("resendLink");
const timerCount = document.getElementById("timerCount");

let secondsLeft = 60;
let countdownInterval = null;

function startCountdown() {
    secondsLeft = 60;
    resendTimer.style.display = "inline";
    resendLink.style.display = "none";
    timerCount.textContent = secondsLeft;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        secondsLeft--;
        timerCount.textContent = secondsLeft;

        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            resendTimer.style.display = "none";
            resendLink.style.display = "inline";
        }
    }, 1000);
}

startCountdown();

resendLink.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!userEmail) return;

    resendLink.style.pointerEvents = "none";
    try {
        // POST /api/Auth/forgot-password { Email }
        await fetch("https://localhost:7162/api/Auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: userEmail })
        });
    } catch (err) {
        console.error("Resend error:", err);
    } finally {
        resendLink.style.pointerEvents = "auto";
        startCountdown();
    }
});

// =============================================
// استخراج رسالة الخطأ سواء رجعت string عادي
// (زي BadRequest("Invalid OTP")) أو object فيه message
// =============================================
function extractErrorMessage(data, fallback) {
    if (!data) return fallback;
    if (typeof data === "string") return data;
    return data.message || data.title || fallback;
}

// =============================================
// إرسال الكود للتحقق
// =============================================
document.getElementById("verifyBtn").addEventListener("click", async function () {
    const codeError = document.getElementById("codeError");
    codeError.textContent = "";

    const code = Array.from(otpInputs).map((input) => input.value).join("");

    if (code.length < otpInputs.length) {
        codeError.textContent = "يرجى إدخال الكود كاملاً";
        return;
    }

    if (!userEmail) {
        codeError.textContent = "تعذر تحديد البريد الإلكتروني، يرجى المحاولة من جديد";
        return;
    }

    const btn = document.getElementById("verifyBtn");
    btn.disabled = true;
    btn.textContent = "جاري التحقق...";

    try {
        // POST /api/Auth/verify-otp { Email, Otp } => Ok("OTP Verified")
        const res = await fetch("https://localhost:7162/api/Auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: userEmail, Otp: code })
        });

        let data = null;
        try {
            data = await res.json();
        } catch {
            // مفيش body في الرد (زي NotFound())
        }

        if (!res.ok) {
            if (res.status === 404) {
                codeError.textContent = "المستخدم غير موجود";
            } else {
                codeError.textContent = extractErrorMessage(data, "الكود غير صحيح أو منتهي الصلاحية");
            }
            return;
        }

        // الباك إند مش بيرجّع توكن، فبنحفظ الإيميل والكود
        // عشان نستخدمهم تاني في خطوة تغيير الباسورد
        sessionStorage.setItem("resetEmail", userEmail);
        sessionStorage.setItem("resetOtp", code);

        window.location.href = "resetPassword.html";
    } catch (err) {
        console.error("Connection error:", err);
        codeError.textContent = "تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend";
    } finally {
        btn.disabled = false;
        btn.textContent = "تأكيد";
    }
});