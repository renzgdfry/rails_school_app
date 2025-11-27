// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"


// Clean up lingering offcanvas backdrops without closing sidebar
document.addEventListener("turbo:load", () => {
  const sidebar = document.getElementById('sidebar');

  if (sidebar) {
    sidebar.addEventListener('show.bs.offcanvas', () => {
      // Remove any leftover backdrops
      document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => backdrop.remove());
    });
  }
});




document.addEventListener("turbo:load", () => {
  const modal = document.getElementById("confirmDeleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");

  modal.addEventListener("show.bs.modal", event => {
    const button = event.relatedTarget;
    const url = button.getAttribute("data-student-url");
    confirmBtn.setAttribute("href", url);
    confirmBtn.setAttribute("data-turbo-method", "delete");
  });
});

document.addEventListener("turbo:load", () => {
  const modal = document.getElementById("confirmDeleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");

  if (!modal) return;

  modal.addEventListener("show.bs.modal", event => {
    const button = event.relatedTarget;
    const url = button.getAttribute("data-student-url");
    confirmBtn.setAttribute("href", url);
    confirmBtn.setAttribute("data-turbo-method", "delete");
  });
});

function initOverviewAnimation() {
  const overviewSection = document.getElementById('overview');
  if (!overviewSection) return;

  const elements = overviewSection.querySelectorAll('.fade-left, .fade-right');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show'); // trigger animation
      } else {
        entry.target.classList.remove('show'); // reset when leaving viewport
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}



document.addEventListener("DOMContentLoaded", initOverviewAnimation);
document.addEventListener("turbo:load", initOverviewAnimation);

function initCampusTourLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const closeBtn = document.getElementById('closeBtn');

  if (!lightbox) return;

  function openLightbox(imgSrc, caption, description) {
    lightboxImage.src = imgSrc;
    lightboxCaption.textContent = caption;
    lightboxDescription.textContent = description;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Close lightbox
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  // Attach click listeners to all gallery items
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay h3').textContent;
      const description = item.dataset.long || item.dataset.description || '';
      openLightbox(img.src, caption, description);
    });
  });
}

// Initialize on Turbo load
document.addEventListener("turbo:load", initCampusTourLightbox);


// Shrinking logo/text header
function initHeaderShrink() {
  const homeNavbar = document.getElementById("homeNavbar");
  if (!homeNavbar) return;

  const handleScroll = () => {
    if (window.scrollY > 150) {
      homeNavbar.classList.add("collapsed");
    } else {
      homeNavbar.classList.remove("collapsed");
    }
  };

  // Trigger on page load
  handleScroll();

  // Trigger on scroll
  window.addEventListener("scroll", handleScroll);

  // Trigger on Turbo navigation (sidebar anchor links)
  document.addEventListener("turbo:load", handleScroll);
}

// Initialize the header shrink effect
document.addEventListener("DOMContentLoaded", initHeaderShrink);
document.addEventListener("turbo:load", initHeaderShrink);

document.addEventListener("turbo:load", () => {
  const offcanvasElements = document.querySelectorAll('.offcanvas');

  offcanvasElements.forEach(offcanvas => {
    offcanvas.addEventListener('show.bs.offcanvas', () => {
      // Prevent content shift
      document.body.classList.add('offcanvas-open-no-padding');
    });

    offcanvas.addEventListener('hidden.bs.offcanvas', () => {
      document.body.classList.remove('offcanvas-open-no-padding');
    });
  });
});

document.addEventListener("turbo:load", () => {
  const offcanvasElements = document.querySelectorAll('.offcanvas');

  offcanvasElements.forEach(offcanvas => {
    offcanvas.addEventListener('show.bs.offcanvas', () => {
      // Wait a tick for Bootstrap to apply its padding, then remove it
      setTimeout(() => {
        document.body.style.paddingRight = '0px';
      }, 0);
    });

    offcanvas.addEventListener('hidden.bs.offcanvas', () => {
      document.body.style.paddingRight = '0px';
    });
  });
});

document.addEventListener("turbo:load", () => {
  const sidebar = document.getElementById('sidebar');

  if (!sidebar) return;

  // Select all top-level nav-links (direct children of sidebar ul.nav)
  const topLinks = sidebar.querySelectorAll("ul.nav > li > .nav-link");

  topLinks.forEach(link => {
    const parentLi = link.closest("li");
    const submenu = parentLi.querySelector("ul.collapse");

    // If link has a submenu (like School Manager)
    if (submenu) {
      // Only close sidebar when a submenu item is clicked
      const submenuLinks = submenu.querySelectorAll(".nav-link");
      submenuLinks.forEach(sublink => {
        sublink.addEventListener("click", () => {
          const offcanvasInstance = bootstrap.Offcanvas.getInstance(sidebar);
          if (offcanvasInstance) offcanvasInstance.hide();
        });
      });
    } else {
      // No submenu → close sidebar immediately on click
      link.addEventListener("click", () => {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(sidebar);
        if (offcanvasInstance) offcanvasInstance.hide();
      });
    }
  });
});

// NEWS SECTION PAGINATION (LOOPING VERSION)
function initNewsPagination() {
  const cards = document.querySelectorAll('.news-card-wrapper');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (cards.length === 0) return; // not on news page

  const cardsPerPage = 6;
  let currentPage = 1;
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  function showPage(page) {
    cards.forEach((card, index) => {
      const start = (page - 1) * cardsPerPage;
      const end = start + cardsPerPage;
      card.style.display = (index >= start && index < end) ? 'block' : 'none';
    });
  }

  // first load
  showPage(currentPage);

  // LOOPING BACKWARD
  if (prevBtn) {
    prevBtn.onclick = () => {
      currentPage = (currentPage - 1 < 1)
        ? totalPages       // go to last page
        : currentPage - 1;

      showPage(currentPage);
    };
  }

  // LOOPING FORWARD
  if (nextBtn) {
    nextBtn.onclick = () => {
      currentPage = (currentPage + 1 > totalPages)
        ? 1               // go back to first page
        : currentPage + 1;

      showPage(currentPage);
    };
  }
}

// initialize when Turbo loads or page loads
document.addEventListener("turbo:load", initNewsPagination);
document.addEventListener("DOMContentLoaded", initNewsPagination);
