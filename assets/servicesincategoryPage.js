(function () {
    "use strict";

    /* ============================================
       DATA
       ============================================ */
    var category = {
        name: "المرور",
        description: "جميع خدمات المرور المتاحة إلكترونياً وحضورياً في مكان واحد"
    };

    var services = [
        {
            id: 1,
            name: "تجديد رخصة القيادة إلكترونياً",
            description: "تجديد رخصة القيادة عبر الإنترنت دون الحاجة للحضور الشخصي إلى مقار المرور.",
            type: "أونلاين",
            fees: "١٥٠ جنيه",
            duration: "٧ أيام عمل",
            url: "servicePage.html?id=1",
            icon: "license"
        },
        {
            id: 2,
            name: "استخراج رخصة قيادة جديدة",
            description: "تقديم طلب الحصول على رخصة قيادة للمرة الأولى من خلال الإجراءات المعتمدة.",
            type: "حضوري",
            fees: "٣٠٠ جنيه",
            duration: "١٤ يوم عمل",
            url: "servicePage.html?id=2",
            icon: "card"
        },
        {
            id: 3,
            name: "الاستعلام عن مخالفات المرور",
            description: "الاستعلام عن المخالفات المرورية المسجلة وسدادها عبر البوابة الإلكترونية.",
            type: "أونلاين",
            fees: "مجانية",
            duration: "فوري",
            url: "servicePage.html?id=3",
            icon: "search"
        },
        {
            id: 4,
            name: "نقل ملكية السيارة",
            description: "إجراءات نقل ملكية المركبة بين البائع والمشتري مع توثيق العقد رسمياً.",
            type: "حضوري",
            fees: "٥٠٠ جنيه",
            duration: "٣ أيام عمل",
            url: "servicePage.html?id=4",
            icon: "transfer"
        },
        {
            id: 5,
            name: "تجديد رخصة تسيير المركبة",
            description: "تجديد رخصة تشغيل المركبة الخاصة أو التجارية وفقاً للإجراءات المعتمدة.",
            type: "أونلاين",
            fees: "٢٠٠ جنيه",
            duration: "٥ أيام عمل",
            url: "servicePage.html?id=5",
            icon: "car"
        },
        {
            id: 6,
            name: "إصدار شهادة بيانات المركبة",
            description: "استخراج شهادة رسمية تُثبت بيانات المركبة ومالكها وتاريخ التسجيل.",
            type: "حضوري",
            fees: "٨٠ جنيه",
            duration: "يوم واحد",
            url: "servicePage.html?id=6",
            icon: "doc"
        },
        {
            id: 7,
            name: "تغيير لون المركبة",
            description: "تعديل بيانات اللون المسجل للمركبة في إدارة المرور بعد إجراء التغيير الفعلي.",
            type: "حضوري",
            fees: "١٢٠ جنيه",
            duration: "٣ أيام عمل",
            url: "servicePage.html?id=7",
            icon: "edit"
        },
        {
            id: 8,
            name: "إبلاغ عن سرقة لوحات المركبة",
            description: "تقديم بلاغ رسمي عن سرقة لوحات المركبة واستخراج بدل فاقد.",
            type: "حضوري",
            fees: "١٨٠ جنيه",
            duration: "٥ أيام عمل",
            url: "servicePage.html?id=8",
            icon: "alert"
        }
    ];

    /* ============================================
       ICONS MAP
       ============================================ */
    var icons = {
        license: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4M14 15h4"/></svg>',
        card:    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M13 10h4M13 14h4"/></svg>',
        search:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        transfer:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
        car:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
        doc:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        edit:    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        alert:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    };

    var defaultIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>';

    /* Arrow icon for button */
    var arrowIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    /* ============================================
       STATE
       ============================================ */
    var state = { filter: "all", query: "" };

    /* ============================================
       HELPERS
       ============================================ */
    function escHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function toArabicNums(n) {
        return String(n).replace(/[0-9]/g, function (d) {
            return "٠١٢٣٤٥٦٧٨٩"[d];
        });
    }

    function getIcon(key) {
        return icons[key] || defaultIcon;
    }

    /* ============================================
       RENDER HEADER
       ============================================ */
    function renderHeader() {
        setText("catTitle", category.name);
        setText("catDesc",  category.description);
    }

    /* ============================================
       FILTER LOGIC
       ============================================ */
    function filteredServices() {
        return services.filter(function (s) {
            var matchFilter =
                state.filter === "all" ||
                (state.filter === "أونلاين" && s.type === "أونلاين") ||
                (state.filter === "حضوري"   && s.type === "حضوري");

            var q = state.query.trim();
            var matchSearch = !q ||
                s.name.indexOf(q) > -1 ||
                s.description.indexOf(q) > -1;

            return matchFilter && matchSearch;
        });
    }

    /* ============================================
       RENDER CARDS
       ============================================ */
    function renderCards() {
        var grid  = document.getElementById("servicesGrid");
        var empty = document.getElementById("emptyState");
        var label = document.getElementById("resultsLabel");
        if (!grid) return;

        var list = filteredServices();
        grid.innerHTML = "";

        if (list.length === 0) {
            if (empty) empty.hidden = false;
            if (label) label.textContent = "";
            return;
        }

        if (empty) empty.hidden = true;

        if (label) {
            label.textContent =
                "يتم عرض " + toArabicNums(list.length) +
                " خدمة من أصل " + toArabicNums(services.length);
        }

        list.forEach(function (s) {
            var card = document.createElement("div");
            card.className = "service-card";

            var isOnline = s.type === "أونلاين";
            var badgeClass = isOnline ? "card-type-badge online" : "card-type-badge inperson";
            var badgeLabel = isOnline ? "أونلاين" : "حضوري";

            card.innerHTML =
                /* Header row: icon RIGHT, title LEFT */
                '<div class="card-header-row">' +
                    '<div class="card-icon-box">' + getIcon(s.icon) + '</div>' +
                    '<div class="card-title-group">' +
                        '<div class="card-name">' + escHtml(s.name) + '</div>' +
                        '<span class="' + badgeClass + '">' + escHtml(badgeLabel) + '</span>' +
                    '</div>' +
                '</div>' +

                /* Description */
                '<div class="card-desc">' + escHtml(s.description) + '</div>' +

                /* Arrow on hover */
                '<a href="' + escHtml(s.url || '#') + '" class="card-arrow" aria-label="عرض التفاصيل">←</a>';

            grid.appendChild(card);
        });
    }

    /* ============================================
       INIT FILTERS
       ============================================ */
    function initFilters() {
        var tabs = document.querySelectorAll(".filter-tab");
        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                tabs.forEach(function (t) { t.classList.remove("active"); });
                tab.classList.add("active");
                state.filter = tab.dataset.filter;
                renderCards();
            });
        });
    }

    /* ============================================
       INIT SEARCH
       ============================================ */
    function initSearch() {
        var input = document.getElementById("searchInput");
        var clear = document.getElementById("searchClear");
        if (!input) return;

        input.addEventListener("input", function () {
            state.query = input.value;
            if (clear) clear.hidden = !input.value;
            renderCards();
        });

        if (clear) {
            clear.addEventListener("click", function () {
                input.value = "";
                state.query = "";
                clear.hidden = true;
                input.focus();
                renderCards();
            });
        }
    }

    /* ============================================
       EMPTY STATE RESET
       ============================================ */
    function initReset() {
        var btn = document.getElementById("btnReset");
        if (!btn) return;
        btn.addEventListener("click", function () {
            state.filter = "all";
            state.query  = "";
            document.querySelectorAll(".filter-tab").forEach(function (t) {
                t.classList.remove("active");
            });
            var allTab = document.querySelector('[data-filter="all"]');
            if (allTab) allTab.classList.add("active");
            var input = document.getElementById("searchInput");
            if (input) input.value = "";
            var clear = document.getElementById("searchClear");
            if (clear) clear.hidden = true;
            renderCards();
        });
    }

    /* ============================================
       UTILS
       ============================================ */
    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    /* ============================================
       BOOT
       ============================================ */
    function init() {
        renderHeader();
        renderCards();
        initFilters();
        initSearch();
        initReset();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();