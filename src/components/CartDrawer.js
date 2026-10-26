import { cart } from '../lib/cart.js';
import { formatCurrency } from '../lib/utils.js';

export function renderCartDrawer() {
  return `
    <div class="cart-overlay" id="cart-overlay" aria-hidden="true"></div>
    <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <!-- Drawer Content injected dynamically -->
      <div id="cart-drawer-content" style="display: flex; flex-direction: column; height: 100%;"></div>
    </aside>
  `;
}

export function updateCartDrawerDOM() {
  const container = document.getElementById('cart-drawer-content');
  if (!container) return;

  const items = cart.getItems();
  const count = cart.getTotalCount();
  const subtotal = cart.getSubtotal();
  const shipping = cart.getFreeShippingProgress();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-header">
        <h2 class="cart-title">Your Bag <span class="cart-item-count">(0)</span></h2>
        <button class="cart-close-btn" id="cart-close-btn" aria-label="Close bag">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="cart-empty-state">
        <svg class="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <h3 class="cart-empty-title">Your Bag is Empty</h3>
        <p class="cart-empty-text">Discover precision kitchenware and smart living essentials engineered for your home.</p>
        <a href="#/catalog" class="btn btn-gold" id="empty-cart-explore-btn">Explore Catalog</a>
      </div>
    `;

    document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
    document.getElementById('empty-cart-explore-btn')?.addEventListener('click', closeCart);
    return;
  }

  // Shipping text
  const shippingText = shipping.isUnlocked
    ? `<span>✓ Unlocked:</span> Complimentary Worldwide Express Shipping`
    : `Add <span>${formatCurrency(shipping.remaining)}</span> more for <span>Free Express Delivery</span>`;

  // Render full cart with items
  container.innerHTML = `
    <!-- Header -->
    <div class="cart-header">
      <h2 class="cart-title">Your Bag <span class="cart-item-count">(${count})</span></h2>
      <button class="cart-close-btn" id="cart-close-btn" aria-label="Close shopping bag">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Free Shipping Progress -->
    <div class="free-shipping-bar">
      <p class="shipping-bar-text">${shippingText}</p>
      <div class="shipping-progress-track">
        <div class="shipping-progress-fill" style="width: ${shipping.percentage}%"></div>
      </div>
    </div>

    <!-- Cart Item List -->
    <div class="cart-items-wrapper">
      ${items.map(item => `
        <div class="cart-item" data-variant-id="${item.variantId}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" loading="lazy" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            ${item.variantTitle ? `<p class="cart-item-variant">${item.variantTitle}</p>` : ''}
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
            
            <div class="cart-item-actions">
              <div class="qty-stepper">
                <button class="qty-btn" data-action="decrease" data-id="${item.variantId}" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.variantId}" aria-label="Increase quantity">+</button>
              </div>
              <button class="cart-item-remove" data-action="remove" data-id="${item.variantId}" aria-label="Remove item">Remove</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Curated Upsell Cross-sell -->
    <div class="cart-upsell-section">
      <div class="cart-upsell-title">
        <svg width="14" height="14" fill="#D4AF37" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>Recommended Pairing</span>
      </div>
      <div class="cart-upsell-card">
        <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=150&q=80" alt="Aerator" class="cart-upsell-img" />
        <div class="cart-upsell-info">
          <div class="cart-upsell-name">Precision Pour Aerator</div>
          <div class="cart-upsell-price">$38.00</div>
        </div>
        <button class="btn btn-outline-gold cart-upsell-btn" id="add-upsell-btn">Add +</button>
      </div>
    </div>

    <!-- Drawer Footer -->
    <div class="cart-footer">
      <div class="cart-subtotal-row">
        <span class="cart-subtotal-label">Subtotal</span>
        <span class="cart-subtotal-val">${formatCurrency(subtotal)}</span>
      </div>
      <p class="cart-taxes-note">Taxes, duties & shipping calculated at checkout</p>
      
      <button class="btn btn-gold cart-checkout-btn" id="cart-checkout-btn">
        Proceed to Checkout →
      </button>

      <div class="cart-security-note">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        <span>Encrypted 256-Bit Shopify Checkout</span>
      </div>
    </div>
  `;

  // Bind Listeners
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
  
  // Checkout trigger
  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    cart.redirectToCheckout();
  });

  // Upsell trigger
  document.getElementById('add-upsell-btn')?.addEventListener('click', () => {
    cart.addItem({
      id: 'gid://shopify/Product/upsell-aerator',
      handle: 'precision-pour-aerator',
      title: 'Precision Pour Aerator',
      price: 38.00,
      images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80'],
      benefitTag: 'Bar Innovation'
    }, null, 1);
  });

  // Quantity and remove button delegation
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const currentItem = items.find(i => i.variantId === id);
      if (!currentItem) return;

      if (action === 'increase') {
        cart.updateQuantity(id, currentItem.quantity + 1);
      } else if (action === 'decrease') {
        cart.updateQuantity(id, currentItem.quantity - 1);
      }
    });
  });

  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      cart.removeItem(id);
    });
  });
}

function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  updateCartDrawerDOM();
  drawer?.classList.add('is-open');
  overlay?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer?.classList.remove('is-open');
  overlay?.classList.remove('is-open');
  document.body.style.overflow = '';
}

export function initCartDrawer() {
  const overlay = document.getElementById('cart-overlay');
  overlay?.addEventListener('click', closeCart);

  // Listen to open events
  window.addEventListener('vexo:open-cart', openCart);
  window.addEventListener('vexo:close-cart', closeCart);

  // Update on cart change
  window.addEventListener('vexo:cart-change', () => {
    const drawer = document.getElementById('cart-drawer');
    if (drawer?.classList.contains('is-open')) {
      updateCartDrawerDOM();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
}
