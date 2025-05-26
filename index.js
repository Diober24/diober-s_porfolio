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
  loadPage("pages/home.html");

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

        // Step 4: Animate in the new content
        requestAnimationFrame(() => {
          content.classList.add("show");

          // Step 5: Scroll to top after a short delay to ensure visibility
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 50); // slight delay for smoother animation experience
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
