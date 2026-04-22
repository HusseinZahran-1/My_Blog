document.addEventListener('DOMContentLoaded', () => {
    let allProjects = [];
    let currentFilter = 'all';
    let searchTerm = '';
    
    const grid = document.getElementById('projectsGrid');
    const countSpan = document.getElementById('projectsCount');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const resetBtn = document.getElementById('resetFilters');
    
    function renderProjects() {
        // Get latest projects from data.js
        allProjects = getProjects();
        
        // Apply filters
        let filtered = allProjects.filter(project => {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Tag filter
            const matchesTag = currentFilter === 'all' || 
                project.tags.includes(currentFilter);
            
            return matchesSearch && matchesTag;
        });
        
        // Update count display
        if (countSpan) {
            countSpan.innerHTML = `SHOWING ${filtered.length} PROJECT${filtered.length !== 1 ? 'S' : ''}`;
        }
        
        // Show/hide empty state
        if (filtered.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (grid) grid.innerHTML = '';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        // Render projects
        if (grid) {
            grid.innerHTML = filtered.map((project, index) => `
                <div class="project-card" data-index="${index}">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description.substring(0, 120))}${project.description.length > 120 ? '...' : ''}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.github}" class="btn-ghost" target="_blank">GITHUB</a>
                        <a href="${project.demo}" class="btn-primary" target="_blank">DEMO</a>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Helper function to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderProjects();
        });
    }
    
    // Clear search button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchTerm = '';
                renderProjects();
            }
        });
    }
    
    // Tag filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current filter
            currentFilter = btn.getAttribute('data-tag');
            
            // Re-render projects
            renderProjects();
        });
    });
    
    // Reset all filters
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Reset search
            if (searchInput) {
                searchInput.value = '';
                searchTerm = '';
            }
            
            // Reset filter to 'all'
            currentFilter = 'all';
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-tag') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Re-render
            renderProjects();
        });
    }
    
    // Initial render
    renderProjects();
});