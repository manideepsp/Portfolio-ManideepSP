// Shared toast helper used across pages
export function ensureToastContainer() {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

export function showToast(type, message, ms = 4000) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `<div class="toast-body">${message}<button class="toast-close" aria-label="Dismiss">×</button></div>`;
  container.appendChild(toast);
  // dismiss handler
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 220);
  });

  // auto remove
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => { try { toast.remove(); } catch (e) {} }, 220);
  }, ms);
}
