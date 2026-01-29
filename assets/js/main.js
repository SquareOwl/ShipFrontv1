document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('alertContainer');

  function showAlert(message) {
    const alert = document.createElement('div');
    alert.textContent = message;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => alert.remove());
    alert.appendChild(closeBtn);
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
  }

  // Main form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    showAlert('Shipment submitted successfully.');
  });

  // Address modal
  const modal = document.getElementById('addressModal');
  const modalTitle = document.getElementById('addressModalLabel');
  const addressForm = document.getElementById('addressForm');
  const addressType = document.getElementById('addressType');

  document.querySelectorAll('[data-address-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-address-type');
      modalTitle.textContent = type === 'from' ? 'Add address — Ship from' : 'Add address — Ship to';
      addressType.value = type;
      addressForm.reset();
      modal.hidden = false;
    });
  });

  modal.querySelector('button[type="button"]')?.addEventListener('click', () => {
    modal.hidden = true;
  });

  addressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('Address saved.');
    modal.hidden = true;
  });

  // Boxes section
  const boxesSection = document.getElementById('boxesSection');
  const boxesList = document.getElementById('boxesList');
  const unitsRadios = document.querySelectorAll('input[name="units"]');

  function updateUnits() {
    const isImperial = document.getElementById('unitsImperial').checked;
    const dim = isImperial ? 'in' : 'cm';
    const weight = isImperial ? 'lb' : 'kg';
    document.querySelectorAll('[data-unit-dim]').forEach(el => el.textContent = dim);
    document.querySelectorAll('[data-unit-weight]').forEach(el => el.textContent = weight);
  }

  unitsRadios.forEach(r => {
    r.addEventListener('change', () => {
      boxesSection.hidden = !Array.from(unitsRadios).some(x => x.checked);
      updateUnits();
    });
  });

  boxesSection.hidden = !Array.from(unitsRadios).some(x => x.checked);
  updateUnits();

  // Add/remove box rows
  document.getElementById('addBoxBtn').addEventListener('click', () => {
    const template = boxesList.querySelector('[data-box-row]');
    const clone = template.cloneNode(true);
    clone.querySelectorAll('input').forEach(inp => {
      if (inp.name === 'boxQty[]') inp.value = 1;
      else if (inp.type === 'number') inp.value = '';
    });
    const removeBtn = clone.querySelector('[data-remove-btn]');
    removeBtn.hidden = false;
    removeBtn.addEventListener('click', () => {
      clone.remove();
      updateRemoveButtons();
    });
    boxesList.appendChild(clone);
    updateRemoveButtons();
  });

  function updateRemoveButtons() {
    boxesList.querySelectorAll('[data-remove-btn]').forEach((btn, idx) => {
      btn.hidden = idx === 0;
    });
  }

  updateRemoveButtons();

  // Pickup date: no enforced minimum (validation removed)
});
