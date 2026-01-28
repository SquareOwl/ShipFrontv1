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

  // Show boxes section when a units radio is selected
  const boxesSection = document.getElementById('boxesSection');
  const unitsRadios = document.querySelectorAll('input[name="units"]');
  function onUnitsChange() {
    if (!boxesSection) return;
    // If any radio is checked, reveal boxes
    const selected = Array.from(unitsRadios).some(r => r.checked);
    if (selected) {
      boxesSection.classList.remove('d-none');
      boxesSection.removeAttribute('aria-hidden');
      const firstInput = boxesSection.querySelector('input');
      if (firstInput) firstInput.focus();
    } else {
      boxesSection.classList.add('d-none');
      boxesSection.setAttribute('aria-hidden', 'true');
    }
  }
  unitsRadios.forEach(r => r.addEventListener('change', onUnitsChange));
  // initialize visibility
  onUnitsChange();

  // Update unit prefixes for box inputs (in/cm for dims, lb/kg for weight)
  const updateBoxUnits = () => {
    const isImperial = document.getElementById('unitsImperial') && document.getElementById('unitsImperial').checked;
    const dim = isImperial ? 'in' : 'cm';
    const weight = isImperial ? 'lb' : 'kg';
    const boxUnitDimElems = document.querySelectorAll('.box-unit-dim');
    const boxUnitWeightElems = document.querySelectorAll('.box-unit-weight');
    boxUnitDimElems.forEach(el => el.textContent = dim);
    boxUnitWeightElems.forEach(el => el.textContent = weight);
  };
  unitsRadios.forEach(r => r.addEventListener('change', updateBoxUnits));
  // initialize unit labels
  updateBoxUnits();

  // Add-box behavior: append a new row cloned from template
  const addBoxBtn = document.getElementById('addBoxBtn');
  const boxesRows = document.getElementById('boxesRows');
  const boxRowTemplate = document.getElementById('boxRowTemplate');
  if (addBoxBtn && boxesRows && boxRowTemplate) {
    addBoxBtn.addEventListener('click', () => {
      const clone = boxRowTemplate.content.cloneNode(true);
      boxesRows.appendChild(clone);
      // ensure new unit labels reflect current unit selection
      updateBoxUnits();
      // focus first input of the newly added row
      const lastRow = boxesRows.lastElementChild;
      if (lastRow) {
        const firstInput = lastRow.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    });
  }

  // Remove-last-row button (next to Add box) behavior
  const removeLastBoxBtn = document.getElementById('removeLastBoxBtn');
  if (removeLastBoxBtn && boxesRows) {
    removeLastBoxBtn.addEventListener('click', () => {
      const topRows = Array.from(boxesRows.children).filter(n => n.classList && n.classList.contains('row'));
      if (topRows.length > 1) {
        const last = topRows[topRows.length - 1];
        last.remove();
      } else if (topRows.length === 1) {
        const inputs = topRows[0].querySelectorAll('input');
        inputs.forEach(i => i.value = '');
      }
      updateBoxUnits();
    });
  }

  // Restrict the pickup date input to today or later
  const pickupDateInput = document.getElementById('pickupDate');
  if (pickupDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    pickupDateInput.setAttribute('min', minDate);
    if (pickupDateInput.value && pickupDateInput.value < minDate) {
      pickupDateInput.value = '';
    }
  }
});
