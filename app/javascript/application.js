// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

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

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.fade-left, .fade-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
});

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay h3').textContent;
    const description = item.dataset.description; // get description

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxDescription = document.getElementById('lightboxDescription');

    lightboxImage.src = img.src;
    lightboxCaption.textContent = caption;
    lightboxDescription.textContent = description;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

const closeBtn = document.getElementById('closeBtn');
const lightbox = document.getElementById('lightbox');

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay h3').textContent;
    const longDesc = item.dataset.long;

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxDescription = document.getElementById('lightboxDescription');

    lightboxImage.src = img.src;
    lightboxCaption.textContent = caption;
    lightboxDescription.textContent = longDesc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

