// API endpoints
const API_BASE_URL = 'http://192.168.223.28:5000'; // سيتم تغييرها لرابط السيرفر الفعلي
const POPUP_API = `${API_BASE_URL}/api/popup`;

// عناصر DOM
const popup = document.getElementById('popup');
const closePopupBtn = document.getElementById('closePopup');
const popupText = document.getElementById('popupText');
const popupImage = document.getElementById('popupImage');

// دالة جلب بيانات النافذة المنبثقة من السيرفر
async function fetchPopupData() {
    try {
        const response = await fetch(POPUP_API);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('خطأ في جلب بيانات النافذة المنبثقة:', error);
        return null;
    }
}

// دالة عرض النافذة المنبثقة
function showPopup(popupData) {
    if (popupData && popupData.status === 'on' && popupData.text && popupData.image_path) {
        popupText.textContent = popupData.text;
        popupImage.src = popupData.image_path;
        popupImage.alt = popupData.text;
        popup.style.display = 'flex';
    }
}

// دالة إغلاق النافذة المنبثقة
function closePopup() {
    popup.style.display = 'none';
}

// إضافة event listeners
closePopupBtn.addEventListener('click', closePopup);

// إغلاق النافذة عند النقر خارج المحتوى
popup.addEventListener('click', function(event) {
    if (event.target === popup) {
        closePopup();
    }
});

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', async function() {
    const popupData = await fetchPopupData();
    if (popupData) {
        showPopup(popupData);
    }
});

// منع إعادة فتح النافذة عند تحديث الصفحة إذا كانت مغلقة
window.addEventListener('beforeunload', function() {
    if (popup.style.display === 'none') {
        sessionStorage.setItem('popupClosed', 'true');
    }
});

// التحقق إذا كانت النافذة مغلقة مسبقاً في هذه الجلسة
document.addEventListener('DOMContentLoaded', function() {
    const popupClosed = sessionStorage.getItem('popupClosed');
    if (popupClosed === 'true') {
        popup.style.display = 'none';
        sessionStorage.removeItem('popupClosed');
    }
});