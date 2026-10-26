import { cart } from '../lib/cart.js';
import { formatCurrency, showToast } from '../lib/utils.js';

export async function renderCartPage() {
  const items = cart.getItems();
  const count = cart.getTotalCount();
  const subtotal = cart.getSubtotal();
  const shipping = cart.getFreeShippingProgress();

  if (items.length === 0) {
    return `
      <div class="container section-padding" style="min-height: 60vh; display: flex; align-items: center; justify-content: center;">
        <div class="empty-state-card" style="width: 100%;">
          <div class="empty-state-emblem">
            <svg width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <p class="empty-state-tag">Your Bag</p>
          <h1 class="empty-state-heading">Your Bag is Empty</h1>
          <p class="empty-state-description">
            Experience modern kitchenware and smart home essentials engineered with timeless craftsmanship.
          </p>
          <div class="empty-state-actions">
            <a href="#/catalog" class="btn btn-gold">Explore Catalog →</a>
            <a href="#/" class="btn btn-outline-gold">Return to Home</a>
          </div>
        </div>
      </div>
    `;
  }

  const shippingText = shipping.isUnlocked
    ? `<span>✓ Unlocked:</span> Complimentary Worldwide Express Shipping`
    : `Add <span>${formatCurrency(shipping.remaining)}</span> more to unlock <span>Free Worldwide Shipping</span>`;

  return `
    <div class="container section-padding">
      <div style="margin-bottom: 2rem;">
        <span class="section-tag">Shopping Bag</span>
        <h1 style="font-family: var(--font-heading); font-size: 2.5rem; color: #FFF;">Review Your Selection (${count})</h1>
      </div>

      <!-- Free Shipping Banner -->
      <div class="free-shipping-bar" style="border-radius: var(--radius-sm); margin-bottom: 2.5rem;">
        <p class="shipping-bar-text">${shippingText}</p>
        <div class="shipping-progress-track">
          <div class="shipping-progress-fill" style="width: ${shipping.percentage}%"></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 3rem;" class="cart-page-grid">
        <!-- Items Table / List -->
        <div id="cart-page-items-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${items.map(item => `
            <div class="cart-item" style="padding: 1.5rem; background: #121212; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-sm);" data-variant-id="${item.variantId}">
              <img src="${item.image}" alt="${item.title}" class="cart-item-img" style="width: 100px; height: 100px;" />
              <div class="cart-item-details" style="gap: 0.35rem;">
                <h3 class="cart-item-title" style="font-size: 1.15rem;">${item.title}</h3>
                ${item.variantTitle ? `<p class="cart-item-variant">${item.variantTitle}</p>` : ''}
                <div class="cart-item-price" style="font-size: 1.15rem;">${formatCurrency(item.price)}</div>

                <div class="cart-item-actions" style="margin-top: 1rem;">
                  <div class="qty-stepper">
                    <button class="qty-btn" data-action="decrease" data-id="${item.variantId}">−</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-id="${item.variantId}">+</button>
                  </div>
                  <button class="cart-item-remove" data-action="remove" data-id="${item.variantId}">Remove</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Order Summary Card -->
        <div style="background: #141414; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: var(--radius-sm); padding: 2rem; height: fit-content;">
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: #FFF; margin-bottom: 1.5rem;">Order Summary</h2>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.95rem;">
            <span>Subtotal</span>
            <span style="color: #FFF; font-weight: 700;">${formatCurrency(subtotal)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.95rem;">
            <span>Standard Shipping</span>
            <span style="color: var(--color-gold); font-weight: 700;">${shipping.isUnlocked ? 'FREE' : '$15.00'}</span>
          </div>

          <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 1.25rem 0; padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 1.1rem; font-weight: 700; color: #FFF;">Total</span>
            <span style="font-size: 1.75rem; font-weight: 800; color: #FFF;">${formatCurrency(subtotal + (shipping.isUnlocked ? 0 : 15))}</span>
          </div>

          <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
            Applicable sales taxes and currency conversion calculated securely during checkout.
          </p>

          <button class="btn btn-gold" id="cart-page-checkout-btn" style="width: 100%; font-size: 1rem; padding: 1.1rem;">
            Proceed to Secure Shopify Checkout →
          </button>

          <div class="cart-security-note" style="margin-top: 1.25rem;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Guaranteed 256-Bit SSL Shopify Encryption</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initCartPage() {
  const container = document.getElementById('cart-page-items-list');
  const items = cart.getItems();

  document.getElementById('cart-page-checkout-btn')?.addEventListener('click', () => {
    cart.redirectToCheckout();
  });

  container?.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = items.find(i => i.variantId === id);
      if (!item) return;

      if (action === 'increase') {
        cart.updateQuantity(id, item.quantity + 1);
      } else if (action === 'decrease') {
        cart.updateQuantity(id, item.quantity - 1);
      }
      window.location.reload();
    });
  });

  container?.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      cart.removeItem(id);
      window.location.reload();
    });
  });
}
