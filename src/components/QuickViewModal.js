import { formatCurrency } from '../lib/utils.js';
import { cart } from '../lib/cart.js';

export function renderQuickViewModal() {
  return `
    <div class="modal-overlay" id="quickview-overlay" aria-hidden="true">
      <div class="quickview-modal" id="quickview-modal" role="dialog" aria-modal="true">
        <!-- Content populated dynamically -->
      </div>
    </div>
  `;
}

export function initQuickViewModal() {
  const overlay = document.getElementById('quickview-overlay');
  const modal = document.getElementById('quickview-modal');

  function closeModal() {
    overlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('vexo:open-quickview', (e) => {
    const product = e.detail.product;
    if (!product || !modal) return;

    let selectedVariant = product.variants?.[0] || null;
    let quantity = 1;

    modal.innerHTML = `
      <button class="modal-close-btn" id="quickview-close-btn" aria-label="Close modal">✕</button>
      
      <div style="background: #181818; aspect-ratio: 1/1; position: relative; overflow: hidden;">
        <img 
          src="${product.images[0]}" 
          alt="${product.title}" 
          style="width: 100%; height: 100%; object-fit: cover;" 
        />
      </div>

      <div style="padding: 2.5rem; display: flex; flex-direction: column;">
        <span class="badge badge-gold" style="align-self: flex-start; margin-bottom: 0.75rem;">
          ${product.benefitTag || 'Smart Living'}
        </span>
        
        <h2 style="font-family: var(--font-heading); font-size: 1.75rem; color: #FFF; margin-bottom: 0.5rem;">
          ${product.title}
        </h2>

        <div class="rating-stars" style="margin-bottom: 1rem;">
          <span class="stars-gold">★★★★★</span>
          <span class="rating-count">(${product.reviewCount || 48} reviews)</span>
        </div>

        <div style="font-size: 1.5rem; font-weight: 800; color: #FFF; margin-bottom: 1rem;">
          ${formatCurrency(product.price)}
        </div>

        <p style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
          ${product.description ? product.description.slice(0, 160) + '...' : 'Engineered with commercial-grade durability and minimalist aesthetics for modern living spaces.'}
        </p>

        <!-- Variants if present -->
        ${product.variants && product.variants.length > 1 ? `
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; color: #FFF;">
              Option: <span id="qv-variant-name" style="color: var(--color-gold);">${selectedVariant.title}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${product.variants.map((v, i) => `
                <button 
                  class="variant-chip ${i === 0 ? 'is-selected' : ''}" 
                  data-variant-id="${v.id}"
                  data-variant-title="${v.title}"
                  data-variant-price="${v.price}"
                >
                  ${v.title}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Add to Bag CTA -->
        <div style="margin-top: auto; display: flex; gap: 0.75rem;">
          <button class="btn btn-gold" id="qv-add-btn" style="flex: 1;">
            Add to Bag • ${formatCurrency(product.price)}
          </button>
        </div>

        <a href="#/product/${product.handle}" id="qv-view-full-btn" style="text-align: center; margin-top: 1rem; font-size: 0.8rem; color: var(--color-text-muted); text-decoration: underline;">
          View Full Product Details →
        </a>
      </div>
    `;

    document.getElementById('quickview-close-btn')?.addEventListener('click', closeModal);
    document.getElementById('qv-view-full-btn')?.addEventListener('click', closeModal);

    // Variant selector clicks
    modal.querySelectorAll('.variant-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        modal.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        const vId = chip.dataset.variantId;
        selectedVariant = product.variants.find(v => v.id === vId) || selectedVariant;
        const nameEl = document.getElementById('qv-variant-name');
        if (nameEl) nameEl.textContent = selectedVariant.title;
      });
    });

    // Add to cart click
    document.getElementById('qv-add-btn')?.addEventListener('click', () => {
      cart.addItem(product, selectedVariant, quantity);
      closeModal();
    });

    overlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
