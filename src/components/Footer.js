import { BRAND } from '../lib/constants.js';
import { showToast } from '../lib/utils.js';

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Ethos -->
          <div class="footer-brand-col">
            <a href="#/" aria-label="Vexo Home">
              <img src="/assets/brand/vexo-logo-light.svg" alt="Vexo" width="150" height="38" />
            </a>
            <p>${BRAND.tagline} Engineered for architectural elegance, commercial durability, and effortless modern spaces.</p>
            <div style="font-size: 0.8rem; color: var(--color-gold); font-weight: 600;">
              vexohome.store
            </div>
          </div>

          <!-- Col 2: Collections -->
          <div>
            <h4 class="footer-heading">Collections</h4>
            <ul class="footer-links">
              <li><a href="#/catalog">All Innovations</a></li>
              <li><a href="#/catalog?cat=smart-kitchen">Smart Kitchen</a></li>
              <li><a href="#/catalog?cat=smart-home">Smart Home Living</a></li>
              <li><a href="#/catalog?cat=smart-bar">Smart Barware</a></li>
            </ul>
          </div>

          <!-- Col 3: Experience & Client Care -->
          <div>
            <h4 class="footer-heading">Client Care</h4>
            <ul class="footer-links">
              <li><a href="#/about">Our Story</a></li>
              <li><a href="#/about#contact">VIP Concierge Support</a></li>
              <li><a href="#/catalog">30-Day In-Home Trial</a></li>
              <li><a href="#/about">2-Year Craftsmanship Warranty</a></li>
            </ul>
          </div>

          <!-- Col 4: Private Reserve Newsletter -->
          <div>
            <h4 class="footer-heading">Private Reserve</h4>
            <p class="footer-newsletter-text">
              Subscribe for early access to limited edition culinary & smart home releases.
            </p>
            <form class="footer-newsletter-form" id="footer-newsletter-form">
              <input 
                type="email" 
                class="footer-newsletter-input" 
                placeholder="Enter your email" 
                required 
                aria-label="Email address for newsletter"
              />
              <button type="submit" class="btn btn-gold" style="padding: 0.75rem 1.25rem;">Join</button>
            </form>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} ${BRAND.name} (${BRAND.domain}). All rights reserved. Precision engineered.</p>
          <div class="footer-payments-row">
            <span class="payment-badge">Shop Pay</span>
            <span class="payment-badge">Apple Pay</span>
            <span class="payment-badge">Google Pay</span>
            <span class="payment-badge">Visa</span>
            <span class="payment-badge">Mastercard</span>
            <span class="payment-badge">Amex</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function initFooter() {
  const form = document.getElementById('footer-newsletter-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input && input.value) {
      showToast('Welcome to the Vexo Private Reserve. Early access granted.', 'success');
      input.value = '';
    }
  });
}
