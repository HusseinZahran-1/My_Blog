// DATA LAYER - Single source of truth
const ADMIN_CREDS = { username: 'admin', password: 'Hh12@3456' };

// ========== صورة البروفايل - ضع رابط صورتك هنا ==========
// يمكنك تغيير هذا الرابط إلى صورتك الشخصية
const PROFILE_IMAGE_URL = 'https://imgur.com/a/pMJRNKa';
// أو استخدم صورة محلية: 'images/profile.jpg'
// أو استخدم رابط من Imgur: 'https://i.imgur.com/your-image.jpg'
// =====================================================

// اسم المطور
const DEVELOPER_NAME = 'Hussein';

let defaultProjects = [];

function getProjects() {
    const stored = localStorage.getItem('hussein_projects');
    if (stored) {
        return JSON.parse(stored);
    }
    return [...defaultProjects];
}

function saveProjects(projects) {
    localStorage.setItem('hussein_projects', JSON.stringify(projects));
}

// دوال للحصول على الصورة والاسم
function getProfileImage() {
    return localStorage.getItem('hussein_avatar') || PROFILE_IMAGE_URL;
}

function getDeveloperName() {
    return localStorage.getItem('hussein_name') || DEVELOPER_NAME;
}

// Make functions available globally
window.getProjects = getProjects;
window.saveProjects = saveProjects;
window.ADMIN_CREDS = ADMIN_CREDS;
window.PROFILE_IMAGE_URL = PROFILE_IMAGE_URL;
window.DEVELOPER_NAME = DEVELOPER_NAME;
window.getProfileImage = getProfileImage;
window.getDeveloperName = getDeveloperName;