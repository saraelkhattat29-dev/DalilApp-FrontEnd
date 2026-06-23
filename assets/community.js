const postsContainer = document.getElementById("posts");

const colors = ['#DA523B', '#132244', '#5647e6', '#1a9e75', '#e67e22'];

let posts = [];

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function getCurrentUserId() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return parseInt(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
    } catch {
        return null;
    }
}

function updateAuthBtn() {
    const btn = document.getElementById("auth-btn");
    if (!btn) return;

    const token = localStorage.getItem("token");
    if (!token) {
        btn.outerHTML = `<a href="logIn.html" class="login-btn" id="auth-btn">تسجيل الدخول</a>`;
        return;
    }

    try {
        btn.outerHTML = `
    <div class="auth-actions" id="auth-btn">
        <a href="userProfile.html" class="user-icon-btn" title="الملف الشخصي">
            <i class="fa-regular fa-user"></i>
        </a>
        <button class="logout-btn" onclick="logout()" title="تسجيل الخروج">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
    </div>`;
    } catch {
        btn.outerHTML = `<a href="logIn.html" class="login-btn" id="auth-btn">تسجيل الدخول</a>`;
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "logIn.html";
}

function updatePostAvatar() {
    const avatar = document.getElementById("post-avatar");
    if (!avatar) return;
    const token = localStorage.getItem("token");
    if (!token) { avatar.textContent = "?"; return; }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "?";
        avatar.textContent = name.charAt(0).toUpperCase();
    } catch {
        avatar.textContent = "?";
    }
}

/* =========================
        SHOW TOAST
========================= */
function showLoginToast(message) {
    const old = document.getElementById("login-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.id = "login-toast";
    toast.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${message} <a href="logIn.html">سجل دخول</a>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* =========================
        LOAD POSTS
========================= */
async function loadPosts() {
    try {
        const response = await fetch("https://localhost:7162/api/posts");
        if (!response.ok) throw new Error("Failed to load posts");
        posts = await response.json();
        console.log(posts);
        posts.reverse();
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

    const currentUserId = getCurrentUserId();

    const html = posts.map((post, index) => {
        const first = post.userName?.charAt(0) || "?";
        const color = colors[index % colors.length];
        const isLiked = post.likedByCurrentUser;

        return `
        <div class="post" data-post-id="${post.id}">
            <div class="post-header">
    <div class="avatar" style="background:${color}; color:white;">
        ${first}
    </div>

    <div class="info">
        <h3>${post.userName}</h3>
        <span>${timeAgo(post.createdAt)}</span>
    </div>

    ${currentUserId === post.userId ? `
    <div class="post-menu-wrapper">
        <button class="post-menu-btn"
            onclick="togglePostMenu(${post.id})">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <div class="post-dropdown"
            id="post-menu-${post.id}"
            style="display:none;">

        <button onclick="startPostEdit(${post.id}); togglePostMenu(${post.id})">
    <i class="fa-regular fa-pen-to-square"></i>
    تعديل
</button>

            <button onclick="deletePost(${post.id})">
                <i class="fa-regular fa-trash-can"></i>
                حذف
            </button>

        </div>
    </div>
    ` : ''}
</div>
            <div class="post-content"
    id="post-content-${post.id}">
    ${post.content}
</div>

<div class="edit-post-area"
    id="edit-post-area-${post.id}"
    style="display:none;">

    <input type="text"
        id="edit-post-input-${post.id}"
        value="${post.content}" />

    <button onclick="savePostEdit(${post.id})">
        حفظ
    </button>

    <button onclick="cancelPostEdit(${post.id})">
        إلغاء
    </button>
</div>
            <div class="buttons">
                <button class="btn like ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id}, this)">
                    <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="btn comment-btn" onclick="toggleComments(${post.id})">
                    <i class="fa-regular fa-comment"></i>
                    <span>${post.commentsCount} تعليق</span>
                </button>
            </div>

            <div class="comments-section" id="comments-${post.id}" style="display:none;">
                <div class="comments-list" id="comments-list-${post.id}">
                    <p class="loading-text">جاري التحميل...</p>
                </div>
                ${isLoggedIn() ? `
                <div class="add-comment">
                    <input type="text" id="comment-input-${post.id}" placeholder="اكتب تعليق..." />
                    <button onclick="addComment(${post.id})">إرسال</button>
                </div>` : ''}
            </div>
        </div>`;

    }).join("");

    postsContainer.innerHTML = html;
}

/* =========================
        TOGGLE LIKE
========================= */
async function toggleLike(postId, btn) {
    if (!isLoggedIn()) {
        showLoginToast("عشان تعمل لايك");
        return;
    }

    const token = localStorage.getItem("token");
    const icon = btn.querySelector("i");
    const countSpan = btn.querySelector("span");

    try {
        const response = await fetch(`https://localhost:7162/api/posts/${postId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("فشل");

        const text = await response.text();
        const liked = text.includes("Liked");

        if (liked) {
            btn.classList.add("liked");
            icon.classList.replace("fa-regular", "fa-solid");
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
        } else {
            btn.classList.remove("liked");
            icon.classList.replace("fa-solid", "fa-regular");
            countSpan.textContent = parseInt(countSpan.textContent) - 1;
        }

    } catch (error) {
        console.error(error);
        alert("فشل تسجيل اللايك");
    }
}

/* =========================
        TOGGLE COMMENTS
========================= */
async function toggleComments(postId) {
    const section = document.getElementById(`comments-${postId}`);
    const isHidden = section.style.display === "none";

    section.style.display = isHidden ? "block" : "none";

    if (isHidden) {
        await loadComments(postId);
    }
}

/* =========================
        LOAD COMMENTS
========================= */
async function loadComments(postId) {
    try {
        const response = await fetch(`https://localhost:7162/api/comments/posts/${postId}/comments`);
        if (!response.ok) throw new Error("فشل تحميل التعليقات");

        const comments = await response.json();
        renderComments(postId, comments);
    } catch (error) {
        console.error(error);
        document.getElementById(`comments-list-${postId}`).innerHTML =
            '<p class="error-text">فشل تحميل التعليقات</p>';
    }
}

/* =========================
        RENDER COMMENTS
========================= */
function renderComments(postId, comments) {
    const container = document.getElementById(`comments-list-${postId}`);
    const currentUserId = getCurrentUserId();

    if (!comments.length) {
        container.innerHTML = '<p class="no-comments">لا يوجد تعليقات بعد</p>';
        return;
    }

    container.innerHTML = comments.map(c => `
        <div class="comment" id="comment-${c.commentID}">
            <div class="comment-header">
                <strong>${c.userName}</strong>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span>${timeAgo(c.createdAt)}</span>
                    ${currentUserId === c.userId ? `
                    <div class="comment-menu-wrapper">
                        <button class="comment-menu-btn" onclick="toggleMenu(${c.commentID})">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="comment-dropdown" id="menu-${c.commentID}" style="display:none;">
                            <button onclick="startEdit(${c.commentID}); toggleMenu(${c.commentID})">
                                <i class="fa-regular fa-pen-to-square"></i> تعديل
                            </button>
                            <button onclick="deleteComment(${c.commentID}, ${postId}); toggleMenu(${c.commentID})">
                                <i class="fa-regular fa-trash-can"></i> حذف
                            </button>
                        </div>
                    </div>` : ''}
                </div>
            </div>
            <p class="comment-text" id="comment-text-${c.commentID}">${c.content}</p>

            <div class="edit-area" id="edit-area-${c.commentID}" style="display:none;">
                <input type="text" id="edit-input-${c.commentID}" value="${c.content}" />
                <button onclick="saveEdit(${c.commentID}, ${postId})">حفظ</button>
                <button onclick="cancelEdit(${c.commentID})">إلغاء</button>
            </div>
        </div>
    `).join("");
}

function startEdit(commentId) {
    document.getElementById(`comment-text-${commentId}`).style.display = "none";
    document.getElementById(`edit-area-${commentId}`).style.display = "flex";
}

function cancelEdit(commentId) {
    document.getElementById(`comment-text-${commentId}`).style.display = "block";
    document.getElementById(`edit-area-${commentId}`).style.display = "none";
}

async function saveEdit(commentId, postId) {
    const newContent = document.getElementById(`edit-input-${commentId}`).value.trim();
    if (!newContent) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`https://localhost:7162/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content: newContent })
        });

        if (!response.ok) throw new Error("فشل التعديل");

        await loadComments(postId);
    } catch (error) {
        console.error(error);
        alert("فشل تعديل التعليق");
    }
}

/* =========================
        ADD COMMENT
========================= */
async function addComment(postId) {
    if (!isLoggedIn()) {
        showLoginToast("عشان تكتب تعليق");
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const btn = input.nextElementSibling;
    const content = input.value.trim();
    if (!content) return;

    btn.disabled = true;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://localhost:7162/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ postId, content })
        });

        if (!response.ok) throw new Error(await response.text());

        input.value = "";

        const container = document.getElementById(`comments-list-${postId}`);
        container.innerHTML = '<p class="loading-text">جاري التحميل...</p>';
        await loadComments(postId);

    } catch (error) {
        console.error(error);
        alert("فشل إضافة التعليق");
    } finally {
        btn.disabled = false;
    }
}

/* =========================
        DELETE COMMENT
========================= */
async function deleteComment(commentId, postId) {
    if (!confirm("هتحذف التعليق ده؟")) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`https://localhost:7162/api/comments/${commentId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("فشل الحذف");

        await loadComments(postId);
    } catch (error) {
        console.error(error);
        alert("فشل حذف التعليق");
    }
}

/* =========================
        CREATE POST
========================= */
async function addPost() {
    if (!isLoggedIn()) {
        showLoginToast("عشان تعمل بوست");
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
    const diff = Math.floor((Date.now() - new Date(timestamp + 'Z')) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 172800) return "أمس";
    return `منذ ${Math.floor(diff / 86400)} يوم`;
}

/* =========================
        TOGGLE MENU
========================= */
function toggleMenu(commentId) {
    const menu = document.getElementById(`menu-${commentId}`);
    const isOpen = menu.style.display === "block";

    document.querySelectorAll('.comment-dropdown').forEach(d => d.style.display = "none");

    if (!isOpen) menu.style.display = "block";
}

document.addEventListener("click", function (e) {
    if (!e.target.closest('.comment-menu-wrapper')) {
        document.querySelectorAll('.comment-dropdown').forEach(d => d.style.display = "none");
    }
});
function togglePostMenu(postId) {
    const menu = document.getElementById(`post-menu-${postId}`);
    const isOpen = menu.style.display === "block";

    document.querySelectorAll(".post-dropdown")
        .forEach(d => d.style.display = "none");

    if (!isOpen)
        menu.style.display = "block";
}

function startPostEdit(postId) {
    document.getElementById(`post-content-${postId}`).style.display = "none";
    document.getElementById(`edit-post-area-${postId}`).style.display = "flex";
}

function cancelPostEdit(postId) {
    document.getElementById(`post-content-${postId}`).style.display = "block";
    document.getElementById(`edit-post-area-${postId}`).style.display = "none";
}

async function savePostEdit(postId) {

    const content = document
        .getElementById(`edit-post-input-${postId}`)
        .value.trim();

    if (!content) return;

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `https://localhost:7162/api/posts/${postId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: content
                })
            }
        );

        if (!response.ok)
            throw new Error();

        await loadPosts();

    } catch {
        alert("فشل تعديل البوست");
    }
}

async function deletePost(postId) {

    if (!confirm("هتحذف البوست ده؟"))
        return;

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `https://localhost:7162/api/posts/${postId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok)
            throw new Error();

        await loadPosts();

    } catch {
        alert("فشل حذف البوست");
    }
}
/* =========================
        INIT
========================= */
updateAuthBtn();
updatePostAvatar();
loadPosts();