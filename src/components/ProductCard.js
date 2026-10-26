import { formatCurrency } from '../lib/utils.js';
import { cart } from '../lib/cart.js';

export function renderProductCard(product) {
  const isAvailable = product.availableForSale !== false;
  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;

  return `
    <article class="product-card" data-product-handle="${product.handle}" id="product-${product.handle}">
      <div class="card-media">
        <a href="#/product/${product.handle}" aria-label="View ${product.title}">
          <img 
            src="${product.images[0]}" 
            alt="${product.title}" 
            class="card-img" 
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'"
          />
        </a>

        <!-- Badges -->
        <div class="card-badges">
          ${product.benefitTag ? `<span class="badge badge-gold">${product.benefitTag}</span>` : ''}
          ${hasComparePrice ? `<span class="badge badge-urgent">Limited Reserve</span>` : ''}
        </div>

        <!-- Quick View Action Button -->
        <div class="card-actions-hover">
          <button class="btn btn-dark quick-view-btn" data-handle="${product.handle}" style="flex: 1; min-height: 40px; font-size: 0.75rem;">
            Quick View
          </button>
        </div>
      </div>

      <div class="card-content">
        <span class="card-category">${product.category || 'Smart Living'}</span>
        <h3 class="card-title">
          <a href="#/product/${product.handle}">${product.title}</a>
        </h3>

        <!-- Star Reviews -->
        <div class="rating-stars card-rating">
          <span class="stars-gold" aria-hidden="true">★★★★★</span>
          <span class="rating-count">(${product.reviewCount || 48})</span>
        </div>

        <!-- Pricing Row -->
        <div class="card-price-row">
          <span class="card-price">${formatCurrency(product.price)}</span>
          ${hasComparePrice ? `<span class="card-compare-price">${formatCurrency(product.compareAtPrice)}</span>` : ''}
        </div>

        <!-- Add to Cart CTA -->
        <button 
          class="btn btn-gold card-btn-add add-to-cart-direct-btn" 
          data-handle="${product.handle}"
          ${!isAvailable ? 'disabled' : ''}
        >
          ${isAvailable ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>
    </article>
  `;
}

/**
 * Bind product card event listeners (Quick View & Direct Add)
 * @param {HTMLElement} container
 * @param {Array} products
 */
export function bindProductCardEvents(container, products) {
  if (!container) return;

  // Quick View click
  container.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const handle = btn.dataset.handle;
      const product = products.find(p => p.handle === handle);
      if (product) {
        window.dispatchEvent(new CustomEvent('vexo:open-quickview', { detail: { product } }));
      }
    });
  });

  // Direct Add to Cart click
  container.querySelectorAll('.add-to-cart-direct-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const handle = btn.dataset.handle;
      const product = products.find(p => p.handle === handle);
      if (product) {
        cart.addItem(product, product.variants?.[0] || null, 1);
      }
    });
  });
}
