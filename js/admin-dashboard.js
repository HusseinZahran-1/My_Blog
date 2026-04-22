// ADMIN DASHBOARD - Complete working CRUD
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const auth = localStorage.getItem("hussein_auth");
  if (!auth) {
    window.location.href = "login.html";
    return;
  }

  let currentProjects = [];
  let deleteId = null;
  let currentTags = [];

  // Load projects
  function loadProjects() {
    currentProjects = getProjects();
    renderTable();
    updateStats();
  }

  // Render projects table
  function renderTable() {
    const search =
      document.getElementById("adminSearch")?.value.toLowerCase() || "";
    const filtered = currentProjects.filter((p) =>
      p.title.toLowerCase().includes(search),
    );
    const tbody = document.getElementById("adminTableBody");

    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="5" style="text-align: center; padding: 60px 20px;"><div style="font-size: 48px; margin-bottom: 15px;">📁</div><div style="font-size: 18px; margin-bottom: 10px;">No projects yet</div><div style="color: var(--text-dim);">Click "ADD NEW PROJECT" to get started</div></td></tr>';
      } else {
        tbody.innerHTML = filtered
          .map(
            (p) => `
                    <tr>
                        <td><strong>${escapeHtml(p.title)}</strong></td>
                        <td>${escapeHtml(p.description.substring(0, 60))}${p.description.length > 60 ? "..." : ""}</td>
                        <td>${p.tags
                          .slice(0, 2)
                          .map(
                            (t) =>
                              `<span class="tag-pill" style="font-size: 10px; padding: 3px 8px;">${escapeHtml(t)}</span>`,
                          )
                          .join(" ")}</td>
                        <td>${p.featured ? '<span style="color: var(--amber);">⭐ Featured</span>' : "No"}</td>
                        <td>
                            <button class="edit-btn" data-id="${p.id}">✏️ EDIT</button>
                            <button class="delete-btn" data-id="${p.id}">🗑️ DELETE</button>
                        </td>
                    </tr>
                `,
          )
          .join("");
      }

      // Add event listeners to buttons
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          openModal(btn.getAttribute("data-id")),
        );
      });
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          openConfirm(btn.getAttribute("data-id")),
        );
      });
    }

    document.getElementById("tableFooter").innerHTML =
      `${filtered.length} record${filtered.length !== 1 ? "s" : ""}`;
  }

  // Update stats
  function updateStats() {
    document.getElementById("totalProjects").innerText = currentProjects.length;
    document.getElementById("featuredCount").innerText = currentProjects.filter(
      (p) => p.featured,
    ).length;

    const allTags = new Set();
    currentProjects.forEach((p) => p.tags.forEach((t) => allTags.add(t)));
    document.getElementById("techCount").innerText = allTags.size;

    const demosWithLinks = currentProjects.filter(
      (p) => p.demo && p.demo !== "#",
    ).length;
    document.getElementById("demoCount").innerText = demosWithLinks;

    // Update progress bars
    const maxValue = Math.max(currentProjects.length, 5);
    const progressBars = document.querySelectorAll(".progress-fill");
    if (progressBars[0])
      progressBars[0].style.width = `${Math.min((currentProjects.length / maxValue) * 100, 100)}%`;
    if (progressBars[1])
      progressBars[1].style.width = `${Math.min((currentProjects.filter((p) => p.featured).length / maxValue) * 100, 100)}%`;
    if (progressBars[2])
      progressBars[2].style.width = `${Math.min((allTags.size / 15) * 100, 100)}%`;
    if (progressBars[3])
      progressBars[3].style.width = `${Math.min((demosWithLinks / maxValue) * 100, 100)}%`;
  }

  // Show toast notification
  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
            <span style="margin-right: 10px;">${type === "success" ? "✅" : "❌"}</span>
            ${message}
        `;
    toast.style.cssText = `
            background: ${type === "success" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)"};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 10px;
            animation: slideInRight 0.3s ease;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Open modal for add/edit
  function openModal(id = null) {
    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");

    // Reset form
    document.getElementById("projectForm").reset();
    document.getElementById("projectId").value = "";
    currentTags = [];

    if (id) {
      // Edit mode
      const project = currentProjects.find((p) => p.id === id);
      if (project) {
        modalTitle.textContent = "✏️ EDIT PROJECT";
        document.getElementById("projectId").value = project.id;
        document.getElementById("projTitle").value = project.title;
        document.getElementById("projDesc").value = project.description;
        document.getElementById("projGithub").value = project.github || "";
        document.getElementById("projDemo").value = project.demo || "";
        document.getElementById("projImage").value = project.image || "";
        document.getElementById("featuredCheck").checked = project.featured;
        currentTags = [...project.tags];
      }
    } else {
      modalTitle.textContent = "➕ ADD NEW PROJECT";
    }

    renderSelectedTags();
    modal.style.display = "flex";
  }

  // Render selected tags
  function renderSelectedTags() {
    const container = document.getElementById("selectedTags");
    if (!container) return;

    if (currentTags.length === 0) {
      container.innerHTML =
        '<span style="color: var(--text-dim); font-size: 12px;">💡 Click on tags above or type to add</span>';
      return;
    }

    container.innerHTML = currentTags
      .map(
        (tag) => `
            <span class="tag-pill">
                ${escapeHtml(tag)}
                <button type="button" class="remove-tag" data-tag="${tag}">×</button>
            </span>
        `,
      )
      .join("");

    document.querySelectorAll(".remove-tag").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tagToRemove = btn.getAttribute("data-tag");
        currentTags = currentTags.filter((t) => t !== tagToRemove);
        renderSelectedTags();
      });
    });
  }

  // Add tag
  function addTag(tag) {
    tag = tag.trim();
    if (tag && !currentTags.includes(tag) && tag.length > 0) {
      currentTags.push(tag);
      renderSelectedTags();
      return true;
    }
    return false;
  }

  // Save project
  function saveProject(event) {
    event.preventDefault();

    const id = document.getElementById("projectId").value;
    const title = document.getElementById("projTitle").value.trim();
    const description = document.getElementById("projDesc").value.trim();
    const github = document.getElementById("projGithub").value.trim() || "#";
    const demo = document.getElementById("projDemo").value.trim() || "#";
    const image = document.getElementById("projImage").value.trim() || "";
    const featured = document.getElementById("featuredCheck").checked;

    if (!title || !description) {
      showToast("Please fill in title and description", "error");
      return;
    }

    if (currentTags.length === 0) {
      showToast("Please add at least one tag", "error");
      return;
    }

    const projectData = {
      title: title,
      description: description,
      github: github,
      demo: demo,
      image: image,
      featured: featured,
      tags: currentTags,
    };

    if (id) {
      // Update existing project
      const index = currentProjects.findIndex((p) => p.id === id);
      if (index !== -1) {
        projectData.id = id;
        currentProjects[index] = projectData;
        showToast("✅ Project updated successfully!");
      }
    } else {
      // Add new project
      projectData.id = Date.now().toString();
      currentProjects.push(projectData);
      showToast("✅ Project added successfully!");
    }

    // Save to localStorage
    saveProjects(currentProjects);

    // Reload and refresh
    loadProjects();
    closeModal();
  }

  // Open delete confirmation
  function openConfirm(id) {
    deleteId = id;
    const modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "flex";
  }

  // Confirm delete
  function confirmDelete() {
    if (deleteId) {
      currentProjects = currentProjects.filter((p) => p.id !== deleteId);
      saveProjects(currentProjects);
      loadProjects();
      showToast("🗑️ Project deleted successfully!", "error");
      closeConfirm();
    }
  }

  // Close modal
  function closeModal() {
    const modal = document.getElementById("projectModal");
    if (modal) modal.style.display = "none";
    document.getElementById("projectForm").reset();
    currentTags = [];
  }

  // Close confirm modal
  function closeConfirm() {
    const modal = document.getElementById("deleteModal");
    if (modal) modal.style.display = "none";
    deleteId = null;
  }

  // Logout function
function logout() {
    // Remove all admin-related items from localStorage
    localStorage.removeItem('hussein_auth');
    localStorage.removeItem('hussein_user');
    localStorage.removeItem('hussein_is_admin'); // ========== REMOVE ADMIN FLAG ==========
    
    showToast('Logging out...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

  // Escape HTML
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ========== SETUP EVENT LISTENERS ==========

  // Add project button
  const addBtn = document.getElementById("addProjectBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => openModal());
  }

  // Search input
  const searchInput = document.getElementById("adminSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => renderTable());
  }

  // Save project form
  const projectForm = document.getElementById("projectForm");
  if (projectForm) {
    projectForm.addEventListener("submit", saveProject);
  }

  // Tag input
  const tagInput = document.getElementById("tagInput");
  if (tagInput) {
    tagInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (addTag(tagInput.value)) {
          tagInput.value = "";
        }
      }
    });
  }

  // Quick tag buttons
  document.querySelectorAll(".quick-tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      addTag(btn.getAttribute("data-quick"));
    });
  });

  // Close modal buttons
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal();
      closeConfirm();
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("projectModal");
    const deleteModal = document.getElementById("deleteModal");
    if (e.target === modal) closeModal();
    if (e.target === deleteModal) closeConfirm();
  });

  // Confirm delete button
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", confirmDelete);
  }

  // Cancel delete button
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeConfirm);
  }

  // Logout buttons
  const logoutBtnTop = document.getElementById("logoutBtnTop");
  const logoutBtnSide = document.getElementById("logoutBtnSide");

  if (logoutBtnTop) {
    logoutBtnTop.addEventListener("click", logout);
  }
  if (logoutBtnSide) {
    logoutBtnSide.addEventListener("click", logout);
  }

  // Initialize
  loadProjects();
});
