const postsContainer = document.getElementById("posts");

const colors = ['#DA523B', '#132244', '#5647e6', '#1a9e75', '#e67e22'];

let posts = [
    {
        name: "طارق عبدالله",
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        tag: "السجل التجاري",
        text: "نصيحة ذهبية لأي حاجة في السجل التجاري: روح الساعة 8 الصبح أول ما يفتحوا.",
        likes: 89,
        comments: ["شكراً على النصيحة"]
    },
    {
        name: "سارة إبراهيم",
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        tag: "رخصة القيادة",
        text: "محتاج أجدد رخصة قيادتي. الكشف لازم يكون حكومي؟",
        likes: 13,
        comments: ["أي مستشفى معتمد ينفع", "مش شرط حكومي"]
    },
    {
        name: "محمد حسن",
        timestamp: Date.now() - 1000 * 60 * 60 * 48,
        tag: "جواز السفر",
        text: "جددت جواز السفر في الشهر اللي فات، الموضوع أسهل بكتير من زمان. حجزت أونلاين وخلصت في ساعتين.",
        likes: 142,
        comments: ["أنا كمان تجربتي كانت كويسة", "امتى فتحوا الحجز الأونلاين ده؟"]
    },
    {
        name: "نورا أحمد",
        timestamp: Date.now() - 1000 * 60 * 60 * 72,
        tag: "بطاقة رقم قومي",
        text: "عندي سؤال، لو البطاقة اتسرقت إيه الخطوات الأولانية؟ وهل لازم بلاغ شرطة الأول؟",
        likes: 37,
        comments: ["أيوه لازم بلاغ شرطة أول حاجة", "وبعدين روح مكتب الشهر العقاري"]
    },
    {
        name: "خالد منصور",
        timestamp: Date.now() - 1000 * 60 * 60 * 96,
        tag: "شهادة الميلاد",
        text: "استخرجت شهادة ميلاد لابني بالأوراق دي: شهادة المستشفى + بطاقة الوالدين + عقد الزواج. خلصت في نص ساعة.",
        likes: 58,
        comments: ["جزاك الله خيراً على المعلومة"]
    }
];

function timeAgo(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60)     return "الآن";
    if (diff < 3600)   return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400)  return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 172800) return "أمس";
    return `منذ ${Math.floor(diff / 86400)} يوم`;
}

renderPosts();

function renderPosts() {
    postsContainer.innerHTML = "";
    posts.forEach((post, index) => {
        const first = post.name.charAt(0);
        const color = colors[index % colors.length];
        postsContainer.innerHTML += `
<div class="post">
    <div class="post-header">
        <div class="avatar" style="background:${color}; color:white;">${first}</div>
        <div class="info">
            <h3>${post.name}</h3>
            <span>${timeAgo(post.timestamp)}</span>
        </div>
    </div>
    <span class="post-tag">${post.tag}</span>
    <div class="post-content">${post.text}</div>
    <div class="buttons">
        <button class="btn like ${post.liked ? 'active' : ''}" onclick="likePost(${index})">
            <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            <span>${post.likes}</span>
        </button>
        <button class="btn comment-btn" onclick="toggleComments(${index})">
            <i class="fa-regular fa-comment"></i>
            <span>${post.comments.length} تعليق</span>
        </button>
    </div>
    <div class="comments" id="comments-${index}">
        ${post.comments.map(c => `<div class="comment">${c}</div>`).join("")}
        <div class="add-comment">
            <input type="text" id="comment-input-${index}" placeholder="اكتب تعليق">
            <button onclick="addComment(${index})">إرسال</button>
        </div>
    </div>
</div>`;
    });
}

function likePost(index) {
    if (posts[index].liked) {
        posts[index].likes--;
        posts[index].liked = false;
    } else {
        posts[index].likes++;
        posts[index].liked = true;
    }
    renderPosts();
}

function toggleComments(index) {
    const box = document.getElementById(`comments-${index}`);
    box.style.display = box.style.display === "block" ? "none" : "block";
}

function addComment(index) {
    const input = document.getElementById(`comment-input-${index}`);
    if (input.value.trim() === "") return;
    posts[index].comments.push(input.value);
    renderPosts();
    document.getElementById(`comments-${index}`).style.display = "block";
}

function addPost() {
    const text = document.getElementById("postText").value;
    const name = document.getElementById("userName").value || "أنت";
    if (text.trim() === "") return;
    posts.unshift({
        name: name,
        timestamp: Date.now(),
        tag: "عام",
        text: text,
        likes: 0,
        comments: []
    });
    document.getElementById("postText").value = "";
    document.getElementById("userName").value = "";
    renderPosts();
}

setInterval(renderPosts, 5000);