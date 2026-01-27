Plan: Single-Page Form Website (Bootstrap CDN + Vanilla JS)

Objective
- Build a single, accessible, responsive HTML page that contains a form. Use only Bootstrap components (linked via CDN) and plain (vanilla) JavaScript for behavior. No custom CSS, no images, and no backend for now.

Steps
1. Confirm purpose and fields
   - Define the primary purpose of the form (signup, lead capture, survey, etc.).
   - List required fields, types, and validation rules (required, patterns, maxlength, specific input types).
   - Decide UX states to support: idle, validating, field errors, global error, success/thank-you.

2. Project layout (minimal)
   - Single file: `index.html` will contain the complete page structure and Bootstrap CDN links.
   - Small script: `assets/js/main.js` will hold all vanilla JS behavior (validation, simulated submit, UI state toggles).
   - No custom CSS or image assets — rely exclusively on Bootstrap classes and components.

3. HTML boilerplate & CDN placement
   - Use a standard HTML5 skeleton with `meta viewport` and a language attribute.
   - Include the Bootstrap CSS CDN link in the document `<head>` (use SRI and `crossorigin` when available).
   - Include the Bootstrap JS bundle CDN (contains Popper) just before `</body>` so scripts run after DOM parsing.
   - Load `assets/js/main.js` after the Bootstrap JS bundle (or with `defer`) so your code can rely on Bootstrap JS if needed.

4. Page structure and Bootstrap components
   - Wrap content in a `.container`, center the form using `.row` and a responsive `.col-*-*` column.
   - Build the form using pure Bootstrap controls: `.form-control`, `.form-select`, `.form-check`, `.invalid-feedback`, `.valid-feedback`.
   - Provide a form-level message area (Bootstrap `.alert`) and an `aria-live` region to announce dynamic messages for assistive tech.
   - Keep markup semantic: proper `<label for>` associations, grouped fields (fieldset/legend if helpful), and a single submit button using `.btn`.

5. Vanilla JS behavior and validation
   - Attach event listeners on `DOMContentLoaded` in `assets/js/main.js` and bind a single `submit` handler for the form.
   - Use native Constraint Validation API (`checkValidity()`, `reportValidity()`) as the baseline; enhance visual feedback by toggling Bootstrap classes (`was-validated`, `is-invalid`, `is-valid`).
   - On invalid submission: prevent default, focus the first invalid field, show its `.invalid-feedback`, and expose a brief global alert message.
   - On simulated submission: disable inputs and the submit button, show an accessible spinner or busy label, then show a `.alert-success` on completion and move focus to it (or keep focus logical for keyboard users).
   - Keep all JS unobtrusive and modular; avoid inline event attributes and do not use jQuery.

6. Accessibility and UX
   - Ensure labels are associated to inputs, provide clear feedback text, and use `aria-live`/`role=status` for dynamic messages.
   - Manage focus after validation errors or success messages: move focus to first invalid control or to the success alert so screen-reader users hear changes.
   - Maintain keyboard operability and visible focus states; do not depend on hover-only interactions.

7. Testing and edge cases
   - Test across common breakpoints (mobile, tablet, desktop) using browser dev tools and at least one real device if possible.
   - Validate keyboard navigation and screen-reader announcements for both error and success flows.
   - Test with JS disabled — native HTML validation should still prevent bad submissions; simulate CDN/JS failure and ensure the page degrades gracefully.

8. Future integration notes (when backend is ready)
   - Replace simulated submit flow with `fetch()` POST to an API endpoint; handle promise success/failure to update UI accordingly.
   - Keep `assets/js/main.js` small and adapt submission logic to handle real network errors and server-side validation responses.

Checklist (before closing)
- Confirm exact form fields and validation rules.
- Implement `index.html` with Bootstrap CDN links and markup.
- Implement `assets/js/main.js` to handle validation and simulated submission.
- Test accessibility, responsiveness, and graceful degradation.
- Deploy to static host (GitHub Pages, Netlify, or Vercel) over HTTPS; use SRI for CDN links.

Notes
- The plan intentionally avoids any custom CSS: all styling must come from Bootstrap classes. JS must be plain vanilla JavaScript. No images or SEO setup are required for this phase.
