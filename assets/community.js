const postsContainer = document.getElementById("posts");
const colors = ['#DA523B', '#132244', '#5647e6', '#1a9e75', '#e67e22'];
let posts = [];

/* =========================
        CHECK LOGIN
========================= */
function isLoggedIn() {
    return !!localStorage.getItem("token");
}

/* =========================
        LOAD POSTS
========================= */
async function loadPosts() {
    try {
        const response = await fetch("https://localhost:7162/api/posts");
        if (!response.ok) throw new Error("Failed to load posts");
        posts = await response.json();
        renderPosts();
    } catch (error) {
        console.error(error);
        alert("فشل تحميل البوستات");
    }
}

/* =========================
        RENDER POSTS
========================= */
function renderPosts() {
    postsContainer.innerHTML = "";

    const html = posts.map((post, index) => {
        const first = post.userName?.charAt(0) || "?";
        const color = colors[index % colors.length];
        return `
        <div class="post">
            <div class="post-header">
                <div class="avatar" style="background:${color}; color:white;">
                    ${first}
                </div>
                <div class="info">
                    <h3>${post.userName}</h3>
                    <span>${timeAgo(post.createdAt)}</span>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="buttons">
                <button class="btn like">
                    <i class="fa-regular fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="btn comment-btn">
                    <i class="fa-regular fa-comment"></i>
                    <span>${post.commentsCount} تعليق</span>
                </button>
            </div>
        </div>`;
    }).join("");

    postsContainer.innerHTML = html;
}

/* =========================
        CREATE POST
========================= */
async function addPost() {
    if (!isLoggedIn()) {
        alert("يجب تسجيل الدخول أولاً");
        window.location.href = "login.html";
        return;
    }

    const text = document.getElementById("postText").value.trim();
    if (!text) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://localhost:7162/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                content: text,
                serviceId: null
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        document.getElementById("postText").value = "";
        await loadPosts();
    } catch (error) {
        console.error(error);
        alert("فشل إنشاء البوست");
    }
}

/* =========================
        TIME AGO
========================= */
function timeAgo(timestamp) {
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 172800) return "أمس";
    return `منذ ${Math.floor(diff / 86400)} يوم`;
}

/* =========================
        INIT
========================= */
loadPosts();