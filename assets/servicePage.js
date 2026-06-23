(function () {
    "use strict";

    const API_BASE = "https://localhost:7162/api";

    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("id");

    let service = {};
    async function loadService() {

        const response = await fetch(
            `${API_BASE}/Services/${serviceId}`
        );

        if (!response.ok) {
            console.error("Service not found");
            return;
        }

        service = await response.json();

        renderHeader();
        renderSummary();
        renderDescription();
        renderUrl();
        renderSteps();
        renderDocs();
        renderLocations();
    }

    var arabicNums = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"];
    function arNum(n) { return arabicNums[n - 1] || String(n); }

    function renderHeader() {
        setText("headerTitle", service.title);
    }
    function renderSummary() {

        setText("sumCategory", service.categoryName);

        setText(
            "sumType",
            service.isOnline ? "أونلاين" : "حضوري"
        );

        setText("sumFees", service.fees);

        setText("sumDuration", service.duration);
    }


    function renderDescription() {
        setText("descText", service.description || "");
    }

    function renderUrl() {
        var section = document.getElementById("urlSection");
        if (!section) return;

        var isOnline = service.isOnline;
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

        if (!list || !service.steps?.length) return;

        list.innerHTML = "";

        service.steps.forEach(function (step, i) {

            var li = document.createElement("li");

            li.className = "step-item";

            li.innerHTML =
                '<div class="step-num">' + arNum(i + 1) + '</div>' +
                '<div class="step-body">' +
                '<strong>الخطوة ' + arNum(i + 1) + '</strong>' +
                '<span>' + escHtml(step) + '</span>' +
                '</div>';

            list.appendChild(li);
        });
    }

    function renderDocs() {

        var list = document.getElementById("docsList");

        if (!list || !service.requiredDocuments?.length)
            return;

        list.innerHTML = "";

        service.requiredDocuments.forEach(function (doc) {

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

        if (!service.executionPlaces || !service.executionPlaces.length) {
            card.style.display = "none";
            return;
        }

        list.innerHTML = "";

        service.executionPlaces.forEach(function (loc) {

            var mapsUrl = loc.url || "#";

            var li = document.createElement("li");

            li.className = "location-item";

            li.innerHTML =
                '<div class="loc-info">' +
                '<strong>' + escHtml(loc.name) + '</strong>' +
                '<span>' + escHtml(loc.url || "") + '</span>' +
                '</div>' +
                '<a href="' + mapsUrl + '" target="_blank" rel="noopener" class="map-btn">' +
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

    async function init() {

        await loadService();

        initCopyBtn();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();