// DATA LAYER - Single source of truth
const ADMIN_CREDS = { username: 'admin', password: 'hussein2025' };

// ========== معلومات المطور ==========
// ضع رابط صورتك هنا (غير هذا الرابط إلى صورتك)
const PROFILE_IMAGE_URL = 'https://i.imgur.com/KsuND9g.jpeg';

// ضع اسمك هنا
const DEVELOPER_NAME = 'Hussein Zahran';
// ====================================

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

function getProfileImage() {
    return localStorage.getItem('hussein_avatar') || PROFILE_IMAGE_URL;
}

function getDeveloperName() {
    return localStorage.getItem('hussein_name') || DEVELOPER_NAME;
}

window.getProjects = getProjects;
window.saveProjects = saveProjects;
window.ADMIN_CREDS = ADMIN_CREDS;
window.PROFILE_IMAGE_URL = PROFILE_IMAGE_URL;
window.DEVELOPER_NAME = DEVELOPER_NAME;
window.getProfileImage = getProfileImage;
window.getDeveloperName = getDeveloperName;