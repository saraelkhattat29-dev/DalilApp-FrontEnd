(function () {
    "use strict";

    var form = document.getElementById("suggestionForm");
    var submitBtn = document.getElementById("submitBtn");
    var overlay = document.getElementById("successOverlay");
    var refNumber = document.getElementById("refNumber");

    var REQUIRED = ["serviceName", "category", "serviceType"];
    var API_BASE = "https://localhost:7162/api";
    var token = localStorage.getItem("token");
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

    /* ── تحميل التصنيفات ── */
    function loadCategories() {
        var select = document.getElementById("category");
        fetch(API_BASE + "/Categories")
            .then(function (res) {
                if (!res.ok) throw new Error("فشل تحميل التصنيفات");
                return res.json();
            })
            .then(function (categories) {
                select.innerHTML = '<option value="">اختر التصنيف</option>';
                categories.forEach(function (cat) {
                    var opt = document.createElement("option");
                    opt.value = cat.id;
                    opt.textContent = cat.name;
                    select.appendChild(opt);
                });
            })
            .catch(function (err) {
                console.error("Categories error:", err);
                select.innerHTML = '<option value="">تعذر تحميل التصنيفات</option>';
            });
    }
    /* ── show / hide overlay ── */
    function showSuccess(data) {
        refNumber.textContent = "#" + (data && data.id ? data.id : "");
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

    /* ── خريطة أسماء حقول الباك إند لـ id بتاع كل input ── */
    var FIELD_MAP = {
        Title: "serviceName",
        CategoryId: "category",
        Type: "serviceType",
        Description: "description"
    };

    function clearServerErrors() {
        Object.keys(FIELD_MAP).forEach(function (key) {
            var f = document.getElementById(FIELD_MAP[key]);
            if (f) f.closest(".field-wrap").classList.remove("has-error");
        });
        var formError = document.getElementById("formError");
        formError.style.display = "none";
        formError.textContent = "";
    }

    function showServerErrors(errorsObj) {
        Object.keys(errorsObj).forEach(function (key) {
            var fieldId = FIELD_MAP[key];
            if (!fieldId) return;
            var f = document.getElementById(fieldId);
            if (!f) return;
            var wrap = f.closest(".field-wrap");
            wrap.classList.add("has-error");
            var errSpan = wrap.querySelector(".field-error");
            if (errSpan) errSpan.textContent = errorsObj[key][0];
        });
    }

    function showFormError(message) {
        var formError = document.getElementById("formError");
        formError.style.display = "block";
        formError.textContent = message;
    }

    function buildPayload() {
        var documentsList = document.getElementById("documents").value
            .split("\n")
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line.length > 0; });

        return {
            Title: document.getElementById("serviceName").value.trim(),
            CategoryId: parseInt(document.getElementById("category").value, 10),
            Type: document.getElementById("serviceType").value,
            Description: document.getElementById("description").value.trim(),
            RequiredDocuments: documentsList
        };
    }

    /* ── submit ── */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateAll()) { scrollToFirstError(); return; }

        if (!token) {
            showFormError("يجب تسجيل الدخول أولاً عشان تقدري تبعتي اقتراح");
            setTimeout(function () { window.location.href = "logIn.html"; }, 1500);
            return;
        }

        clearServerErrors();
        setLoading(true);

        fetch(API_BASE + "/Services/suggest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(buildPayload())
        })
            .then(function (res) {
                return res.json().catch(function () { return null; }).then(function (data) {
                    return { status: res.status, ok: res.ok, data: data };
                });
            })
            .then(function (result) {
                setLoading(false);

                if (!result.ok) {
                    if (result.status === 401) {
                        showFormError("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
                        setTimeout(function () { window.location.href = "logIn.html"; }, 1500);
                        return;
                    }
                    if (result.data && result.data.errors) {
                        showServerErrors(result.data.errors);
                        scrollToFirstError();
                        return;
                    }
                    var msg = typeof result.data === "string" ? result.data : "حدث خطأ، حاولي مرة أخرى";
                    showFormError(msg);
                    return;
                }

                showSuccess(result.data);
            })
            .catch(function (err) {
                setLoading(false);
                console.error("Submit error:", err);
                showFormError("تعذر الاتصال بالخادم، تأكد من تشغيل الـ backend");
            });
    });
    loadCategories();
})();