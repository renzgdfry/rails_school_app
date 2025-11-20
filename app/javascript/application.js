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
