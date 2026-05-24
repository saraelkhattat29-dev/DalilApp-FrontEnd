const API_BASE = "https://localhost:7162/api/Services";


// =======================
// تحميل الخدمات من الباك (في مكان منفصل)
// =======================
function loadServices() {
    const container = document.getElementById("apiServices");

    if (!container) return;

    fetch(API_BASE)
        .then(res => res.json())
        .then(result => {

            console.log("API RESULT:", result);

            if (!result || !result.data) return;

            container.innerHTML = "";

            result.data.forEach(service => {
                container.innerHTML += `
          <div class="card">
            <i class="fa-solid fa-file-lines icon"></i>
            <h3>${service.title}</h3>
            <p>${service.description ?? ""}</p>
            <button onclick="showDetails(${service.id})">
              عرض التفاصيل
            </button>
          </div>
        `;
            });
        })
        .catch(err => console.log("Load Error:", err));
}


// =======================
// السيرش (في نفس مكان API فقط)
// =======================
function searchService() {
    let input = document.querySelector(".search-box input").value;

    if (!input.trim()) {
        alert("اكتب اسم الخدمة");
        return;
    }

    const container = document.getElementById("apiServices");

    fetch(`${API_BASE}?search=${encodeURIComponent(input)}`)
        .then(res => res.json())
        .then(result => {

            console.log("SEARCH RESULT:", result);

            if (!result || !result.data) return;

            container.innerHTML = "";

            if (result.data.length === 0) {
                container.innerHTML = "<p>لا توجد نتائج</p>";
                return;
            }

            result.data.forEach(service => {
                container.innerHTML += `
          <div class="card">
            <h3>${service.title}</h3>
            <p>${service.description ?? ""}</p>
            <button onclick="showDetails(${service.id})">
              عرض التفاصيل
            </button>
          </div>
        `;
            });
        })
        .catch(err => console.log("Search Error:", err));
}


// =======================
// تفاصيل خدمة
// =======================
function showDetails(id) {
    fetch(`${API_BASE}/${id}`)
        .then(res => res.json())
        .then(data => {
            alert(
                `📌 ${data.title}\n` +
                `📝 ${data.description}\n` +
                `💰 ${data.fees}`
            );
        })
        .catch(err => console.log(err));
}


// =======================
// اقتراح خدمة (POST)
// =======================
function suggestService() {
    const suggestion = prompt("اكتب الخدمة اللي تحب نضيفها:");
    if (!suggestion || !suggestion.trim()) return;

    fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: suggestion,
            description: suggestion,
            categoryId: 1,
            duration: 1,
            fees: 0,
            isOnline: false,
            executionPlaces: "غير محدد",
            steps: [],
            requiredDocumentIds: []
        })
    })
        .then(res => res.text())
        .then(() => {
            alert("تم إرسال الاقتراح 👍");
        })
        .catch(err => console.log(err));
}


// =======================
// أزرار الكروت الثابتة (بدون API)
// =======================
function attachCardButtons() {
    document.querySelectorAll(".card button").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".card");
            const title = card?.querySelector("h3")?.textContent;
            if (title) alert(`عرض تفاصيل: ${title}`);
        });
    });
}


// =======================
// تشغيل الصفحة
// =======================
function initPageActions() {

    // زر البحث
    const searchButton = document.querySelector(".search-box button");
    if (searchButton) {
        searchButton.addEventListener("click", searchService);
    }

    // اقتراح خدمة
    const suggestButton = document.querySelector(".suggest-btn");
    if (suggestButton) {
        suggestButton.addEventListener("click", suggestService);
    }

    // زر البداية
    const mainButton = document.querySelector(".main-btn");
    if (mainButton) {
        mainButton.addEventListener("click", () => {
            document.querySelector(".services")?.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    // تسجيل دخول
    const loginButton = document.querySelector("header button");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    attachCardButtons();

    loadServices(); // 🔥 تحميل الداتا من الباك
}


// تشغيل بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", initPageActions);