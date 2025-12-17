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
  const overviewSection = document.getElementById("overview");
  if (!overviewSection) return;

  const elements = overviewSection.querySelectorAll(".fade-left, .fade-right");
  if (!elements.length) return;

  // Reset classes so animation can replay after Turbo visit
  elements.forEach(el => {
    el.classList.remove("show");
    el.classList.add("hidden");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          entry.target.classList.remove("hidden");
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach(el => observer.observe(el));

  // Disconnect observer before Turbo caches the page
  document.addEventListener("turbo:before-cache", () => observer.disconnect());
}

// Initialize on first load and after every Turbo visit
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


// HEAD-BOTTOM STRIPES ANIMATION
function initHeadBottomStripes() {
  const section = document.querySelector(".head-bottom-section");
  if (!section) return;

  function handleStripeAnimation() {
    const rect = section.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      section.classList.add("animate");
    } else {
      section.classList.remove("animate");
    }
  }

  // Trigger on scroll
  window.addEventListener("scroll", handleStripeAnimation);

  // Trigger on initial load
  handleStripeAnimation();
}

document.addEventListener("turbo:load", initHeadBottomStripes);
document.addEventListener("DOMContentLoaded", initHeadBottomStripes);

function initFloatingCalendar() {
  const calendarContainer = document.querySelector(".floating-calendar");
  if (!calendarContainer) return;

  // Only show and enable calendar on index
  if (window.location.pathname !== "/") {
    calendarContainer.style.display = "none"; // hide if not on index
    return;
  } else {
    calendarContainer.style.display = "block"; // show on index
  }

  if (calendarContainer.dataset.initialized) return;

  const panel  = calendarContainer.querySelector("#calendarPanel");
  const grid   = calendarContainer.querySelector(".calendar-grid");
  const label  = calendarContainer.querySelector("#monthLabel");
  const prev   = calendarContainer.querySelector("#prevMonth");
  const next   = calendarContainer.querySelector("#nextMonth");
  const toggle = calendarContainer.querySelector("#calendarToggle"); // click to open panel

  if (!panel || !grid || !label || !prev || !next || !toggle) return;

  calendarContainer.dataset.initialized = "true"; // Prevent re-initialization

  let current = new Date();

  const events = {
  "2025-12-05": [{ title: "Departmental Quiz Week", type: "exam" }],
  "2025-12-08": [{ title: "University Research Seminar", type: "activity" }],
  "2025-12-12": [{ title: "Founders Day Celebration", type: "activity" }],
  "2025-12-15": [{ title: "Final Examination Week (1st Term)", type: "exam" }],
  "2025-12-19": [{ title: "Submission of Final Projects", type: "activity" }],
  "2025-12-20": [{ title: "Start of Christmas Break", type: "activity" }],
  "2025-12-25": [{ title: "Christmas Day", type: "activity" }],
  "2025-12-31": [{ title: "New Year's Eve", type: "activity" }],

  // ===== JANUARY 2026 =====
  "2026-01-01": [{ title: "New Year's Day", type: "activity" }],
  "2026-01-05": [{ title: "End of Christmas Break", type: "activity" }],
  "2026-01-06": [{ title: "Start of 2nd Term Classes", type: "activity" }],
  "2026-01-08": [{ title: "Student Orientation & Campus Tour", type: "activity" }],
  "2026-01-15": [{ title: "Academic Advising Week", type: "activity" }],
  "2026-01-20": [{ title: "Technology & Innovation Seminar", type: "activity" }],
  "2026-01-24": [{ title: "University Sports Fest", type: "activity" }],
  "2026-01-30": [{ title: "Quiz Week (2nd Term)", type: "exam" }],

  // ===== FEBRUARY 2026 =====
  "2026-02-02": [{ title: "Examination Week", type: "exam" }],
  "2026-02-07": [{ title: "Grade Consultation Week", type: "activity" }],
  "2026-02-10": [{ title: "Career Talk & Industry Panel", type: "activity" }],
  "2026-02-14": [{ title: "University Foundation Day", type: "activity" }],
  "2026-02-18": [{ title: "Student Research Presentation", type: "activity" }],
  "2026-02-25": [{ title: "Community Outreach Program", type: "activity" }]
  };

  function renderCalendar() {
    grid.querySelectorAll(".day").forEach(d => d.remove());
    const year = current.getFullYear();
    const month = current.getMonth();
    label.textContent = current.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement("div");
      empty.className = "day inactive";
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "day";
      const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      cell.innerHTML = `<span class="date">${day}</span><div class="events-container"></div>`;
      const container = cell.querySelector(".events-container");
      if (events[key]) {
        events[key].forEach(e => {
          const ev = document.createElement("div");
          ev.className = `event ${e.type}`;
          ev.textContent = e.title;
          container.appendChild(ev);
        });
      }
      grid.appendChild(cell);
    }
  }

  prev.addEventListener("click", () => { current.setMonth(current.getMonth() - 1); renderCalendar(); });
  next.addEventListener("click", () => { current.setMonth(current.getMonth() + 1); renderCalendar(); });

  toggle.addEventListener("click", () => panel.classList.toggle("active"));

  document.addEventListener("click", e => {
    if (!e.target.closest(".floating-calendar")) panel.classList.remove("active");
  });

  renderCalendar();

  // ---------------------------
  // Show calendar only after a target section is visible
  // ---------------------------
// ---------------------------
// Show calendar only after scrolling past hero
// ---------------------------
function handleCalendarVisibility() {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  if (rect.bottom <= 0) {
    // Hero scrolled past top → show calendar
    calendarContainer.classList.add("show");
  } else {
    // Scroll back to hero → hide calendar
    calendarContainer.classList.remove("show");
  }
}

window.addEventListener("scroll", handleCalendarVisibility);
window.addEventListener("resize", handleCalendarVisibility);
handleCalendarVisibility(); // initial check


}

// ---------------------------
// Observe for new calendar nodes (Turbo-friendly)
// ---------------------------
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1 && node.querySelector && node.querySelector(".floating-calendar")) {
        initFloatingCalendar();
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// ---------------------------
// Init on first page load
// ---------------------------
document.addEventListener("turbo:load", initFloatingCalendar);
document.addEventListener("DOMContentLoaded", initFloatingCalendar);
