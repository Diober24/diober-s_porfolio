document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-btn");

  // Setup static modal close handlers once globally
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }

  // Function to attach click zoom preview to project preview images
  function attachImageModalListeners() {
    document.querySelectorAll(".image-wrapper img").forEach((img) => {
      img.style.cursor = "pointer";
      img.onclick = () => {
        if (modal && modalImg) {
          modal.style.display = "flex";
          modalImg.src = img.src;
          modalImg.alt = img.alt || "Preview Image";
        }
      };
    });
  }

  // Update active state in navbar
  function updateActiveNavLink(page) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.getAttribute("data-page") === page) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Load subpage dynamically via fetch
  function loadPage(page, pushHash = true) {
    if (window.currentPage === page) return;

    fetch(page, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((html) => {
        content.classList.remove("show");

        setTimeout(() => {
          content.innerHTML = html;
          content.classList.add("show");
          window.currentPage = page;

          // Re-attach modal & nav click handlers within newly loaded content
          attachImageModalListeners();
          content.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", handleNavClick);
          });

          // Update Document Title
          switch (page) {
            case "pages/home.html":
              document.title = "Home | Diober's Portfolio";
              break;
            case "pages/projects.html":
              document.title = "Projects | Diober's Portfolio";
              break;
            case "pages/about.html":
              document.title = "About | Diober's Portfolio";
              break;
            case "pages/i-file.html":
              document.title = "i-File Mo | Diober's Portfolio";
              break;
            default:
              document.title = "Diober's Portfolio";
          }

          updateActiveNavLink(page);
          window.scrollTo(0, 0);

          if (pushHash) {
            window.location.hash = page;
          }
        }, 200);
      })
      .catch((error) => {
        console.error("Error loading page:", error);
        if (window.location.protocol === "file:") {
          content.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 16px; margin: 40px auto; max-width: 650px; color: #9b2c2c; font-family: system-ui, sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              <h3 style="margin-bottom: 12px; font-size: 1.4em;">⚠️ Local File Protocol Restriction (CORS)</h3>
              <p style="font-size: 1.05em; line-height: 1.5;">Modern web browsers block <code>fetch()</code> requests when opening HTML files directly via <code>file:///</code>.</p>
              <div style="margin-top: 20px; padding: 15px; background: #ffffff; border-radius: 10px; border: 1px solid #fed7d7; text-align: left;">
                <p style="font-weight: bold; color: #2d3748; margin-bottom: 8px;">To view your portfolio properly:</p>
                <p style="color: #4a5568; margin: 5px 0;">1. Start <strong>Apache</strong> in your <strong>XAMPP Control Panel</strong>.</p>
                <p style="color: #4a5568; margin: 5px 0;">2. Open your web browser and navigate to:</p>
                <p style="margin-top: 8px; text-align: center;"><a href="http://localhost/my-portfolio/" style="color: #935e9d; font-weight: bold; font-size: 1.2em; text-decoration: underline;">http://localhost/my-portfolio/</a></p>
              </div>
            </div>
          `;
        } else {
          content.innerHTML = "<p style='text-align:center; padding: 40px;'>Page not found.</p>";
        }
        content.classList.add("show");
      });
  }

  function handleNavClick(e) {
    e.preventDefault();
    const page = this.getAttribute("data-page");
    if (page) {
      loadPage(page);
    }
  }

  // Attach click events to top navigation bar
  document.querySelectorAll("header .nav-link").forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  // Handle Browser Back / Forward buttons (popstate)
  window.addEventListener("popstate", () => {
    const pageFromHash = window.location.hash
      ? window.location.hash.substring(1)
      : "pages/home.html";
    loadPage(pageFromHash, false);
  });

  // Initial page load based on current hash
  const initialPage = window.location.hash
    ? window.location.hash.substring(1)
    : "pages/home.html";
  window.currentPage = null;
  loadPage(initialPage, false);
});
