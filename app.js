'use strict';
(() => {
  const trigger = document.querySelector('#review-trigger');
  const panel = document.querySelector('#review-panel');
  const urlField = document.querySelector('#review-url');
  const copy = document.querySelector('#copy-link');
  const cancel = document.querySelector('#cancel-review');
  const status = document.querySelector('#copy-status');
  let generation = 0;
  trigger.hidden = false;
  const close = () => {
    generation += 1;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    copy.disabled = false;
    status.textContent = '';
    trigger.focus();
  };
  trigger.addEventListener('click', () => {
    if (!panel.hidden) { close(); return; }
    generation += 1;
    status.textContent = '';
    if (!['http:', 'https:'].includes(window.location.protocol)) {
      status.textContent = 'Link is not available here.';
      return;
    }
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    urlField.value = url.href;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    urlField.focus();
    urlField.select();
  });
  cancel.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { close(); }
  });
  copy.addEventListener('click', async () => {
    if (copy.disabled) return;
    const attempt = generation;
    copy.disabled = true;
    status.textContent = 'Copying link…';
    try {
      if (!window.isSecureContext || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(urlField.value);
      if (attempt === generation && !panel.hidden) status.textContent = 'Link copied.';
    } catch (_) {
      if (attempt === generation && !panel.hidden) {
        status.textContent = 'Could not copy automatically. Select and copy the link.';
        urlField.focus();
        urlField.select();
      }
    } finally {
      if (attempt === generation) copy.disabled = false;
    }
  });
})();
