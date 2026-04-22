// MAIN JS - Navbar, scroll reveals, counters, and featured projects
document.addEventListener("DOMContentLoaded", () => {
  // ========== LOADER ==========
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        if (loader) loader.remove();
      }, 800);
    }
  }, 1500);

  // ========== NAVBAR SCROLL EFFECT ==========
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // ========== MOBILE MENU BURGER ==========
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("mobile");
    });
  }

  // Close mobile menu when clicking a link
  const navLinkItems = document.querySelectorAll(".nav-link");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks && navLinks.classList.contains("mobile")) {
        navLinks.classList.remove("mobile");
      }
    });
  });

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.2 },
  );

  reveals.forEach((reveal) => {
    revealObserver.observe(reveal);
  });

  // ========== CHECK IF USER IS ADMIN ==========
  // In main.js, update the isAdmin function:
  function isAdmin() {
    // Check both auth token and admin flag
    const auth = localStorage.getItem("hussein_auth");
    const isAdminFlag = localStorage.getItem("hussein_is_admin");
    return auth !== null && isAdminFlag === "true";
  }

  // ========== AVATAR AND NAME EDITING (ADMIN ONLY) ==========
  function initAvatarAndNameEditing() {
    // Check if user is admin
    const adminStatus = isAdmin();

    // Show/hide edit buttons based on admin status
    const editBtn = document.getElementById("editAvatarBtn");
    const userNameSpan = document.getElementById("userName");

    if (adminStatus) {
      // Admin can edit - show edit button and make name clickable
      if (editBtn) {
        editBtn.style.display = "flex";
        editBtn.style.cursor = "pointer";
      }

      if (userNameSpan) {
        userNameSpan.style.cursor = "pointer";
        userNameSpan.title = "Click to edit name (Admin only)";
      }
    } else {
      // Non-admin cannot edit - hide edit button and make name non-clickable
      if (editBtn) {
        editBtn.style.display = "none";
      }

      if (userNameSpan) {
        userNameSpan.style.cursor = "default";
        userNameSpan.title = "";
      }
    }

    // Load saved avatar from localStorage
    function loadSavedAvatar() {
      const savedAvatar = localStorage.getItem("hussein_avatar");
      const avatarImage = document.getElementById("avatarImage");
      const avatarLetter = document.getElementById("avatarLetter");

      if (savedAvatar && savedAvatar !== "") {
        avatarImage.src = savedAvatar;
        avatarImage.style.display = "block";
        avatarLetter.style.display = "none";
      } else {
        avatarImage.style.display = "none";
        avatarLetter.style.display = "flex";
      }
    }

    // Load saved name
    function loadSavedName() {
      const savedName = localStorage.getItem("hussein_name");
      const userNameSpan = document.getElementById("userName");
      if (savedName && userNameSpan) {
        userNameSpan.textContent = savedName;
      }
    }

    // Edit avatar button (only if admin)
    if (editBtn && adminStatus) {
      const avatarUpload = document.getElementById("avatarUpload");

      editBtn.addEventListener("click", () => {
        if (avatarUpload) {
          avatarUpload.click();
        }
      });

      if (avatarUpload) {
        avatarUpload.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            // Validate file type
            if (!file.type.match("image.*")) {
              showToastMessage(
                "Please select an image file (JPG, PNG, GIF)",
                "error",
              );
              return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
              showToastMessage("Image too large! Max 2MB", "error");
              return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
              const imageData = event.target.result;
              const avatarImage = document.getElementById("avatarImage");
              const avatarLetter = document.getElementById("avatarLetter");

              avatarImage.src = imageData;
              avatarImage.style.display = "block";
              avatarLetter.style.display = "none";

              // Save to localStorage
              localStorage.setItem("hussein_avatar", imageData);

              // Show success message
              showToastMessage("Profile photo updated!", "success");
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }

    // Edit name inline (only if admin)
    if (userNameSpan && adminStatus) {
      userNameSpan.addEventListener("click", function () {
        const currentName = this.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentName;
        input.className = "name-input";
        input.style.fontSize = window.getComputedStyle(this).fontSize;
        input.style.fontWeight = window.getComputedStyle(this).fontWeight;
        input.style.maxWidth = "200px";

        this.style.display = "none";
        this.parentNode.insertBefore(input, this);
        input.focus();

        function saveName() {
          const newName = input.value.trim();
          if (newName && newName !== "") {
            userNameSpan.textContent = newName;
            localStorage.setItem("hussein_name", newName);
            showToastMessage("Name updated!", "success");
          }
          input.remove();
          userNameSpan.style.display = "inline";
        }

        input.addEventListener("blur", saveName);
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            saveName();
          }
        });
      });
    }

    // Simple toast message function
    function showToastMessage(message, type) {
      let toastContainer = document.getElementById("customToastContainer");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "customToastContainer";
        toastContainer.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                `;
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement("div");
      toast.style.cssText = `
                background: ${type === "success" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)"};
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                margin-top: 10px;
                font-family: 'DM Sans', sans-serif;
                font-size: 14px;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            `;
      toast.textContent = message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Load saved data
    loadSavedAvatar();
    loadSavedName();
  }

  // ========== FEATURED PROJECTS SECTION ==========
  function loadFeaturedProjects() {
    const featuredGrid = document.getElementById("featuredGrid");
    if (!featuredGrid) return;

    // Get projects from data.js
    const allProjects = typeof getProjects === "function" ? getProjects() : [];
    const featuredProjects = allProjects
      .filter((p) => p.featured === true)
      .slice(0, 3);

    if (featuredProjects.length > 0) {
      featuredGrid.innerHTML = featuredProjects
        .map(
          (project) => `
                <div class="project-card">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description.substring(0, 80))}${project.description.length > 80 ? "..." : ""}</p>
                    <div class="project-tags">
                        ${project.tags.map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join("")}
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 15px;">
                        <a href="${project.github}" class="btn-ghost" style="padding: 6px 16px; font-size: 12px;">GITHUB</a>
                        <a href="${project.demo}" class="btn-primary" style="padding: 6px 16px; font-size: 12px;">DEMO</a>
                    </div>
                </div>
            `,
        )
        .join("");
    } else {
      featuredGrid.innerHTML =
        '<p style="text-align: center; color: var(--text-dim);">No featured projects yet. Add some in the admin panel!</p>';
    }
  }

  // Helper function to prevent XSS
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ========== ANIMATED COUNTERS (REAL-TIME) ==========
  function initCounters() {
    const statsSection = document.querySelector("#heroStats");
    if (!statsSection) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get real-time projects count
            const allProjects =
              typeof getProjects === "function" ? getProjects() : [];
            const projectCount = allProjects.length;

            // Update projects counter target
            const projectStat = document.querySelector(
              ".stat-number:first-child",
            );
            if (projectStat) {
              projectStat.setAttribute("data-target", projectCount);
            }

            // Years of experience - fixed at 5 (still studying/learning)
            const yearsStat = document.querySelector(
              ".stat-number:nth-child(2)",
            );
            if (yearsStat) {
              yearsStat.setAttribute("data-target", 5);
            }

            // Satisfaction rate - real-time based on projects
            let satisfactionTarget = 100;
            if (projectCount === 0) {
              satisfactionTarget = 85;
            } else if (projectCount < 5) {
              satisfactionTarget = 92;
            } else {
              satisfactionTarget = 100;
            }

            const satisfactionStat = document.querySelector(
              ".stat-number:nth-child(3)",
            );
            if (satisfactionStat) {
              satisfactionStat.setAttribute("data-target", satisfactionTarget);
            }

            // Animate all counters
            const counters = document.querySelectorAll(".stat-number");
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute("data-target"));
              if (isNaN(target)) return;

              let current = 0;
              const increment = target / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  if (counter === satisfactionStat) {
                    counter.textContent = target + "%";
                  } else {
                    counter.textContent = target;
                  }
                  clearInterval(timer);
                } else {
                  if (counter === satisfactionStat) {
                    counter.textContent = Math.floor(current) + "%";
                  } else {
                    counter.textContent = Math.floor(current);
                  }
                }
              }, 20);
            });

            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );

    counterObserver.observe(statsSection);
  }

  // ========== PARALLAX EFFECT ON HERO ==========
  function initParallax() {
    const heroContent = document.querySelector(".hero-content");
    if (!heroContent) return;

    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;

      heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#" || href === "") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // ========== UPDATE COUNTERS WHEN PROJECTS CHANGE ==========
  function updateCountersRealTime() {
    const allProjects = typeof getProjects === "function" ? getProjects() : [];
    const projectCount = allProjects.length;

    const projectStat = document.querySelector(".stat-number:first-child");
    if (projectStat && !isNaN(parseInt(projectStat.textContent))) {
      if (
        parseInt(projectStat.textContent) !== projectCount &&
        projectStat.textContent !== projectCount.toString()
      ) {
        projectStat.textContent = projectCount;
      }
    }
  }

  // Listen for storage changes (when admin adds/deletes projects)
  window.addEventListener("storage", (e) => {
    if (e.key === "hussein_projects") {
      loadFeaturedProjects();
      updateCountersRealTime();
    }
  });

  // Also check for updates every 2 seconds
  setInterval(() => {
    loadFeaturedProjects();
    const allProjects = typeof getProjects === "function" ? getProjects() : [];
    const projectCount = allProjects.length;
    const projectStat = document.querySelector(".stat-number:first-child");
    if (projectStat && !isNaN(parseInt(projectStat.textContent))) {
      if (
        parseInt(projectStat.textContent) !== projectCount &&
        projectStat.textContent !== projectCount.toString()
      ) {
        projectStat.textContent = projectCount;
      }
    }
  }, 2000);

  // ========== INITIALIZE EVERYTHING ==========
  loadFeaturedProjects();
  initCounters();
  initParallax();
  initSmoothScroll();
  initAvatarAndNameEditing(); // Initialize avatar editing (checks admin status internally)

  // Mark that counters have been triggered
  setTimeout(() => {
    window.counterObserverTriggered = true;
  }, 1000);
});
// ========== تحميل الصورة والاسم من الكود (بدون رفع) ==========
function initAvatarAndNameEditing() {
    
    // تحميل الصورة من الكود أو localStorage
    function loadSavedAvatar() {
        const savedAvatar = localStorage.getItem('hussein_avatar');
        const avatarImage = document.getElementById('avatarImage');
        const avatarLetter = document.getElementById('avatarLetter');
        
        // إذا كان فيه صورة محفوظة استخدمها، وإلا استخدم الصورة من الكود
        if (savedAvatar && savedAvatar !== '') {
            avatarImage.src = savedAvatar;
            avatarImage.style.display = 'block';
            avatarLetter.style.display = 'none';
        } else if (PROFILE_IMAGE_URL && PROFILE_IMAGE_URL !== '') {
            // استخدم الصورة من الكود
            avatarImage.src = PROFILE_IMAGE_URL;
            avatarImage.style.display = 'block';
            avatarLetter.style.display = 'none';
        } else {
            avatarImage.style.display = 'none';
            avatarLetter.style.display = 'flex';
        }
    }
    
    // تحميل الاسم من الكود أو localStorage
    function loadSavedName() {
        const savedName = localStorage.getItem('hussein_name');
        const userNameSpan = document.getElementById('userName');
        
        if (savedName && userNameSpan) {
            userNameSpan.textContent = savedName;
        } else if (DEVELOPER_NAME && userNameSpan) {
            userNameSpan.textContent = DEVELOPER_NAME;
        }
    }
    
    // إخفاء زر تعديل الصورة (لأن التعديل من الكود فقط)
    const editBtn = document.getElementById('editAvatarBtn');
    if (editBtn) {
        editBtn.style.display = 'none';
    }
    
    // إخفاء مربع رفع الصور
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.style.display = 'none';
    }
    
    // جعل الاسم غير قابل للتعديل من الواجهة
    const userNameSpan = document.getElementById('userName');
    if (userNameSpan) {
        userNameSpan.style.cursor = 'default';
        userNameSpan.style.pointerEvents = 'none';
    }
    
    // تحميل البيانات
    loadSavedAvatar();
    loadSavedName();
}