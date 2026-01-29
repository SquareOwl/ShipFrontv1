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
  const unitsRadios = Array.from(document.querySelectorAll('input[name="units"]'));

  function onUnitsChange() {
    if (!boxesSection) return;
    const selected = unitsRadios.some(r => r.checked);
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

  unitsRadios.forEach((r) => {
    r.addEventListener('change', onUnitsChange);
  });
  // Initialize state
  onUnitsChange();

  // Update unit labels for box rows
  const updateBoxUnits = () => {
    const isImperial = document.getElementById('unitsImperial') && document.getElementById('unitsImperial').checked;
    const dim = isImperial ? 'in' : 'cm';
    const weight = isImperial ? 'lb' : 'kg';
    document.querySelectorAll('.box-unit-dim').forEach(el => el.textContent = dim);
    document.querySelectorAll('.box-unit-weight').forEach(el => el.textContent = weight);
  };
  unitsRadios.forEach(r => r.addEventListener('change', updateBoxUnits));
  updateBoxUnits();

  // Add / remove rows for the Boxes section (uses #boxesList and #addBoxBtn)
  const boxesList = document.getElementById('boxesList');
  const addBoxBtn = document.getElementById('addBoxBtn');

  const manageRemoveVisibility = () => {
    if (!boxesList) return;
    const rows = boxesList.querySelectorAll('.box-row');
    // Always hide the remove button on the first row; show it for subsequent rows
    rows.forEach((r, idx) => {
      const btn = r.querySelector('.remove-box');
      if (!btn) return;
      if (idx === 0) btn.classList.add('d-none');
      else btn.classList.remove('d-none');
    });
  };

  const makeRowClone = () => {
    if (!boxesList) return null;
    const template = boxesList.querySelector('.box-row');
    if (!template) return null;
    const clone = template.cloneNode(true);
    // Clear values on cloned inputs
    clone.querySelectorAll('input').forEach((inp) => {
      if (inp.type === 'number') {
        if (inp.name === 'boxQty[]') inp.value = 1;
        else inp.value = '';
      } else {
        inp.value = '';
      }
    });
    // Wire remove button on the clone
    const removeBtn = clone.querySelector('.remove-box');
    if (removeBtn) {
      removeBtn.classList.remove('d-none');
      removeBtn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.box-row');
        if (row && boxesList.contains(row)) {
          row.remove();
          manageRemoveVisibility();
        }
      });
    }
    // Ensure quantity addon and listener are set on the clone
    const qtyInput = clone.querySelector('input[name="boxQty[]"]');
    if (qtyInput) {
      const setAddon = (val) => {
        const group = qtyInput.closest('.input-group');
        if (!group) return;
        const addon = group.querySelector('.input-group-text');
        if (!addon) return;
        addon.textContent = (Number(val) > 1) ? 'boxes' : 'box';
      };
      qtyInput.addEventListener('input', (e) => setAddon(e.target.value));
      qtyInput.addEventListener('change', (e) => setAddon(e.target.value));
      // initialize addon text
      setAddon(qtyInput.value || 1);
    }
    return clone;
  };

  if (addBoxBtn && boxesList) {
    addBoxBtn.addEventListener('click', () => {
      const newRow = makeRowClone();
      if (newRow) {
        boxesList.appendChild(newRow);
        updateBoxUnits();
        const firstInput = newRow.querySelector('input');
        if (firstInput) firstInput.focus();
      }
      manageRemoveVisibility();
    });
    // Wire remove on any existing remove button
    boxesList.querySelectorAll('.remove-box').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.box-row');
        if (row && boxesList.contains(row)) {
          row.remove();
          manageRemoveVisibility();
        }
      });
    });
    // Bind quantity listeners on existing rows so addon toggles
    boxesList.querySelectorAll('input[name="boxQty[]"]').forEach((qtyInput) => {
      const setAddon = (val) => {
        const group = qtyInput.closest('.input-group');
        if (!group) return;
        const addon = group.querySelector('.input-group-text');
        if (!addon) return;
        addon.textContent = (Number(val) > 1) ? 'boxes' : 'box';
      };
      qtyInput.addEventListener('input', (e) => setAddon(e.target.value));
      qtyInput.addEventListener('change', (e) => setAddon(e.target.value));
      setAddon(qtyInput.value || 1);
    });
    // initial visibility
    manageRemoveVisibility();
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

    // Make the entire pickup date container open the native date picker
    // When available use `showPicker()`, otherwise fall back to focus+click.
    const pickupContainer = pickupDateInput.closest('.mb-3');
    if (pickupContainer) {
      pickupContainer.style.cursor = 'pointer';
      pickupContainer.addEventListener('click', (ev) => {
        // Ignore clicks directly on interactive elements to avoid double actions
        if (ev.target === pickupDateInput) return;
        try {
          if (typeof pickupDateInput.showPicker === 'function') {
            pickupDateInput.showPicker();
          } else {
            pickupDateInput.focus();
            pickupDateInput.click();
          }
        } catch (err) {
          pickupDateInput.focus();
        }
      });
    }
  }
});
