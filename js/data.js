// DATA LAYER - Single source of truth
const ADMIN_CREDS = { username: 'admin', password: 'Hh12@3456' };

// Start with empty projects array - no default projects
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

// Make functions available globally
window.getProjects = getProjects;
window.saveProjects = saveProjects;
window.ADMIN_CREDS = ADMIN_CREDS;