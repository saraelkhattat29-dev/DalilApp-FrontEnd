(function () {
    "use strict";

    /* ============================================
       ⚙️ إعدادات عامة - غيّر القيم دي حسب مشروعك
       ============================================ */
    var API_BASE_URL = "https://localhost:7000/api"; // 👈 غيّر ده للـ base URL بتاع الباك إند عندك
    var ENDPOINTS = {
        categories: API_BASE_URL + "/Category",      // 👈 غيّر المسار لو endpoint الكاتيجوريز عندك مختلف
        suggest: API_BASE_URL + "/Service/suggest"    // مطابق للـ [HttpPost("suggest")] في الكونترولر
    };
    var TOKEN_KEY = "token"; // 👈 غيّر ده لو اسم الـ key في localStorage مختلف (مثلاً "authToken")

    var form = document.getElementById("suggestionForm");
    var submitBtn = document.getElementById("submitBtn");
    var overlay = document.getElementById("successOverlay");
    var categorySelect = document.getElementById("category");

    var REQUIRED = ["serviceName", "category", "serviceType"];

    /* ============================================
       🔑 التوكن
       ============================================ */
    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    /* ============================================
       🚨 رسائل خطأ عامة (Toast بسيط فوق الفورم)
       ============================================ */
    function showApiError(message) {
        var existing = document.querySelector(".api-error-banner");
        if (existing) existing.remove();

        var banner = document.createElement("div");
        banner.className = "api-error-banner";
        banner.style.cssText = [
            "background:#fdecea",
            "border:1.5px solid #dc3545",
            "color:#dc3545",
            "padding:12px 18px",
            "border-radius:10px",
            "font-size:13.5px",
            "font-weight:600",
            "margin-bottom:1rem",
            "text-align:center"
        ].join(";");
        banner.textContent = message;
        form.parentNode.insertBefore(banner, form);
        banner.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(function () {
            if (banner.parentNode) banner.remove();
        }, 6000);
    }

    /* ============================================
       📂 جلب التصنيفات من الباك إند وتعبئة الـ select
       متوقع شكل الرد: [{ "id": 1, "name": "المرور" }, ...]
       لو شكل الرد مختلف (مثلاً categoryId / categoryName) عدّل في mapCategoryItem
       ============================================ */
    function mapCategoryItem(item) {
        return {
            id: item.id ?? item.categoryId ?? item.Id,
            name: item.name ?? item.categoryName ?? item.title ?? item.Name
        };
    }

    function loadCategories() {
        var token = getToken();
        var headers = { "Accept": "application/json" };
        if (token) headers["Authorization"] = "Bearer " + token;

        return fetch(ENDPOINTS.categories, { method: "GET", headers: headers })
            .then(function (res) {
                if (!res.ok) throw new Error("تعذر تحميل التصنيفات");
                return res.json();
            })
            .then(function (data) {
                var list = Array.isArray(data) ? data : (data.data || data.result || []);
                categorySelect.innerHTML = '<option value="">اختر التصنيف</option>';
                list.map(mapCategoryItem).forEach(function (cat) {
                    if (cat.id == null) return;
                    var opt = document.createElement("option");
                    opt.value = cat.id;
                    opt.textContent = cat.name;
                    categorySelect.appendChild(opt);
                });
            })
            .catch(function (err) {
                console.error("loadCategories error:", err);
                showApiError("تعذر تحميل قائمة التصنيفات، حاول تحديث الصفحة");
            });
    }

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
        f.addEventListener("change", function () {
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

    /* ── show / hide overlay ── */
    function showSuccess() {
        overlay.removeAttribute("hidden");
        overlay.classList.add("visible");
        document.body.style.overflow = "hidden";
    }
    function hideSuccess() {
        overlay.setAttribute("hidden", "");
        overlay.classList.remove("visible");
        document.body.style.overflow = "";
        form.reset();
        form.querySelectorAll(".field-wrap").forEach(function (w) {
            w.classList.remove("has-error");
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    var btnNew = document.querySelector(".btn-new");
    if (btnNew) btnNew.addEventListener("click", hideSuccess);

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

    /* ============================================
       🧱 تجهيز الـ payload بنفس شكل SuggestServiceDto
       ============================================ */
    function buildPayload() {
        var serviceTypeValue = document.getElementById("serviceType").value;
        // "أونلاين" أو "هجين" بنعتبرهم IsOnline = true، "حضوري" بس false
        // عدّل المنطق ده لو عندك تعريف مختلف لـ IsOnline في الباك إند
        var isOnline = (serviceTypeValue === "أونلاين" || serviceTypeValue === "هجين (أونلاين وحضوري)");

        var documentsRaw = document.getElementById("documents").value.trim();
        var documentLines = documentsRaw
            ? documentsRaw.split("\n").map(function (l) { return l.trim(); }).filter(Boolean)
            : [];

        return {
            Title: document.getElementById("serviceName").value.trim(),
            Description: document.getElementById("description").value.trim() || null,
            CategoryId: parseInt(categorySelect.value, 10),
            IsOnline: isOnline,
            // مفيش حقل مستندات بـ IDs حقيقية في الفورم حالياً، فبنبعت المستندات كخطوات نصية
            // لو ضفت اختيار مستندات حقيقي بـ IDs، استبدل السطر ده بمصفوفة الـ IDs المختارة
            RequiredDocumentIds: [],
            Steps: documentLines
        };
    }

    /* ============================================
       📡 إرسال الاقتراح للباك إند
       ============================================ */
    function submitSuggestion(payload) {
        var token = getToken();
        if (!token) {
            showApiError("يجب تسجيل الدخول أولاً لتقديم اقتراح");
            return Promise.reject(new Error("no-token"));
        }

        return fetch(ENDPOINTS.suggest, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (res.status === 401) {
                throw new Error("انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى");
            }
            if (res.status === 400) {
                return res.json().then(function (errBody) {
                    var firstError = extractFirstModelError(errBody);
                    throw new Error(firstError || "البيانات المرسلة غير صحيحة");
                });
            }
            if (!res.ok) {
                throw new Error("حدث خطأ أثناء إرسال الاقتراح، حاول مرة أخرى");
            }
            return res.text();
        });
    }

    /* استخراج أول رسالة خطأ من ModelState ([FromBody] BadRequest(ModelState)) */
    function extractFirstModelError(errBody) {
        if (!errBody) return null;
        if (typeof errBody === "string") return errBody;
        if (errBody.title) return errBody.title;
        if (errBody.errors) {
            for (var key in errBody.errors) {
                if (errBody.errors[key] && errBody.errors[key].length) {
                    return errBody.errors[key][0];
                }
            }
        }
        return null;
    }

    /* ── submit ── */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateAll()) { scrollToFirstError(); return; }

        var payload = buildPayload();
        setLoading(true);

        submitSuggestion(payload)
            .then(function () {
                setLoading(false);
                showSuccess();
            })
            .catch(function (err) {
                setLoading(false);
                if (err.message !== "no-token") {
                    showApiError(err.message || "حدث خطأ غير متوقع");
                }
            });
    });

    /* ============================================
       🚀 تحميل أولي
       ============================================ */
    loadCategories();
})();