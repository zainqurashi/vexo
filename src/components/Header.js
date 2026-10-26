import { cart } from '../lib/cart.js';

export function renderHeader() {
  const cartCount = cart.getTotalCount();

  return `
    <aside class="announcement-bar" role="region" aria-label="Announcement">
      <span>Complimentary Worldwide Express Shipping on Orders Over $150</span>
      <span class="bullet" aria-hidden="true">•</span>
      <span>30-Day Risk-Free Trial</span>
    </aside>

    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <!-- Mobile Hamburger Button -->
        <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-nav-drawer">
          <span class="hamburger-icon">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        </button>

        <!-- Brand Logo -->
        <a href="#/" class="header-logo" aria-label="Vexo Home">
          <img src="/assets/brand/vexo-logo-light.svg" alt="Vexo — Smart Living" width="160" height="40" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav" aria-label="Primary Navigation">
          <a href="#/" class="nav-link" data-route="/">Home</a>
          <a href="#/catalog" class="nav-link" data-route="/catalog">Catalog</a>
          <a href="#/catalog?cat=smart-kitchen" class="nav-link" data-route="/catalog?cat=smart-kitchen">Smart Kitchen</a>
          <a href="#/catalog?cat=smart-home" class="nav-link" data-route="/catalog?cat=smart-home">Smart Home</a>
          <a href="#/about" class="nav-link" data-route="/about">Our Story</a>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <button class="icon-btn" id="search-trigger-btn" aria-label="Search catalog">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          </button>

          <button class="icon-btn" id="cart-drawer-trigger" aria-label="View shopping bag" aria-haspopup="dialog">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span class="cart-badge ${cartCount > 0 ? 'bump' : ''}" id="header-cart-badge" aria-label="${cartCount} items in bag">${cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function initHeader() {
  const header = document.getElementById('site-header');
  const badge = document.getElementById('header-cart-badge');
  const cartTrigger = document.getElementById('cart-drawer-trigger');
  const searchTrigger = document.getElementById('search-trigger-btn');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Update cart badge on event
  window.addEventListener('vexo:cart-change', (e) => {
    if (badge) {
      const count = e.detail.count;
      badge.textContent = count;
      badge.classList.remove('bump');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('bump');
    }
  });

  // Open cart drawer on cart icon click
  cartTrigger?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('vexo:open-cart'));
  });

  // Search trigger redirects to catalog with search focus
  searchTrigger?.addEventListener('click', () => {
    window.location.hash = '#/catalog';
    setTimeout(() => {
      const searchInput = document.getElementById('catalog-search-input');
      searchInput?.focus();
    }, 150);
  });
}
