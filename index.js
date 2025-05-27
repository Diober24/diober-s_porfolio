document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const content = document.getElementById("content");

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target) &&
      nav.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
    }
  });

  // Optional: smooth scroll for specific IDs if you have those in nav links
  // If you don’t have #home-link or #contact-link in your HTML, remove these blocks.
  const homeLink = document.getElementById("home-link");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Load default section
  // loadPage("pages/home.html");
  const initialPage = window.location.hash
    ? window.location.hash.substring(1)
    : "pages/home.html";
  loadPage(initialPage);

  // Attach click events to nav links (use data-page attribute)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      if (page) {
        loadPage(page);
      }
    });
  });

  // Fetch and load page content
  function loadPage(page) {
    // Step 1: Animate out the current content
    content.classList.remove("show");

    // Step 2: Wait for the transition to finish (e.g. 500ms)
    setTimeout(() => {
      fetch(page)
        .then((res) => {
          if (!res.ok) throw new Error("Page not found");
          return res.text();
        })
        .then((html) => {
          // Step 3: Insert the new content
          content.innerHTML = html;

          const previousPage = sessionStorage.getItem("currentPage");
          const isSessionPage = previousPage === page;
          sessionStorage.setItem("currentPage", page);
          // If the page is the same as the previous one, skip scroll restoration

          const savedScroll = sessionStorage.getItem("scrollPosition");
          if (savedScroll) {
            setTimeout(() => {
              window.scrollTo(0, parseInt(savedScroll));
            }, 10);
          }
          // Step 4: Animate in the new content
          requestAnimationFrame(() => {
            content.classList.add("show");

            // Set title based on page
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

            window.location.hash = page; // Update URL hash

            // Re-attach nav-link events inside dynamically loaded content
            document.querySelectorAll(".nav-link").forEach((link) => {
              link.addEventListener("click", (e) => {
                e.preventDefault();
                const nextPage = link.getAttribute("data-page");
                if (nextPage) {
                  loadPage(nextPage);
                }
              });
            });

            // Step 5: Scroll to top after a short delay to ensure visibility
            if (savedScroll && !isSessionPage) {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 50); // slight delay for smoother animation experience
            }
          });
        })
        .catch(() => {
          content.innerHTML = "<p>Page not found.</p>";
          content.classList.add("show");
          window.scrollTo({ top: 0, behavior: "smooth" }); // scroll even if error
        });
    }, 500); // match your CSS transition time
  }
});

// Save scroll position before navigating away
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("scrollPosition", window.scrollY);
});