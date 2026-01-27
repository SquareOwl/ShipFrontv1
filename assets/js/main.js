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

  // Address modal handling
  const addressModalEl = document.getElementById('addressModal');
  const addressForm = document.getElementById('addressForm');
  const addressTypeInput = document.getElementById('addressType');

  if (addressModalEl) {
    addressModalEl.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      const type = button ? button.getAttribute('data-address-type') : 'from';
      const modalTitle = document.getElementById('addressModalLabel');
      if (modalTitle) modalTitle.textContent = type === 'from' ? 'Add address — Ship from' : 'Add address — Ship to';
      if (addressTypeInput) addressTypeInput.value = type;
      if (addressForm) {
        addressForm.reset();
        addressForm.classList.remove('was-validated');
      }
    });
  }

  if (addressForm) {
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!addressForm.checkValidity()) {
        addressForm.classList.add('was-validated');
        const firstInvalid = addressForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate saving the address and close modal
      const saveBtn = addressForm.querySelector('button[type="submit"]');
      const origText = saveBtn ? saveBtn.innerHTML : null;
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving...';
      }

      setTimeout(() => {
        const typeLabel = addressTypeInput && addressTypeInput.value === 'to' ? 'Ship to' : 'Ship from';
        showAlert('success', `${typeLabel} address saved.`);
        // Hide modal
        const modalInstance = bootstrap.Modal.getInstance(addressModalEl);
        if (modalInstance) modalInstance.hide();
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = origText;
        }
      }, 800);
    });
  }

  // Prevent selecting countries outside US/UK: show persistent alert inside modal when 'Other' selected
  const modalCountry = document.getElementById('country');
  let modalPersistentAlert = null;

  function showModalPersistentAlert() {
    if (!addressModalEl) return;
    const modalBody = addressModalEl.querySelector('.modal-body');
    if (!modalBody) return;
    if (modalPersistentAlert) return;
    modalPersistentAlert = document.createElement('div');
    modalPersistentAlert.className = 'alert alert-danger';
    modalPersistentAlert.setAttribute('role', 'alert');
    modalPersistentAlert.textContent = 'We only ship to the US and UK now.';
    modalBody.insertBefore(modalPersistentAlert, modalBody.firstChild);
  }

  function removeModalPersistentAlert() {
    if (!modalPersistentAlert) return;
    modalPersistentAlert.remove();
    modalPersistentAlert = null;
  }

  function updateModalSaveState() {
    const saveBtn = addressForm ? addressForm.querySelector('button[type="submit"]') : null;
    if (!modalCountry) {
      if (saveBtn) saveBtn.disabled = false;
      return;
    }
    if (modalCountry.value === 'OTHER') {
      showModalPersistentAlert();
      if (saveBtn) saveBtn.disabled = true;
    } else {
      removeModalPersistentAlert();
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  if (modalCountry) {
    modalCountry.addEventListener('change', updateModalSaveState);
  }

  // Ensure modal alert state is correct when modal opens
  if (addressModalEl) {
    addressModalEl.addEventListener('shown.bs.modal', () => {
      updateModalSaveState();
    });
    addressModalEl.addEventListener('hide.bs.modal', () => {
      // cleanup persistent alert when modal is closed
      removeModalPersistentAlert();
    });
  }
});
