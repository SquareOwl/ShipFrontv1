// assets/js/main.js
// Vanilla JS for the form without Bootstrap dependencies.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('alertContainer');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitSpinner = document.getElementById('submitSpinner');

  const show = (el) => { if (el) el.hidden = false; };
  const hide = (el) => { if (el) el.hidden = true; };

  function showAlert(type, message) {
    alertContainer.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.setAttribute('role', 'alert');
    wrapper.setAttribute('tabindex', '-1');
    wrapper.textContent = message;
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => wrapper.remove());
    wrapper.appendChild(closeBtn);
    alertContainer.appendChild(wrapper);
    wrapper.focus();
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    show(submitSpinner);
    submitBtnText.textContent = 'Submitting...';

    setTimeout(() => {
      hide(submitSpinner);
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Submit';

      form.reset();

      showAlert('success', 'Thank you — your message has been submitted.');
    }, 1200);
  });

  // Address modal handling (simple show/hide)
  const addressModalEl = document.getElementById('addressModal');
  const addressForm = document.getElementById('addressForm');
  const addressTypeInput = document.getElementById('addressType');
  const modalTitle = document.getElementById('addressModalLabel');

  const openModal = (type) => {
    if (!addressModalEl) return;
    if (modalTitle) modalTitle.textContent = type === 'from' ? 'Add address — Ship from' : 'Add address — Ship to';
    if (addressTypeInput) addressTypeInput.value = type;
    if (addressForm) {
      addressForm.reset();
    }
    addressModalEl.style.display = '';
    addressModalEl.removeAttribute('aria-hidden');
    const first = addressModalEl.querySelector('input, select, textarea, button');
    if (first) first.focus();
  };

  const closeModal = () => {
    if (!addressModalEl) return;
    addressModalEl.style.display = 'none';
    addressModalEl.setAttribute('aria-hidden', 'true');
  };

  // Attach open handlers to any button using data-address-type
  document.querySelectorAll('[data-address-type]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const t = btn.getAttribute('data-address-type') || 'from';
      openModal(t);
    });
  });

  // Find modal close/cancel buttons inside the simplified modal
  if (addressModalEl) {
    addressModalEl.querySelectorAll('button').forEach(b => {
      if (b.type === 'button') b.addEventListener('click', closeModal);
    });
  }

  if (addressForm) {
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!addressForm.checkValidity()) {
        const firstInvalid = addressForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const saveBtn = addressForm.querySelector('button[type="submit"]');
      const origText = saveBtn ? saveBtn.textContent : null;
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      setTimeout(() => {
        const typeLabel = addressTypeInput && addressTypeInput.value === 'to' ? 'Ship to' : 'Ship from';
        showAlert('success', `${typeLabel} address saved.`);
        closeModal();
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = origText;
        }
      }, 800);
    });
  }

  // Show/hide boxes section based on units radios
  const boxesSection = document.getElementById('boxesSection');
  const unitsRadios = Array.from(document.querySelectorAll('input[name="units"]'));

  function onUnitsChange() {
    if (!boxesSection) return;
    const selected = unitsRadios.some(r => r.checked);
    if (selected) {
      show(boxesSection);
      boxesSection.removeAttribute('aria-hidden');
      const firstInput = boxesSection.querySelector('input');
      if (firstInput) firstInput.focus();
    } else {
      hide(boxesSection);
      boxesSection.setAttribute('aria-hidden', 'true');
    }
  }

  unitsRadios.forEach((r) => r.addEventListener('change', onUnitsChange));
  onUnitsChange();

  // Update unit labels for box rows — use classes added in HTML
  const updateBoxUnits = () => {
    const isImperial = document.getElementById('unitsImperial') && document.getElementById('unitsImperial').checked;
    const dim = isImperial ? 'in' : 'cm';
    const weight = isImperial ? 'lb' : 'kg';
    document.querySelectorAll('[data-unit-dim]').forEach(el => el.textContent = dim);
    document.querySelectorAll('[data-unit-weight]').forEach(el => el.textContent = weight);
  };
  unitsRadios.forEach(r => r.addEventListener('change', updateBoxUnits));
  updateBoxUnits();

  // Boxes add/remove rows
  const boxesList = document.getElementById('boxesList');
  const addBoxBtn = document.getElementById('addBoxBtn');

  const manageRemoveVisibility = () => {
    if (!boxesList) return;
    const rows = boxesList.querySelectorAll('[data-box-row]');
    rows.forEach((r, idx) => {
      const btn = r.querySelector('[data-remove-btn]');
      if (!btn) return;
      if (idx === 0) hide(btn);
      else show(btn);
    });
  };

  const attachRowRemoveHandler = (btn) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const row = e.currentTarget.closest('[data-box-row]');
      if (row && boxesList.contains(row)) {
        row.remove();
        manageRemoveVisibility();
      }
    });
  };

  const configureQuantityAddon = (qtyInput) => {
    if (!qtyInput) return;
    const updateAddon = (val) => {
      const group = qtyInput.parentElement;
      if (!group) return;
      const addon = group.querySelector('.qty-addon');
      if (!addon) return;
      addon.textContent = (Number(val) > 1) ? 'boxes' : 'box';
    };
    const handler = (e) => updateAddon(e.target.value);
    qtyInput.addEventListener('input', handler);
    qtyInput.addEventListener('change', handler);
    updateAddon(qtyInput.value || 1);
  };

  const makeRowClone = () => {
    if (!boxesList) return null;
    const template = boxesList.querySelector('[data-box-row]');
    if (!template) return null;
    const clone = template.cloneNode(true);
    clone.querySelectorAll('input').forEach((inp) => {
      if (inp.type === 'number') {
        if (inp.name === 'boxQty[]') inp.value = 1;
        else inp.value = '';
      } else {
        inp.value = '';
      }
    });
    const removeBtn = clone.querySelector('[data-remove-btn]');
    if (removeBtn) {
      show(removeBtn);
      attachRowRemoveHandler(removeBtn);
    }
    const qtyInput = clone.querySelector('input[name="boxQty[]"]');
    configureQuantityAddon(qtyInput);
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
    boxesList.querySelectorAll('.remove-box').forEach(btn => attachRowRemoveHandler(btn));
    boxesList.querySelectorAll('input[name="boxQty[]"]').forEach(configureQuantityAddon);
    manageRemoveVisibility();
  }

  // Restrict pickup date to today or later
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
    pickupDateInput.addEventListener('focus', () => {
      try {
        if (typeof pickupDateInput.showPicker === 'function') pickupDateInput.showPicker();
        else pickupDateInput.click();
      } catch (err) {}
    });
  }
});
