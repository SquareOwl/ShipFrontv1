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

  // Inline address forms (Ship from / Ship to)
  const addressFormFrom = document.getElementById('addressFormFrom');
  const addressFormTo = document.getElementById('addressFormTo');

  // Buttons focus corresponding form
  document.querySelector('[data-address-type="from"]')?.addEventListener('click', () => {
    addressFormFrom?.querySelector('input')?.focus();
  });
  document.querySelector('[data-address-type="to"]')?.addEventListener('click', () => {
    addressFormTo?.querySelector('input')?.focus();
  });

  if (addressFormFrom) {
    addressFormFrom.addEventListener('submit', (e) => {
      e.preventDefault();
      showAlert('Ship from address saved.');
      addressFormFrom.reset();
    });
  }
  if (addressFormTo) {
    addressFormTo.addEventListener('submit', (e) => {
      e.preventDefault();
      showAlert('Ship to address saved.');
      addressFormTo.reset();
    });
  }

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
