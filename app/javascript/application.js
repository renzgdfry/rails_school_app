// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener("turbo:load", () => {
  const deleteModal = document.getElementById("confirmDeleteModal");
  const deleteForm = document.getElementById("deleteStudentForm");

  if (!deleteModal || !deleteForm) return;

  deleteModal.addEventListener("show.bs.modal", event => {
    const button = event.relatedTarget;
    const studentId = button.getAttribute("data-student-id");
    deleteForm.action = `/students/${studentId}`;
    
    // Add CSRF token manually (fixes ActionController::InvalidAuthenticityToken)
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    let csrfInput = deleteForm.querySelector('input[name="authenticity_token"]');
    if (!csrfInput) {
      csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'authenticity_token';
      deleteForm.appendChild(csrfInput);
    }
    csrfInput.value = csrfToken;
  });
});