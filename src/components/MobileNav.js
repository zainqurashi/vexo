import { BRAND } from '../lib/constants.js';

export function renderMobileNav() {
  return `
    <!-- Mobile Backdrop Overlay -->
    <div class="mobile-nav-overlay" id="mobile-nav-overlay" aria-hidden="true"></div>

    <!-- Mobile Navigation Drawer -->
    <aside class="mobile-nav-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      <div class="mobile-nav-header">
        <a href="#/" class="header-logo" aria-label="Vexo Home">
          <img src="/assets/brand/vexo-logo-light.svg" alt="Vexo Logo" width="130" height="34" />
        </a>
        <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close navigation menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <nav class="mobile-nav-links" aria-label="Mobile Menu">
        <div class="mobile-nav-item">
          <a href="#/" class="mobile-nav-link" data-route="/">
            <span>Home</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div class="mobile-nav-item">
          <a href="#/catalog" class="mobile-nav-link" data-route="/catalog">
            <span>Explore Catalog</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div class="mobile-nav-item">
          <a href="#/catalog?cat=smart-kitchen" class="mobile-nav-link" data-route="/catalog?cat=smart-kitchen">
            <span>Smart Kitchen</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div class="mobile-nav-item">
          <a href="#/catalog?cat=smart-home" class="mobile-nav-link" data-route="/catalog?cat=smart-home">
            <span>Smart Home Living</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div class="mobile-nav-item">
          <a href="#/about" class="mobile-nav-link" data-route="/about">
            <span>Our Story & Philosophy</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div class="mobile-nav-item">
          <a href="#/cart" class="mobile-nav-link" data-route="/cart">
            <span>Shopping Bag</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </nav>

      <div class="mobile-nav-footer">
        <p class="mobile-nav-tagline">${BRAND.tagline}</p>
        <p class="mobile-nav-subtext">Engineered for aesthetics, precision, and modern living. Built for effortless spaces.</p>
      </div>
    </aside>
  `;
}

export function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const closeBtn = document.getElementById('mobile-nav-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const links = drawer?.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    drawer?.classList.add('is-open');
    overlay?.classList.add('is-open');
    toggleBtn?.classList.add('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer?.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer?.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close when tapping any link inside the mobile nav
  links?.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
