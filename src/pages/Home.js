import { ASSETS, CATEGORIES, BRAND } from '../lib/constants.js';
import { renderTrustStrip } from '../components/TrustStrip.js';
import { renderProductCard, bindProductCardEvents } from '../components/ProductCard.js';
import { getShopifyProducts } from '../lib/shopify.js';
import { showToast } from '../lib/utils.js';

export async function renderHome() {
  return `
    <!-- Hero Banner -->
    <section class="hero-section" aria-label="Hero Section">
      <div class="hero-backdrop">
        <img 
          src="${ASSETS.heroBg}" 
          alt="Luxury Kitchen and Smart Living" 
          class="hero-backdrop-img"
        />
        <div class="hero-overlay-gradient"></div>
      </div>

      <div class="container hero-content">
        <div class="hero-badge">
          <span>●</span>
          <span>Architectural Luxury • Smart Living</span>
        </div>
        <h1 class="hero-title">
          Smart Living. <br />
          <span class="gold-gradient-text">Beautiful Spaces.</span>
        </h1>
        <p class="hero-subtitle">
          Engineered kitchen gadgets and modern home instruments crafted for culinary precision, tactile satisfaction, and minimalist architectural aesthetics.
        </p>
        <div class="hero-cta-group">
          <a href="#/catalog" class="btn btn-gold">
            Explore Innovations →
          </a>
          <a href="#/catalog?cat=smart-kitchen" class="btn btn-outline-gold">
            Smart Kitchenware
          </a>
        </div>
      </div>
    </section>

    <!-- Trust Strip -->
    ${renderTrustStrip()}

    <!-- Shop by Category -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Curated Collections</span>
          <h2 class="section-title">Designed for Modern Spaces</h2>
          <p class="section-subtitle">Discover culinary instruments and smart living innovations engineered to elevate your daily rituals.</p>
        </div>

        <div class="categories-grid">
          ${CATEGORIES.filter(c => c.id !== 'all').map(cat => `
            <a href="#/catalog?cat=${cat.id}" class="category-card" aria-label="${cat.name}">
              <img src="${cat.image}" alt="${cat.name}" class="category-card-bg" loading="lazy" />
              <div class="category-card-overlay"></div>
              <div class="category-card-content">
                <h3 class="category-card-title">${cat.name}</h3>
                <span class="category-card-link">View Collection →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Live Best Sellers / Dynamic Shopify Showcase -->
    <section class="section-padding" style="background: #0E0E0E;" id="bestsellers-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Curated Selection</span>
          <h2 class="section-title">Featured Innovations</h2>
          <p class="section-subtitle">Live from our studio collection. Limited edition batches crafted with aerospace-grade precision.</p>
        </div>

        <!-- Dynamic Product Container -->
        <div id="home-products-container">
          <!-- Render Skeleton loaders while fetching -->
          <div class="product-grid">
            ${Array(4).fill(0).map(() => `
              <div class="product-card" style="min-height: 380px;">
                <div class="skeleton" style="aspect-ratio: 1/1; width: 100%;"></div>
                <div style="padding: 1.25rem;">
                  <div class="skeleton" style="height: 14px; width: 40%; margin-bottom: 0.75rem;"></div>
                  <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 1rem;"></div>
                  <div class="skeleton" style="height: 16px; width: 30%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Story Teaser -->
    <section class="story-teaser-section">
      <div class="container">
        <div class="story-teaser-grid">
          <div>
            <span class="section-tag">The Vexo Ethos</span>
            <p class="story-teaser-quote">
              "We believe that every tool in your home should perform like a precision instrument and look like a gallery sculpture."
            </p>
            <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 2rem;">
              Born at the intersection of modern culinary science and minimalist European design, Vexo crafts kitchenware and smart living essentials that eliminate friction and bring timeless beauty to your countertops and living spaces.
            </p>
            <a href="#/about" class="btn btn-outline-gold">Read Our Story →</a>
          </div>

          <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.25); aspect-ratio: 4/3;">
            <img 
              src="${ASSETS.about.story1}" 
              alt="Vexo Craftsmanship" 
              style="width: 100%; height: 100%; object-fit: cover;" 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- VIP Newsletter -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-box">
          <span class="section-tag">Private Reserve</span>
          <h2 class="section-title">Elevate Your Living Space</h2>
          <p class="section-subtitle">
            Receive private notifications for limited releases, culinary guides, and bespoke member privileges.
          </p>

          <form class="newsletter-form-home" id="home-newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required 
              aria-label="Email for private reserve"
            />
            <button type="submit" class="btn btn-gold">Request Access</button>
          </form>
        </div>
      </div>
    </section>
  `;
}

export async function initHome() {
  const container = document.getElementById('home-products-container');
  if (!container) return;

  try {
    const products = await getShopifyProducts({ first: 4 });

    if (products.length > 0) {
      container.innerHTML = `
        <div class="product-grid">
          ${products.map(p => renderProductCard(p)).join('')}
        </div>
      `;
      bindProductCardEvents(container, products);
    } else {
      // Intentional on-brand empty state when store is newly created
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-emblem">
            <svg width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <p class="empty-state-tag">Private Reserve Collection</p>
          <h3 class="empty-state-heading">Inaugural Release in Production</h3>
          <p class="empty-state-description">
            Our master artisans are currently finalizing the premiere collection of smart kitchen implements and living essentials in our Shopify vault.
          </p>
          <div class="empty-state-actions">
            <a href="#/catalog" class="btn btn-gold">View Catalog Status</a>
            <a href="#/about" class="btn btn-outline-gold">Our Philosophy</a>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to load featured products', error);
  }

  // Bind newsletter form
  const newsletterForm = document.getElementById('home-newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input && input.value) {
      showToast('You have been added to the VIP reserve list.', 'success');
      input.value = '';
    }
  });
}
