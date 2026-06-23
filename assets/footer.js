async function linkFooterCategories() {
    try {
        const res = await fetch('https://localhost:7162/api/Services');
        if (!res.ok) return;
        const result = await res.json();
        const services = result.data || result;

        const serviceNames = [
            'ترخيص مستشفى خاص',
            'الاستعلام عن طلب إسكان',
            'التحويل بين المدارس',
            'استخراج سجل تجاري',
            'استخراج بطاقة الرقم القومي',
            'استخراج بدل فاقد لرخصة القيادة'
        ];

        const footerLinks = document.querySelectorAll('.footer-col:first-of-type ul li a');
        footerLinks.forEach((link, i) => {
            const match = services.find(s => s.title === serviceNames[i]);
            if (match) {
                link.href = `serviceDetail.html?id=${match.id}`;
            }
        });

    } catch (err) {
        console.error('Footer links error:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    linkFooterCategories();
});