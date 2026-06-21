// ===== API CONFIG =====
const API_BASE = 'https://localhost:7162/api';

function getToken() {
    return localStorage.getItem('token'); // غيّري الاسم لو التوكن متخزن بمسمى تاني
}

async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    let data = null;
    try { data = await res.json(); } catch (e) { }

    if (!res.ok) {
        throw new Error((data && data.message) || data || 'حدث خطأ في الاتصال بالسيرفر');
    }
    return data;
}
// ===== DATA =====
let categoriesData = [];
async function loadCategories() {
    try {
        categoriesData = await apiRequest('/Categories', 'GET');
        renderCategoriesTable();
        refreshCatSelect();
    } catch (err) {
        showToast('error', `<i class="fa-solid fa-triangle-exclamation"></i> ${err.message}`);
    }
}

let servicesData = [
    {
        id: 1,
        name: 'استخراج بطاقة الرقم القومي',
        category: 'الأحوال المدنية',
        fees: '25 جنيه',
        type: 'اونلاين',
        duration: '3 أيام عمل',
        docs: ['بطاقة الرقم القومي القديمة', 'صورة شخصية'],
        url: '',
        steps: ['تسجيل الدخول على بوابة مصر الرقمية', 'اختيار خدمة استخراج البطاقة', 'رفع المستندات المطلوبة', 'سداد الرسوم إلكترونياً', 'استلام البطاقة بالبريد أو من مكتب السجل المدني'],
        locationName: 'مديرية الأحوال المدنية',
        locationAddress: 'شارع الجمهورية، أسيوط'
    },
    {
        id: 2,
        name: 'تجديد جواز السفر',
        category: 'الجوازات',
        fees: '250 جنيه',
        type: 'اونلاين',
        duration: '7 أيام عمل',
        docs: ['جواز السفر القديم', 'بطاقة الرقم القومي', 'صور شخصية'],
        url: '',
        steps: ['تحديد موعد عبر موقع الجوازات', 'تجهيز المستندات المطلوبة', 'الحضور في الموعد المحدد', 'سداد الرسوم', 'استلام الجواز خلال المدة المحددة'],
        locationName: 'مصلحة الجوازات والهجرة والجنسية',
        locationAddress: 'شارع الستين، أسيوط'
    },
    {
        id: 3,
        name: 'التسجيل في المدارس الحكومية',
        category: 'التعليم',
        fees: 'مجاناً',
        type: 'اونلاين',
        duration: 'فوري',
        docs: ['شهادة الميلاد', 'بطاقة ولي الأمر'],
        url: '',
        steps: ['الدخول على بوابة التعليم الإلكترونية', 'اختيار المرحلة الدراسية', 'تحديد المدرسة المناسبة', 'رفع المستندات', 'تأكيد التسجيل واستلام الرقم المرجعي'],
        locationName: '',
        locationAddress: ''
    },
    {
        id: 4,
        name: 'استخراج شهادة الميلاد',
        category: 'الأحوال المدنية',
        fees: '15 جنيه',
        type: 'اوفلاين',
        duration: 'فوري',
        docs: ['إشعار الولادة من المستشفى', 'بطاقة الأب'],
        url: '',
        steps: ['التوجه لمكتب السجل المدني المختص', 'تقديم إشعار الولادة وبطاقة الأب', 'سداد الرسوم المقررة', 'استلام شهادة الميلاد فوراً'],
        locationName: 'مكتب السجل المدني',
        locationAddress: 'شارع طلعت حرب، أسيوط'
    },
    {
        id: 5,
        name: 'سداد فواتير الكهرباء',
        category: 'المرافق',
        fees: 'مجاناً',
        type: 'اونلاين',
        duration: 'فوري',
        docs: ['رقم العداد', 'وسيلة دفع إلكترونية'],
        url: '',
        steps: ['الدخول على تطبيق أو موقع الشركة', 'إدخال رقم العداد', 'مراجعة الفاتورة', 'اختيار وسيلة الدفع', 'تأكيد العملية واستلام الإيصال'],
        locationName: '',
        locationAddress: ''
    }
];

const suggestions = [
    { name: 'تجديد رخصة القيادة إلكترونياً', submitter: 'أحمد محمود سعيد', date: '2 مايو 2026', category: 'المرور', type: 'اونلاين', status: 'جديد', description: 'إتاحة تجديد رخصة القيادة بالكامل عبر الإنترنت دون الحاجة لزيارة مكتب المرور، مع دفع الرسوم إلكترونياً واستلام الرخصة بالبريد.', docs: ['بطاقة الرقم القومي سارية المفعول', 'رخصة القيادة القديمة', 'شهادة اللياقة الطبية', 'صورة شخصية حديثة', 'إيصال سداد الرسوم'] },
    { name: 'حجز المواعيد الطبية بالمستشفيات الحكومية', submitter: 'منى إبراهيم عبدالله', date: '1 مايو 2026', category: 'الصحة', type: 'اونلاين', status: 'جديد', description: 'نظام لحجز المواعيد الطبية في المستشفيات الحكومية إلكترونياً لتقليل الازدحام وتوفير وقت المواطنين.', docs: ['بطاقة الرقم القومي', 'بطاقة التأمين الصحي', 'ملف طبي سابق (إن وجد)'] },
    { name: 'استخراج صحيفة الحالة الجنائية أونلاين', submitter: 'محمد علي حسن', date: '29 أبريل 2026', category: 'الأحوال المدنية', type: 'اونلاين', status: 'قيد المراجعة', description: 'استخراج صحيفة الحالة الجنائية عبر البوابة الإلكترونية بدلاً من الحضور الشخصي لمقر الشرطة.', docs: ['بطاقة الرقم القومي سارية المفعول', 'طلب رسمي موقع', 'إيصال سداد الرسوم'] },
    { name: 'دفع الغرامات المرورية عبر التطبيق', submitter: 'سارة خالد محمود', date: '27 أبريل 2026', category: 'المرور', type: 'اونلاين', status: 'جديد', description: 'إمكانية سداد غرامات المخالفات المرورية عبر تطبيق الجوال أو الموقع الإلكتروني مباشرة.', docs: ['رقم لوحة السيارة', 'رقم المخالفة', 'وسيلة دفع إلكترونية'] }
];

let editingCatId = null;
let editingServiceId = null;
let pendingDeleteId = null;
let pendingDeleteType = null;

// ===== GOOGLE MAPS URL BUILDER =====
function buildMapsUrl(name, address) {
    const query = [name, address].filter(Boolean).join('، ');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

// ===== SIDEBAR =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
}

// ===== NAVIGATION =====
function showSection(id, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('section-' + id).classList.add('active');
    if (el) el.classList.add('active');
    closeSidebar();

    const titles = {
        'dashboard': ['لوحة التحكم', 'نظرة عامة على المنظومة'],
        'services': ['إدارة الخدمات', 'عرض وتعديل جميع الخدمات'],
        'add-service': ['إضافة خدمة', 'إضافة خدمة حكومية جديدة'],
        'categories': ['إدارة التصنيفات', 'إضافة وتعديل وحذف التصنيفات'],
        'suggestions': ['الاقتراحات', 'مراجعة اقتراحات المواطنين']
    };
    if (titles[id]) {
        document.getElementById('page-title').childNodes[0].textContent = titles[id][0];
        document.getElementById('page-sub').textContent = titles[id][1];
    }
}

function goAddService() {
    clearForm();
    showSection('add-service', document.querySelectorAll('.nav-item')[2]);
    document.getElementById('back-to-services').style.display = 'none';
}

// ===== CATEGORY SELECT =====
function refreshCatSelect() {
    const sel = document.getElementById('svc-cat');
    const cur = sel.value;
    sel.innerHTML = '<option value="">اختر الفئة</option>' +
        categoriesData.map(c =>
            `<option value="${c.name}" ${c.name === cur ? 'selected' : ''}>${c.name}</option>`
        ).join('');
}

// ===== CATEGORIES CRUD =====
function renderCategoriesTable() {
    document.getElementById('cat-tbody').innerHTML = categoriesData.map((c, i) => {
        const count = servicesData.filter(s => s.category === c.name).length;
        return `
      <tr>
        <td class="td-num">${String(i + 1).padStart(2, '0')}</td>
        <td><strong>${c.name}</strong></td>
        <td>${count} خدمة</td>
        <td>
          <div class="actions-cell">
<button class="icon-btn edit"   onclick="startEditCategory(${c.id})"><i class="fa-solid fa-pen"></i></button>            <button class="icon-btn delete" onclick="confirmDeleteCat(${c.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
}

async function saveCategory() {
    const name = document.getElementById('cat-name').value.trim();
    if (!name) { showToast('error', '<i class="fa-solid fa-triangle-exclamation"></i> يرجى إدخال اسم التصنيف'); return; }

    try {
        if (editingCatId) {
            await apiRequest(`/Categories/${editingCatId}`, 'PUT', { id: editingCatId, name });
            showToast('success', `<i class="fa-solid fa-circle-check"></i> تم تعديل التصنيف "${name}" بنجاح`);
        } else {
            await apiRequest('/Categories', 'POST', { id: 0, name });
            showToast('success', `<i class="fa-solid fa-circle-check"></i> تمت إضافة التصنيف "${name}" بنجاح`);
        }
        cancelCatEdit();
        await loadCategories();
    } catch (err) {
        showToast('error', `<i class="fa-solid fa-triangle-exclamation"></i> ${err.message}`);
    }
}

function cancelCatEdit() {
    editingCatId = null;
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-form-title').innerHTML = '<i class="fa-solid fa-folder-plus"></i> إضافة تصنيف جديد';
    document.getElementById('cat-save-btn').innerHTML = '<i class="fa-solid fa-circle-check"></i> إضافة';
    document.getElementById('cat-cancel-btn').style.display = 'none';
}

function startEditCategory(id) {
    const c = categoriesData.find(x => x.id === id);
    if (!c) return;
    editingCatId = id;
    document.getElementById('cat-name').value = c.name;
    document.getElementById('cat-form-title').innerHTML = '<i class="fa-solid fa-pen"></i> تعديل التصنيف';
    document.getElementById('cat-save-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> حفظ التعديلات';
    document.getElementById('cat-cancel-btn').style.display = 'inline-flex';
    document.getElementById('cat-name').focus();
}


function confirmDeleteCat(id) {
    const c = categoriesData.find(x => x.id === id);
    if (!c) return;
    const usedCount = servicesData.filter(s => s.category === c.name).length;
    pendingDeleteId = id;
    pendingDeleteType = 'cat';
    document.getElementById('modal-title').innerHTML = '<i class="fa-solid fa-trash" style="margin-left:8px"></i> حذف التصنيف';
    document.getElementById('modal-body').innerHTML = `
    <div class="delete-modal-body">
    <div class="delete-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
    <h4>هل أنت متأكد من الحذف؟</h4>
    <p>سيتم حذف تصنيف <span class="delete-service-name">"${c.name}"</span> بشكل نهائي.<br>
    ${usedCount > 0
            ? `<strong style="color:var(--red)">تحذير: ${usedCount} خدمة مرتبطة بهذا التصنيف!</strong>`
            : 'لا توجد خدمات مرتبطة بهذا التصنيف.'}</p>
    </div>`;
    document.getElementById('modal-footer').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()"><i class="fa-solid fa-xmark"></i> إلغاء</button>
    <button class="btn btn-danger"  onclick="executeDelete()"><i class="fa-solid fa-trash"></i> نعم، احذف</button>`;
    document.getElementById('modal-overlay').classList.add('open');
}

// ===== SERVICES CRUD =====
function renderServicesTable() {
    const typeBadge = { 'اونلاين': 'badge-green', 'اوفلاين': 'badge-red' };
    const palette = ['badge-navy', 'badge-purple', 'badge-green', 'badge-gold', 'badge-red'];
    const catBadge = {};
    categoriesData.forEach((c, i) => catBadge[c.name] = palette[i % palette.length]);

    document.querySelector('#section-services table tbody').innerHTML =
        servicesData.map((s, i) => `
      <tr>
        <td class="td-num">${String(i + 1).padStart(2, '0')}</td>
        <td><strong>${s.name}</strong></td>
        <td><span class="badge ${catBadge[s.category] || 'badge-navy'}">${s.category}</span></td>
        <td><span class="${s.fees === 'مجاناً' ? 'fee-free' : 'fee-green'}">${s.fees}</span></td>
        <td><span class="badge ${typeBadge[s.type] || 'badge-navy'}">${s.type}</span></td>
        <td>
          <div class="actions-cell">
            <button class="icon-btn edit"   onclick="editService(${s.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn delete" onclick="confirmDelete(${s.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');

    document.querySelector('#section-services .section-header p').textContent =
        `جميع الخدمات الحكومية المتاحة (${servicesData.length} خدمة)`;
}

function editService(id) {
    const s = servicesData.find(x => x.id === id);
    if (!s) return;
    editingServiceId = id;
    refreshCatSelect();
    document.getElementById('svc-name').value = s.name;
    document.getElementById('svc-cat').value = s.category;
    document.getElementById('svc-type').value = s.type;
    document.getElementById('svc-fees').value = s.fees;
    document.getElementById('svc-duration').value = s.duration;
    document.getElementById('svc-url').value = s.url;
    document.getElementById('svc-location-name').value = s.locationName || '';
    document.getElementById('svc-location-address').value = s.locationAddress || '';
    updateLocationPreview();
    setDocsInForm(s.docs || []);
    setStepsInForm(s.steps || []);
    document.querySelector('#section-add-service .section-header h2').textContent = 'تعديل الخدمة';
    document.querySelector('#section-add-service .section-header p').textContent = 'قم بتعديل بيانات الخدمة ثم اضغط حفظ';
    document.getElementById('btn-add-service').style.display = 'none';
    document.getElementById('btn-save-service').style.display = 'inline-flex';
    document.getElementById('back-to-services').style.display = 'flex';
    showSection('add-service', document.querySelectorAll('.nav-item')[2]);
    showToast('edit', '<i class="fa-solid fa-pen"></i> جاري تعديل الخدمة...');
}

function addService() {
    const name = document.getElementById('svc-name').value.trim();
    if (!name) { showToast('error', '<i class="fa-solid fa-triangle-exclamation"></i> يرجى إدخال اسم الخدمة'); return; }
    const newId = servicesData.length ? Math.max(...servicesData.map(x => x.id)) + 1 : 1;
    servicesData.push({
        id: newId, name,
        category: document.getElementById('svc-cat').value || 'غير محدد',
        type: document.getElementById('svc-type').value || 'غير محدد',
        fees: document.getElementById('svc-fees').value || 'مجاناً',
        duration: document.getElementById('svc-duration').value || '',
        url: document.getElementById('svc-url').value || '',
        docs: getDocsFromForm(),
        steps: getStepsFromForm(),
        locationName: document.getElementById('svc-location-name').value.trim(),
        locationAddress: document.getElementById('svc-location-address').value.trim()
    });
    showToast('success', `<i class="fa-solid fa-circle-check"></i> تمت إضافة "${name}" بنجاح!`);
    clearForm();
    renderServicesTable();
    showSection('services', document.querySelectorAll('.nav-item')[1]);
}

function saveService() {
    const name = document.getElementById('svc-name').value.trim();
    if (!name) { showToast('error', '<i class="fa-solid fa-triangle-exclamation"></i> يرجى إدخال اسم الخدمة'); return; }
    const s = servicesData.find(x => x.id === editingServiceId);
    if (s) {
        s.name = name;
        s.category = document.getElementById('svc-cat').value || s.category;
        s.type = document.getElementById('svc-type').value || s.type;
        s.fees = document.getElementById('svc-fees').value || s.fees;
        s.duration = document.getElementById('svc-duration').value || s.duration;
        s.url = document.getElementById('svc-url').value;
        s.docs = getDocsFromForm();
        s.steps = getStepsFromForm();
        s.locationName = document.getElementById('svc-location-name').value.trim();
        s.locationAddress = document.getElementById('svc-location-address').value.trim();
    }
    showToast('success', `<i class="fa-solid fa-circle-check"></i> تم حفظ تعديلات "${name}" بنجاح!`);
    clearForm();
    renderServicesTable();
    showSection('services', document.querySelectorAll('.nav-item')[1]);
}

function clearForm() {
    ['svc-name', 'svc-fees', 'svc-duration', 'svc-url', 'svc-location-name', 'svc-location-address'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    const t = document.getElementById('svc-type'); if (t) t.selectedIndex = 0;
    refreshCatSelect();
    setDocsInForm([]);
    setStepsInForm([]);
    updateLocationPreview();
    editingServiceId = null;
    document.querySelector('#section-add-service .section-header h2').textContent = 'إضافة خدمة جديدة';
    document.querySelector('#section-add-service .section-header p').textContent = 'أدخل بيانات الخدمة الحكومية الجديدة';
    document.getElementById('btn-add-service').style.display = 'inline-flex';
    document.getElementById('btn-save-service').style.display = 'none';
    document.getElementById('back-to-services').style.display = 'none';
}

function confirmDelete(id) {
    const s = servicesData.find(x => x.id === id);
    if (!s) return;
    pendingDeleteId = id;
    pendingDeleteType = 'service';
    document.getElementById('modal-title').innerHTML = '<i class="fa-solid fa-trash" style="margin-left:8px"></i> حذف الخدمة';
    document.getElementById('modal-body').innerHTML = `
    <div class="delete-modal-body">
      <div class="delete-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h4>هل أنت متأكد من الحذف؟</h4>
      <p>سيتم حذف خدمة <span class="delete-service-name">"${s.name}"</span> بشكل نهائي<br>
      ولا يمكن التراجع عن هذا الإجراء.</p>
    </div>`;
    document.getElementById('modal-footer').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()"><i class="fa-solid fa-xmark"></i> إلغاء</button>
    <button class="btn btn-danger"  onclick="executeDelete()"><i class="fa-solid fa-trash"></i> نعم، احذف</button>`;
    document.getElementById('modal-overlay').classList.add('open');
}

async function executeDelete() {
    if (pendingDeleteType === 'cat') {
        try {
            await apiRequest(`/Categories/${pendingDeleteId}`, 'DELETE');
            closeModal();
            await loadCategories();
            showToast('error', '<i class="fa-solid fa-trash"></i> تم حذف التصنيف بنجاح');
        } catch (err) {
            closeModal();
            showToast('error', `<i class="fa-solid fa-triangle-exclamation"></i> ${err.message}`);
        }
    } else {
        const idx = servicesData.findIndex(x => x.id === pendingDeleteId);
        const name = servicesData[idx]?.name || '';
        if (idx !== -1) servicesData.splice(idx, 1);
        closeModal(); renderServicesTable();
        showToast('error', `<i class="fa-solid fa-trash"></i> تم حذف "${name}" بنجاح`);
    }
}

// ===== DOCS HELPERS =====
function addDocField(value = '') {
    const row = document.createElement('div');
    row.className = 'doc-input-row';
    row.innerHTML = `
    <input type="text" placeholder="مثال: صورة شخصية حديثة" class="doc-input" value="${value}">
    <button class="doc-remove-btn" onclick="removeDocField(this)"><i class="fa-solid fa-minus"></i></button>`;
    document.getElementById('docs-input-list').appendChild(row);
}
function removeDocField(btn) {
    const list = document.getElementById('docs-input-list');
    if (list.querySelectorAll('.doc-input-row').length > 1) btn.closest('.doc-input-row').remove();
}
function getDocsFromForm() {
    return Array.from(document.querySelectorAll('.doc-input'))
        .map(i => i.value.trim()).filter(v => v !== '');
}
function setDocsInForm(arr) {
    const list = document.getElementById('docs-input-list');
    list.innerHTML = '';
    (arr && arr.length ? arr : ['']).forEach((doc, i) => {
        const row = document.createElement('div');
        row.className = 'doc-input-row';
        if (i === 0) {
            row.innerHTML = `
        <input type="text" placeholder="مثال: بطاقة الرقم القومي" class="doc-input" value="${doc}">
        <button class="doc-add-btn" onclick="addDocField()"><i class="fa-solid fa-plus"></i></button>`;
        } else {
            row.innerHTML = `
        <input type="text" placeholder="مثال: صورة شخصية حديثة" class="doc-input" value="${doc}">
        <button class="doc-remove-btn" onclick="removeDocField(this)"><i class="fa-solid fa-minus"></i></button>`;
        }
        list.appendChild(row);
    });
}

// ===== STEPS HELPERS =====
function addStepField(value = '') {
    const list = document.getElementById('steps-input-list');
    const rows = list.querySelectorAll('.step-input-row');
    const num = rows.length + 1;
    const row = document.createElement('div');
    row.className = 'step-input-row';
    row.innerHTML = `
    <span class="step-num-badge">${num}</span>
    <input type="text" placeholder="مثال: تسجيل الدخول على البوابة الإلكترونية" class="step-input" value="${value}">
    <button class="doc-remove-btn" onclick="removeStepField(this)"><i class="fa-solid fa-minus"></i></button>`;
    list.appendChild(row);
    updateStepNumbers();
}

function removeStepField(btn) {
    const list = document.getElementById('steps-input-list');
    if (list.querySelectorAll('.step-input-row').length > 1) {
        btn.closest('.step-input-row').remove();
        updateStepNumbers();
    }
}

function updateStepNumbers() {
    document.querySelectorAll('#steps-input-list .step-num-badge').forEach((badge, i) => {
        badge.textContent = i + 1;
    });
}

function getStepsFromForm() {
    return Array.from(document.querySelectorAll('.step-input'))
        .map(i => i.value.trim()).filter(v => v !== '');
}

function setStepsInForm(arr) {
    const list = document.getElementById('steps-input-list');
    list.innerHTML = '';
    (arr && arr.length ? arr : ['']).forEach((step, i) => {
        const row = document.createElement('div');
        row.className = 'step-input-row';
        if (i === 0) {
            row.innerHTML = `
        <span class="step-num-badge">1</span>
        <input type="text" placeholder="مثال: الدخول على الموقع الإلكتروني" class="step-input" value="${step}">
        <button class="doc-add-btn" onclick="addStepField()"><i class="fa-solid fa-plus"></i></button>`;
        } else {
            row.innerHTML = `
        <span class="step-num-badge">${i + 1}</span>
        <input type="text" placeholder="مثال: رفع المستندات المطلوبة" class="step-input" value="${step}">
        <button class="doc-remove-btn" onclick="removeStepField(this)"><i class="fa-solid fa-minus"></i></button>`;
        }
        list.appendChild(row);
    });
}

// ===== LOCATION PREVIEW =====
function updateLocationPreview() {
    const name = document.getElementById('svc-location-name').value.trim();
    const address = document.getElementById('svc-location-address').value.trim();
    const preview = document.getElementById('location-preview');
    const previewText = document.getElementById('location-preview-text');
    const previewLink = document.getElementById('location-preview-link');

    if (name || address) {
        const label = [name, address].filter(Boolean).join(' — ');
        previewText.textContent = label;
        previewLink.href = buildMapsUrl(name, address);
        preview.classList.add('show');
    } else {
        preview.classList.remove('show');
    }
}

// ===== SUGGESTIONS MODAL =====
function openModal(idx) {
    const s = suggestions[idx];
    const statusClass = s.status === 'جديد' ? 'badge-gold' : 'badge-navy';
    const docsHtml = s.docs.map(d =>
        `<div class="doc-item"><i class="fa-regular fa-file-lines"></i>${d}</div>`).join('');

    document.getElementById('modal-title').textContent = 'تفاصيل الاقتراح';
    document.getElementById('modal-body').innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title"><i class="fa-solid fa-circle-info"></i> معلومات الخدمة المقترحة</div>
      <div class="detail-grid">
        <div class="detail-item full">
          <div class="detail-label">اسم الخدمة</div>
          <div class="detail-value" style="font-size:15px">${s.name}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">التصنيف</div>
          <div class="detail-value"><span class="badge badge-navy">${s.category}</span></div>
        </div>
        <div class="detail-item">
          <div class="detail-label">نوع الخدمة</div>
          <div class="detail-value"><span class="badge badge-green">${s.type}</span></div>
        </div>
        <div class="detail-item full">
          <div class="detail-label">الوصف</div>
          <div class="detail-value" style="font-weight:400;color:var(--text-muted);line-height:1.7">${s.description}</div>
        </div>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title"><i class="fa-solid fa-user"></i> بيانات مقدّم الاقتراح</div>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">الاسم</div>
          <div class="detail-value">${s.submitter}</div>
        </div>
       
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title"><i class="fa-regular fa-file-lines"></i> الأوراق المطلوبة</div>
      <div class="docs-list">${docsHtml}</div>
    </div>`;
    document.getElementById('modal-footer').innerHTML = `
  <button class="btn btn-danger" onclick="rejectSuggestion(${idx})">
    <i class="fa-solid fa-xmark"></i> رفض
  </button>
  <button class="btn btn-success" onclick="editSuggestion(${idx})">
    <i class="fa-solid fa-pen"></i> تعديل والموافقة
  </button>
`;
    document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
    if (!e || e.target === document.getElementById('modal-overlay')) {
        document.getElementById('modal-overlay').classList.remove('open');
        pendingDeleteId = null;
        pendingDeleteType = null;
    }
}

function approveSuggestion(idx) {
    const name = suggestions[idx].name;
    closeModal(); removeSuggestionItem(idx);
    showToast('success', `<i class="fa-solid fa-circle-check"></i> تمت الموافقة على "${name}"`);
}
function rejectSuggestion(idx) {
    const name = suggestions[idx].name;
    closeModal(); removeSuggestionItem(idx);
    showToast('error', `<i class="fa-solid fa-circle-xmark"></i> تم رفض "${name}"`);
}
function editSuggestion(idx) {
    closeModal();
    const s = suggestions[idx];
    clearForm();
    document.getElementById('svc-name').value = s.name;
    refreshCatSelect();
    document.getElementById('svc-cat').value = s.category;
    document.getElementById('svc-type').value = s.type;
    setDocsInForm(s.docs || []);
    setStepsInForm([]);
    showSection('add-service', document.querySelectorAll('.nav-item')[2]);
    showToast('edit', '<i class="fa-solid fa-pen"></i> تم نقل بيانات الاقتراح لنموذج الإضافة');
}
function removeSuggestionItem(idx) {
    const items = document.querySelectorAll('.suggestion-item');
    if (items[idx]) {
        items[idx].style.transition = 'opacity .3s, transform .3s';
        items[idx].style.opacity = '0';
        items[idx].style.transform = 'translateX(30px)';
        setTimeout(() => items[idx].remove(), 300);
    }
}

// ===== TOAST =====
function showToast(type, html) {
    const old = document.querySelector('.toast'); if (old) old.remove();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = html;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.transition = 'opacity .3s, transform .3s';
        t.style.opacity = '0';
        t.style.transform = 'translateY(10px)';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

// ===== INIT =====
loadCategories();
renderServicesTable(); 