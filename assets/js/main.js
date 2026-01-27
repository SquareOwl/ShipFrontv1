// assets/js/main.js
// Placeholder for vanilla JS behavior for the form.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('alertContainer');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitSpinner = document.getElementById('submitSpinner');

  function showAlert(type, message) {
    // Insert a Bootstrap alert and focus it for accessibility
    alertContainer.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible" role="alert" tabindex="-1">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    alertContainer.appendChild(wrapper);
    const alertEl = alertContainer.querySelector('.alert');
    if (alertEl) alertEl.focus();
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Clear previous messages
    alertContainer.innerHTML = '';

    // Use Constraint Validation API
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission: disable controls and show spinner
    submitBtn.disabled = true;
    submitSpinner.classList.remove('d-none');
    submitBtnText.textContent = 'Submitting...';

    // Simulate async network call
    setTimeout(() => {
      // Reset UI state
      submitSpinner.classList.add('d-none');
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Submit';

      // Reset form and validation state
      form.reset();
      form.classList.remove('was-validated');

      // Show success message
      showAlert('success', 'Thank you — your message has been submitted.');
    }, 1200);
  });
});
