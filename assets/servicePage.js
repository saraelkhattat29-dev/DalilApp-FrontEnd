(function () {
    "use strict";

    var service = {
        name: "تجديد رخصة القيادة إلكترونياً",
        category: "المرور",
        type: "أونلاين",
        fees: "١٥٠ جنيه",
        duration: "٧ أيام عمل",
        description: "تتيح هذه الخدمة للمواطنين تجديد رخصة القيادة الخاصة بهم عبر الإنترنت دون الحاجة للحضور الشخصي إلى مقار المرور، مما يوفر الوقت والجهد. يمكن تقديم الطلب في أي وقت ومن أي مكان، وسيتم توصيل الرخصة المجددة إلى العنوان المسجل خلال ٧ أيام عمل.",
        url: "https://services.traffic.gov.eg/license/renew",

        steps: [
            { title: "تسجيل الدخول", detail: "ادخل بالرقم القومي وكلمة المرور على بوابة المرور الإلكترونية." },
            { title: "اختيار الخدمة", detail: "اختر «تجديد رخصة القيادة» من قائمة خدمات المرور." },
            { title: "رفع المستندات", detail: "ارفع صورة من الرقم القومي وشهادة اللياقة الطبية الحديثة." },
            { title: "سداد الرسوم", detail: "ادفع رسوم التجديد (١٥٠ جنيه) ببطاقة أو محفظة إلكترونية." },
            { title: "استلام الرخصة", detail: "ستصلك الرخصة الجديدة خلال ٧ أيام عمل على عنوانك المسجل." }
        ],

        documents: [
            "بطاقة الرقم القومي (سارية المفعول)",
            "رخصة القيادة الحالية",
            "شهادة اللياقة الطبية (لا تزيد عن ٣ أشهر)",
            "إيصال سداد رسوم التجديد",
            "صورة شخصية حديثة بخلفية بيضاء"
        ],

        locations: [
            { name: "إدارة مرور القاهرة", address: "شارع كورنيش النيل، ماسبيرو، القاهرة", query: "إدارة مرور القاهرة" },
            { name: "إدارة مرور الجيزة", address: "شارع الهرم، الجيزة", query: "إدارة مرور الجيزة" },
            { name: "مركز خدمات الإسكندرية", address: "شارع طريق الكورنيش، الإسكندرية", query: "مركز خدمات المرور الإسكندرية" }
        ]
    };

    var arabicNums = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"];
    function arNum(n) { return arabicNums[n - 1] || String(n); }

    function renderHeader() {
        setText("headerTitle", service.name);
    }

    function renderSummary() {
        setText("sumCategory", service.category);
        setText("sumType", service.type);
        setText("sumFees", service.fees);
        setText("sumDuration", service.duration);
    }

    function renderDescription() {
        setText("descText", service.description);
    }

    function renderUrl() {
        var section = document.getElementById("urlSection");
        if (!section) return;

        var isOnline = service.type === "أونلاين" || service.type === "هجين (أونلاين وحضوري)";
        if (!isOnline || !service.url) {
            section.style.display = "none";
            return;
        }

        var linkEl = document.getElementById("serviceUrl");
        var goEl = document.getElementById("goBtn");

        if (linkEl) {
            linkEl.href = service.url;
            linkEl.textContent = service.url;
        }
        if (goEl) goEl.href = service.url;
    }

    function renderSteps() {
        var list = document.getElementById("stepsList");
        if (!list || !service.steps || !service.steps.length) return;

        list.innerHTML = "";
        service.steps.forEach(function (step, i) {
            var li = document.createElement("li");
            li.className = "step-item";
            li.innerHTML =
                '<div class="step-num">' + arNum(i + 1) + '</div>' +
                '<div class="step-body">' +
                '<strong>' + escHtml(step.title) + '</strong>' +
                '<span>' + escHtml(step.detail) + '</span>' +
                '</div>';
            list.appendChild(li);
        });
    }

    function renderDocs() {
        var list = document.getElementById("docsList");
        if (!list || !service.documents || !service.documents.length) return;

        list.innerHTML = "";
        service.documents.forEach(function (doc) {
            var li = document.createElement("li");
            li.className = "doc-item";
            li.innerHTML =
                '<svg class="doc-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
                escHtml(doc);
            list.appendChild(li);
        });
    }

    function renderLocations() {
        var card = document.getElementById("locationsCard");
        var list = document.getElementById("locationsList");
        if (!card || !list) return;

        if (!service.locations || !service.locations.length) {
            card.style.display = "none";
            return;
        }

        list.innerHTML = "";
        service.locations.forEach(function (loc) {
            var mapsUrl = "https://maps.google.com/?q=" + encodeURIComponent(loc.query || loc.name);
            var li = document.createElement("li");
            li.className = "location-item";
            li.innerHTML =
                '<div class="loc-info">' +
                '<strong>' + escHtml(loc.name) + '</strong>' +
                '<span>' + escHtml(loc.address) + '</span>' +
                '</div>' +
                '<a href="' + mapsUrl + '" target="_blank" rel="noopener" class="map-btn" title="فتح في خرائط جوجل">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                'خريطة' +
                '</a>';
            list.appendChild(li);
        });
    }

    function initCopyBtn() {
        var btn = document.getElementById("copyBtn");
        if (!btn) return;
        btn.addEventListener("click", function () {
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(service.url).then(function () {
                btn.classList.add("copied");
                btn.querySelector(".copy-label").textContent = "تم النسخ!";
                setTimeout(function () {
                    btn.classList.remove("copied");
                    btn.querySelector(".copy-label").textContent = "نسخ";
                }, 2000);
            });
        });
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function init() {
        renderHeader();
        renderSummary();
        renderDescription();
        renderUrl();
        renderSteps();
        renderDocs();
        renderLocations();
        initCopyBtn();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();