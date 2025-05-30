document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const content = document.getElementById("content");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-btn"); // Define closeBtn here

  // When any image in the portfolio is clicked
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });
  });

  // Close when clicking the close button
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Optional: Close when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
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

  // Modify the loadPage function to prevent recursive loading
  function loadPage(page) {
    // Prevent loading if we're already on this page
    if (window.currentPage === page) {
      console.log("Already on page:", page);
      return;
    }

    // First fetch the content
    fetch(page, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
      .then((res) => {
        console.log("Fetch response:", res.status);
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((html) => {
        // Start fade out
        content.classList.remove("show");

        // Wait for fade out to complete before updating content
        setTimeout(() => {
          content.innerHTML = html;
          content.classList.add("show");
          window.currentPage = page; // Track current page
          addModalListeners(); // Add this line to reattach modal listeners after content changes

          // Add event listeners to any new nav links
          const newLinks = content.querySelectorAll(".nav-link");
          newLinks.forEach((link) => {
            link.addEventListener("click", handleNavClick);
          });

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

          console.log("Loading page:", page);
          window.scrollTo(0, 0);

          window.location.hash = page; // Update URL hash
        }, 300); // Match this with your CSS transition duration
      })
      .catch((error) => {
        console.error("Load error:", error);
        content.innerHTML = "<p>Page not found.</p>";
        content.classList.add("show");
      });
  }

  // Separate the click handler function
  function handleNavClick(e) {
    e.preventDefault();
    const page = this.getAttribute("data-page");
    console.log("Link clicked, page:", page);
    if (page) {
      loadPage(page);
    }
  }

  // Add listeners to navigation links in the main nav
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  // Initial page load
  const initialPage = window.location.hash
    ? window.location.hash.substring(1)
    : "pages/home.html";
  window.currentPage = null; // Initialize current page tracker
  loadPage(initialPage);

  function addModalListeners() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close-btn");

    // Add click listeners to all images except nav/logo images
    document.querySelectorAll('.image-wrapper img').forEach(img => {
      img.style.cursor = 'pointer'; // Show pointer cursor on hoverable images
      img.addEventListener('click', () => {
        modal.style.display = "flex";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      });
    });

    // Close modal with close button
    closeBtn.addEventListener('click', () => {
      modal.style.display = "none";
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }
});
