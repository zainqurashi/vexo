import { TRUST_POINTS } from '../lib/constants.js';

export function renderTrustStrip() {
  const getIconSvg = (type) => {
    switch (type) {
      case 'shipping':
        return `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M5 18h14M5 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-14-2V6a2 2 0 0 1 2-2h8l4 4v6m-4-6h4v4h-4"/></svg>`;
      case 'trial':
        return `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
      case 'warranty':
        return `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2l7 4v6c0 5.25-3.5 10-7 11-3.5-1-7-5.75-7-11V6l7-4z"/></svg>`;
      case 'support':
      default:
        return `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    }
  };

  return `
    <section class="trust-strip" aria-label="Customer Guarantees">
      <div class="container">
        <div class="trust-grid">
          ${TRUST_POINTS.map(point => `
            <div class="trust-item">
              <div class="trust-icon-wrapper">
                ${getIconSvg(point.icon)}
              </div>
              <div>
                <h4 class="trust-title">${point.title}</h4>
                <p class="trust-desc">${point.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
