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
        GET CURRENT USER ID
========================= */

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
            </div>
            <div class="post-content">
                ${post.content}
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

            <!-- قسم التعليقات -->
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
        alert("يجب تسجيل الدخول أولاً");
        window.location.href = "login.html";
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

        // تحديث الـ UI فوراً بدون reload
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
        alert("فشل تنفيذ اللايك");
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
                <span>${timeAgo(c.createdAt)}</span>
            </div>
            <p class="comment-text" id="comment-text-${c.commentID}">${c.content}</p>

            <!-- حقل التعديل مخفي -->
            <div class="edit-area" id="edit-area-${c.commentID}" style="display:none;">
                <input type="text" id="edit-input-${c.commentID}" value="${c.content}" />
                <button onclick="saveEdit(${c.commentID}, ${postId})">حفظ</button>
                <button onclick="cancelEdit(${c.commentID})">إلغاء</button>
            </div>

            <!-- أزرار تظهر بس لصاحب الكومنت -->
            ${currentUserId === c.userId ? `
            <div class="comment-actions">
                <button onclick="startEdit(${c.commentID})" class="btn-edit">
                    <i class="fa-regular fa-pen-to-square"></i> تعديل
                </button>
                <button onclick="deleteComment(${c.commentID}, ${postId})" class="btn-delete">
                    <i class="fa-regular fa-trash-can"></i> حذف
                </button>
            </div>` : ''}
        </div>
    `).join("");
}



/* =========================

        START EDIT

========================= */

function startEdit(commentId) {
    document.getElementById(`comment-text-${commentId}`).style.display = "none";
    document.getElementById(`edit-area-${commentId}`).style.display = "flex";
}



/* =========================

        CANCEL EDIT

========================= */

function cancelEdit(commentId) {
    document.getElementById(`comment-text-${commentId}`).style.display = "block";
    document.getElementById(`edit-area-${commentId}`).style.display = "none";
}



/* =========================

        SAVE EDIT

========================= */

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
        alert("يجب تسجيل الدخول أولاً");
        window.location.href = "login.html";
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
    const diff = Math.floor((Date.now() - new Date(timestamp + 'Z')) / 1000);
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