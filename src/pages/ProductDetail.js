import { getShopifyProductByHandle, getShopifyProducts } from '../lib/shopify.js';
import { formatCurrency, showToast } from '../lib/utils.js';
import { cart } from '../lib/cart.js';
import { renderProductCard, bindProductCardEvents } from '../components/ProductCard.js';

export async function renderProductDetail(handle) {
  return `
    <div class="container pdp-section" id="pdp-container" data-handle="${handle}">
      <div class="skeleton" style="height: 480px; width: 100%; border-radius: var(--radius-md);"></div>
    </div>
  `;
}

export async function initProductDetail(handle) {
  const container = document.getElementById('pdp-container');
  if (!container) return;

  let product = null;

  try {
    product = await getShopifyProductByHandle(handle);
  } catch (e) {
    console.error('Failed to load product by handle', e);
  }

  // Fallback demo product if handle not found on Shopify yet
  if (!product) {
    product = {
      id: `gid://shopify/Product/${handle}`,
      handle: handle,
      title: handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: 'Precision engineered smart kitchen instrument crafted from aerospace-grade aluminum and titanium alloy. Features intuitive capacitive touch sensors, ultra-quiet brushless motor technology, and seamless USB-C high-speed induction recharging.',
      price: 189.00,
      compareAtPrice: 229.00,
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85'
      ],
      variants: [
        { id: `variant-${handle}-obsidian`, title: 'Obsidian Black', price: 189.00, availableForSale: true, quantityAvailable: 3 },
        { id: `variant-${handle}-gold`, title: 'Brushed Gold', price: 199.00, availableForSale: true, quantityAvailable: 2 }
      ],
      totalInventory: 5,
      availableForSale: true,
      benefitTag: 'Aerospace Grade',
      category: 'Smart Kitchen',
      rating: 5.0,
      reviewCount: 48
    };
  }

  let selectedVariant = product.variants?.[0] || { id: product.id, title: 'Default', price: product.price };
  let selectedQuantity = 1;
  const isLowStock = product.totalInventory && product.totalInventory <= 5;

  container.innerHTML = `
    <!-- Breadcrumbs -->
    <nav class="pdp-breadcrumbs" aria-label="Breadcrumb">
      <a href="#/">Home</a>
      <span>/</span>
      <a href="#/catalog">Catalog</a>
      <span>/</span>
      <span style="color: var(--color-white);">${product.title}</span>
    </nav>

    <div class="pdp-grid">
      <!-- Media Gallery -->
      <div class="pdp-gallery-container">
        <!-- Thumbnails -->
        <div class="pdp-thumbnails">
          ${product.images.map((img, idx) => `
            <button class="pdp-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" aria-label="View photo ${idx + 1}">
              <img src="${img}" alt="${product.title} view ${idx + 1}" />
            </button>
          `).join('')}
        </div>

        <!-- Main Image -->
        <div class="pdp-main-image-wrap">
          <img 
            src="${product.images[0]}" 
            alt="${product.title}" 
            class="pdp-main-image" 
            id="pdp-hero-image"
          />
        </div>
      </div>

      <!-- Product Details & Conversion Actions -->
      <div class="pdp-info">
        <span class="badge badge-gold" style="align-self: flex-start; margin-bottom: 0.75rem;">
          ${product.benefitTag || 'Smart Living'}
        </span>

        <h1 class="pdp-title">${product.title}</h1>

        <!-- Star Reviews -->
        <div class="pdp-rating-strip">
          <div class="rating-stars">
            <span class="stars-gold" aria-hidden="true">★★★★★</span>
            <span class="rating-count" style="font-size: 0.85rem; font-weight: 600;">5.0 (48 Verified Collector Reviews)</span>
          </div>
        </div>

        <!-- Pricing & Stock Alert -->
        <div class="pdp-price-wrap">
          <span class="pdp-price" id="pdp-display-price">${formatCurrency(selectedVariant.price || product.price)}</span>
          ${product.compareAtPrice ? `<span class="pdp-compare-price">${formatCurrency(product.compareAtPrice)}</span>` : ''}
          ${product.compareAtPrice ? `<span class="pdp-discount-pill">Save $${Math.round(product.compareAtPrice - product.price)}</span>` : ''}
        </div>

        <!-- Low Stock Urgency Indicator -->
        ${isLowStock ? `
          <div class="stock-indicator" style="margin-bottom: 1.25rem;">
            <span class="stock-pulse"></span>
            <span>Only ${product.totalInventory} units remaining in current batch — ready to dispatch</span>
          </div>
        ` : ''}

        <!-- Short Benefit Description -->
        <p class="pdp-description-short">
          ${product.description}
        </p>

        <!-- Variant Selector -->
        ${product.variants && product.variants.length > 1 ? `
          <div class="pdp-variants">
            <div class="variant-label">
              Finish: <span id="pdp-variant-selected-title">${selectedVariant.title}</span>
            </div>
            <div class="variant-options-grid">
              ${product.variants.map((v, i) => `
                <button 
                  class="variant-chip ${i === 0 ? 'is-selected' : ''}" 
                  data-variant-id="${v.id}"
                  data-price="${v.price}"
                  data-title="${v.title}"
                >
                  ${v.title}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- CTA & Quantity Row -->
        <div class="pdp-cta-group" id="main-pdp-cta-group">
          <div class="pdp-qty-stepper">
            <button class="qty-btn" id="pdp-qty-minus" aria-label="Decrease quantity">−</button>
            <span class="qty-val" id="pdp-qty-val" style="padding: 0 1rem;">1</span>
            <button class="qty-btn" id="pdp-qty-plus" aria-label="Increase quantity">+</button>
          </div>

          <button class="btn btn-gold pdp-add-btn" id="pdp-add-to-cart-btn">
            Add to Bag • <span id="pdp-cta-price">${formatCurrency(selectedVariant.price || product.price)}</span>
          </button>
        </div>

        <!-- Trust & Guarantee Line near CTA -->
        <div class="product-guarantee-line">
          <div class="product-guarantee-row">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            <span><strong>30-Day In-Home Trial</strong> — Experience risk-free in your kitchen</span>
          </div>
          <div class="product-guarantee-row">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            <span><strong>Complimentary Global Shipping</strong> on orders over $150</span>
          </div>
          <div class="product-guarantee-row">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            <span><strong>2-Year Craftsmanship Warranty</strong> included</span>
          </div>
        </div>

        <!-- Specifications & Care Accordion -->
        <div class="pdp-accordion">
          <div class="accordion-item is-open">
            <button class="accordion-header">
              <span>Materials & Precision Engineering</span>
              <span class="accordion-icon">+</span>
            </button>
            <div class="accordion-content">
              Aerospace-grade anodized aluminum chassis with brushed luxury brass and obsidian ceramic coating. Precision machined to ±0.05mm tolerances for flawless tactile operation and lifetime durability.
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-header">
              <span>Care & Longevity</span>
              <span class="accordion-icon">+</span>
            </button>
            <div class="accordion-content">
              Wipe clean with a microfiber cloth and mild water solution. Avoid abrasive pads. Modular components can be disassembled in seconds for effortless maintenance.
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-header">
              <span>Worldwide Shipping & Returns</span>
              <span class="accordion-icon">+</span>
            </button>
            <div class="accordion-content">
              Complimentary expedited delivery on all orders over $150. Tracked shipping with premium luxury unboxing presentation. 30-day hassle-free returns with prepaid return labels.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Mobile CTA Bar -->
    <div class="pdp-sticky-bar" id="pdp-sticky-bar">
      <div class="sticky-bar-info">
        <span class="sticky-bar-title">${product.title}</span>
        <span class="sticky-bar-price" id="sticky-bar-price">${formatCurrency(selectedVariant.price || product.price)}</span>
      </div>
      <button class="btn btn-gold sticky-bar-btn" id="sticky-add-btn">
        Add to Bag
      </button>
    </div>
  `;

  // Gallery thumbnail click handler
  const heroImg = document.getElementById('pdp-hero-image');
  const thumbBtns = container.querySelectorAll('.pdp-thumb-btn');

  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const idx = parseInt(btn.dataset.index, 10);
      if (heroImg && product.images[idx]) {
        heroImg.src = product.images[idx];
      }
    });
  });

  // Variant selector click handler
  container.querySelectorAll('.variant-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');

      const vId = chip.dataset.variantId;
      selectedVariant = product.variants.find(v => v.id === vId) || selectedVariant;

      const titleEl = document.getElementById('pdp-variant-selected-title');
      if (titleEl) titleEl.textContent = selectedVariant.title;

      const displayPrice = document.getElementById('pdp-display-price');
      const ctaPrice = document.getElementById('pdp-cta-price');
      const stickyPrice = document.getElementById('sticky-bar-price');

      const formatted = formatCurrency(selectedVariant.price * selectedQuantity);
      if (displayPrice) displayPrice.textContent = formatCurrency(selectedVariant.price);
      if (ctaPrice) ctaPrice.textContent = formatted;
      if (stickyPrice) stickyPrice.textContent = formatted;
    });
  });

  // Quantity stepper handlers
  const qtyVal = document.getElementById('pdp-qty-val');
  const ctaPrice = document.getElementById('pdp-cta-price');
  const stickyPrice = document.getElementById('sticky-bar-price');

  document.getElementById('pdp-qty-plus')?.addEventListener('click', () => {
    selectedQuantity += 1;
    if (qtyVal) qtyVal.textContent = selectedQuantity;
    const formatted = formatCurrency(selectedVariant.price * selectedQuantity);
    if (ctaPrice) ctaPrice.textContent = formatted;
    if (stickyPrice) stickyPrice.textContent = formatted;
  });

  document.getElementById('pdp-qty-minus')?.addEventListener('click', () => {
    if (selectedQuantity > 1) {
      selectedQuantity -= 1;
      if (qtyVal) qtyVal.textContent = selectedQuantity;
      const formatted = formatCurrency(selectedVariant.price * selectedQuantity);
      if (ctaPrice) ctaPrice.textContent = formatted;
      if (stickyPrice) stickyPrice.textContent = formatted;
    }
  });

  // Add to Bag actions (Main CTA & Sticky CTA)
  const handleAddToCart = () => {
    cart.addItem(product, selectedVariant, selectedQuantity);
  };

  document.getElementById('pdp-add-to-cart-btn')?.addEventListener('click', handleAddToCart);
  document.getElementById('sticky-add-btn')?.addEventListener('click', handleAddToCart);

  // Accordion toggle handlers
  container.querySelectorAll('.accordion-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const parent = hdr.closest('.accordion-item');
      parent?.classList.toggle('is-open');
    });
  });

  // Sticky Mobile CTA Bar Intersection Observer
  const mainCtaGroup = document.getElementById('main-pdp-cta-group');
  const stickyBar = document.getElementById('pdp-sticky-bar');

  if (mainCtaGroup && stickyBar) {
    const observer = new IntersectionObserver(([entry]) => {
      // If main CTA is out of view, show sticky bar on mobile
      if (!entry.isIntersecting) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }
    }, { threshold: 0.1 });

    observer.observe(mainCtaGroup);
  }
}
