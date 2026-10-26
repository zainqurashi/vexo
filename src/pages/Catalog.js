import { CATEGORIES, BRAND } from '../lib/constants.js';
import { getShopifyProducts } from '../lib/shopify.js';
import { renderProductCard, bindProductCardEvents } from '../components/ProductCard.js';
import { showToast } from '../lib/utils.js';

export async function renderCatalog() {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const activeCat = urlParams.get('cat') || 'all';

  return `
    <div class="catalog-header">
      <div class="container">
        <span class="section-tag">Complete Collection</span>
        <h1 class="catalog-title">Precision Instruments</h1>
        <p class="catalog-subtitle">
          Explore smart kitchen gadgets, ambient living innovations, and elevated barware engineered for modern living.
        </p>
      </div>
    </div>

    <div class="container" style="padding-bottom: 5rem;">
      <!-- Catalog Filter Toolbar -->
      <div class="catalog-toolbar">
        <!-- Category Tabs -->
        <div class="category-tabs" id="category-tabs" role="tablist">
          ${CATEGORIES.map(cat => `
            <button 
              class="category-tab-btn ${activeCat === cat.id ? 'is-active' : ''}" 
              data-cat="${cat.id}"
              role="tab"
              aria-selected="${activeCat === cat.id}"
            >
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <!-- Sorting and Search -->
        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <input 
            type="text" 
            id="catalog-search-input" 
            placeholder="Search innovations..." 
            class="contact-input" 
            style="width: 220px; padding: 0.55rem 1rem; font-size: 0.8rem;" 
            aria-label="Search products"
          />

          <select class="catalog-sort-select" id="catalog-sort-select" aria-label="Sort products">
            <option value="featured">Sort: Curated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Catalog Product Grid Container -->
      <div id="catalog-products-container">
        <!-- Skeletons while fetching -->
        <div class="product-grid">
          ${Array(6).fill(0).map(() => `
            <div class="product-card" style="min-height: 380px;">
              <div class="skeleton" style="aspect-ratio: 1/1; width: 100%;"></div>
              <div style="padding: 1.25rem;">
                <div class="skeleton" style="height: 14px; width: 35%; margin-bottom: 0.75rem;"></div>
                <div class="skeleton" style="height: 20px; width: 85%; margin-bottom: 1rem;"></div>
                <div class="skeleton" style="height: 16px; width: 30%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export async function initCatalog() {
  const container = document.getElementById('catalog-products-container');
  const tabs = document.querySelectorAll('.category-tab-btn');
  const sortSelect = document.getElementById('catalog-sort-select');
  const searchInput = document.getElementById('catalog-search-input');

  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  let currentCategory = urlParams.get('cat') || 'all';
  let currentSort = 'featured';
  let currentSearch = '';

  let allProducts = [];

  try {
    allProducts = await getShopifyProducts({ first: 24 });
    filterAndRender();
  } catch (err) {
    console.error('Error fetching catalog products:', err);
    renderEmptyState();
  }

  function filterAndRender() {
    if (!container) return;

    let filtered = [...allProducts];

    // Filter by category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => {
        const catKey = p.category?.toLowerCase() || '';
        return catKey.includes(currentCategory.replace('smart-', ''));
      });
    }

    // Filter by search query
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length > 0) {
      container.innerHTML = `
        <div class="product-grid">
          ${filtered.map(p => renderProductCard(p)).join('')}
        </div>
      `;
      bindProductCardEvents(container, filtered);
    } else {
      renderEmptyState();
    }
  }

  function renderEmptyState() {
    if (!container) return;

    container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-state-emblem">
          <svg width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <p class="empty-state-tag">Private Reserve • Handcrafted Batch</p>
        <h2 class="empty-state-heading">Curated Collections Arriving Soon</h2>
        <p class="empty-state-description">
          We are currently preparing our inaugural release of smart kitchen gadgets and architectural home instruments in Shopify. Every piece undergoes rigorous tolerance testing before being released to the public.
        </p>

        <form class="empty-state-form" id="catalog-waitlist-form">
          <input 
            type="email" 
            class="empty-state-input" 
            placeholder="Enter email for private release alert" 
            required 
            aria-label="Email for waitlist"
          />
          <button type="submit" class="btn btn-gold">Join Waitlist</button>
        </form>

        <div class="empty-state-actions">
          <a href="#/" class="btn btn-outline-gold">← Return to Home</a>
          <a href="#/about" class="btn btn-dark">Our Philosophy</a>
        </div>
      </div>
    `;

    document.getElementById('catalog-waitlist-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('You have been reserved for early private access.', 'success');
      e.target.reset();
    });
  }

  // Bind tab listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      currentCategory = tab.dataset.cat;
      filterAndRender();
    });
  });

  // Bind sort listener
  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterAndRender();
  });

  // Bind search listener
  searchInput?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    filterAndRender();
  });
}
