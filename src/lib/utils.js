import { BRAND } from './constants.js';

/**
 * Format numeric value to USD currency
 * @param {number|string} amount
 * @returns {string} e.g. "$129.00"
 */
export function formatCurrency(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: BRAND.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numeric);
}

/**
 * Display a luxury toast notification
 * @param {string} message
 * @param {'success'|'info'|'warning'} type
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? `<svg width="18" height="18" fill="none" stroke="#D4AF37" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`
    : `<svg width="18" height="18" fill="none" stroke="#D4AF37" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation safely
  const scheduleAnim = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout;
  scheduleAnim(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/**
 * Simple debounce function
 */
export function debounce(func, wait = 200) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Scroll smoothly to top of page
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
