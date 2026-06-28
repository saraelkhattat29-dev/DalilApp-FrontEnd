(function () {
    "use strict";

    /* ============================================
       DATA
       ============================================ */
    const API_BASE = "https://localhost:7162/api";

    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("categoryId");

    let category = {};
    let services = [];

        /* ============================================
        ICONS MAP
        ============================================ */
    var icons = {
        license: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <path d="M3 10l9-7 9 7"/>
        <path d="M5 10v10h14V10"/>
        <path d="M10 20v-6h4v6"/>
    </svg>`,
            card: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <rect x="3" y="7" width="18" height="12" rx="2"/>
        <path d="M9 7V5h6v2"/>
    </svg>`,
        search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        transfer: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,
        car: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>`,
        doc: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <path d="M12 3v18"/>
                <path d="M6 7h12"/>
                <path d="M8 21h8"/>
                <path d="M5 9l-3 4h6z"/>
                <path d="M19 9l-3 4h6z"/>
            </svg>`,
        edit: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        security: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"/>
    </svg>`,
    health: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>
    </svg>`,
    city: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="13" y2="14"/>
    </svg>`,
    learn: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <path d="M2 7l10-5 10 5-10 5-10-5z"/>
        <path d="M6 10v5c0 2 3 4 6 4s6-2 6-4v-5"/>
    </svg>`,
    tmoeen: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <rect x="3" y="6" width="18" height="12" rx="2"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`
    };


    var categoryIcons = {
        "الأحوال المدنية": icons.city,
        "الخدمات القانونية": icons.doc,
        "الإسكان": icons.license,
        "التموين والدعم": icons.tmoeen,
        "المرافق": icons.transfer,
        "الصحة": icons.health,
        "المرور": icons.car,
        "العمل": icons.card,
        "الخدمات الأمنية": icons.security,
        "التعليم": icons.learn
    };
    var defaultIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>';

    /* Arrow icon for button */
    var arrowIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    /* ============================================
       STATE
       ============================================ */
    var state = { filter: "all", query: "" };
    async function loadCategory() {

        const response = await fetch(
            `${API_BASE}/Categories/${categoryId}`
        );

        category = await response.json();
    }
    async function loadServices() {

        const response = await fetch(
            `${API_BASE}/Services?categoryId=${categoryId}&pageSize=100`
        );

        const result = await response.json();

        services = result.data.map(service => ({
            id: service.id,
            name: service.title,
            description: service.description,
            type: service.isOnline ? "أونلاين" : "حضوري",
            categoryName: service.categoryName,
            url: `servicePage.html?id=${service.id}`
        }));
        renderCards();
    }

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
    function getCategoryIcon() {

        switch (category.name) {

            case "الأحوال المدنية":
                return icons.card;

            case "المرور":
                return icons.car;

            case "التعليم":
                return icons.doc;

            case "الصحة":
                return icons.alert;

            case "الإسكان":
                return icons.license;

            case "التموين والدعم":
                return icons.card;

            case "الخدمات القانونية":
                return icons.doc;

            case "العمل":
                return icons.card;

            case "الخدمات الأمنية":
                return icons.alert;

            case "المرافق":
                return icons.transfer;

            default:
                return defaultIcon;
        }
    }

    /* ============================================
       RENDER HEADER
       ============================================ */
    function renderHeader() {
        setText("catTitle", category.name);
        setText(
            "catDesc",
            `جميع خدمات ${category.name} المتاحة`
        );
    }

    /* ============================================
       FILTER LOGIC
       ============================================ */
    function filteredServices() {
        return services.filter(function (s) {
            var matchFilter =
                state.filter === "all" ||
                (state.filter === "أونلاين" && s.type === "أونلاين") ||
                (state.filter === "حضوري" && s.type === "حضوري");

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
        var grid = document.getElementById("servicesGrid");
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

            var card = document.createElement("a");
            card.className = "service-card";
            card.href = s.url || '#';
            var isOnline = s.type === "أونلاين";
            var badgeClass = isOnline ? "card-type-badge online" : "card-type-badge inperson";
            var badgeLabel = isOnline ? "أونلاين" : "حضوري";
            console.log('category icons', categoryIcons);
            console.log('service', s);

            card.innerHTML =
                /* Header row: icon RIGHT, title LEFT */
                '<div class="card-header-row">' +
                '<div class="card-icon-box">' +
                (categoryIcons[s.categoryName] || defaultIcon) +
                '</div>' +
                '<div class="card-title-group">' +
                '<div class="card-name">' + escHtml(s.name) + '</div>' +
                '<span class="' + badgeClass + '">' + escHtml(badgeLabel) + '</span>' +
                '</div>' +
                '</div>' +

                /* Description */
                '<div class="card-desc">' + escHtml(s.description) + '</div>' +

                /* Arrow on hover */
                '<div class="card-arrow">←</div>';

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
            state.query = "";
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
    async function init() {

        await loadCategory();

        await loadServices();

        renderHeader();

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