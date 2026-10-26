import { ASSETS, BRAND } from '../lib/constants.js';
import { showToast } from '../lib/utils.js';

export async function renderAbout() {
  return `
    <!-- About Hero -->
    <section class="about-hero">
      <div class="about-hero-bg" style="background-image: url('${ASSETS.about.story2}');"></div>
      <div class="container about-hero-content">
        <span class="about-hero-tag">The Vexo Philosophy</span>
        <h1 class="about-hero-title">
          Smart Living. <br />
          <span class="gold-gradient-text">Beautiful Spaces.</span>
        </h1>
        <p class="about-hero-lead">
          We engineer kitchen instruments and smart living gadgets that unite architectural minimalism with flawless culinary precision.
        </p>
      </div>
    </section>

    <!-- Editorial Story Section 1 -->
    <section class="container">
      <div class="about-editorial-grid">
        <div class="about-editorial-content">
          <span class="editorial-tag">Origins & Mission</span>
          <h2 class="editorial-title">Designed for Modern Sanctuaries</h2>
          <p class="editorial-body">
            Vexo was founded on a simple realization: while home architecture has evolved into clean lines and serene monolithic surfaces, everyday kitchen gadgets and home accessories remained noisy, cluttered, and cheap.
          </p>
          <p class="editorial-body">
            We set out to create a new category of home instruments — objects that perform with commercial-grade speed and reliability, yet sit quietly on marble countertops as sculptural centerpieces.
          </p>
        </div>

        <div class="about-img-frame">
          <img 
            src="${ASSETS.about.story1}" 
            alt="Vexo kitchen craftsmanship" 
            loading="lazy"
          />
        </div>
      </div>

      <!-- Editorial Story Section 2 (Reverse) -->
      <div class="about-editorial-grid reverse">
        <div class="about-editorial-content">
          <span class="editorial-tag">Materiality</span>
          <h2 class="editorial-title">Aerospace Precision. Tactile Joy.</h2>
          <p class="editorial-body">
            Every Vexo product is milled from high-purity anodized aluminum, titanium alloy, and scratch-resistant borosilicate glass. We reject disposable plastics in favor of solid weighted bases and silent brushless motors.
          </p>
          <p class="editorial-body">
            From the deliberate resistance of our gravity dials to the warm glow of our induction indicator rings, every touchpoint is engineered to make your daily cooking and living rituals deeply rewarding.
          </p>
        </div>

        <div class="about-img-frame">
          <img 
            src="${ASSETS.about.craft}" 
            alt="Precision engineering" 
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Brand Pillars -->
    <section class="pillars-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Commitments</span>
          <h2 class="section-title">The Three Pillars of Vexo</h2>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-number">01</div>
            <h3 class="pillar-title">Architectural Purity</h3>
            <p class="pillar-desc">
              Zero visual clutter. Thoughtful monolithic geometry designed to blend seamlessly into modern kitchens and living environments.
            </p>
          </div>

          <div class="pillar-card">
            <div class="pillar-number">02</div>
            <h3 class="pillar-title">Culinary Intelligence</h3>
            <p class="pillar-desc">
              Next-generation sensor arrays, automatic gravity switches, and whisper-quiet motors that elevate your cooking to effortless mastery.
            </p>
          </div>

          <div class="pillar-card">
            <div class="pillar-number">03</div>
            <h3 class="pillar-title">Enduring Longevity</h3>
            <p class="pillar-desc">
              Commercial durability backed by our 2-Year Warranty and 30-Day in-home risk-free trial. Built to outlast trends.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- VIP Concierge Contact Form -->
    <section class="container contact-section" id="contact">
      <div class="contact-card">
        <h2 class="contact-title">VIP Concierge Inquiries</h2>
        <p class="contact-sub">
          Have questions regarding our instruments, trade programs, or custom installations? Our private concierge team is at your disposal.
        </p>

        <form id="about-contact-form">
          <div class="contact-form-group">
            <label class="contact-label" for="contact-name">Full Name</label>
            <input type="text" id="contact-name" class="contact-input" placeholder="e.g. Elizabeth Vance" required />
          </div>

          <div class="contact-form-group">
            <label class="contact-label" for="contact-email">Email Address</label>
            <input type="email" id="contact-email" class="contact-input" placeholder="elizabeth@example.com" required />
          </div>

          <div class="contact-form-group">
            <label class="contact-label" for="contact-topic">Inquiry Type</label>
            <select id="contact-topic" class="contact-input" style="cursor: pointer;">
              <option value="product">Product Specifications & Availability</option>
              <option value="trade">Architect & Interior Trade Program</option>
              <option value="support">Order & Concierge Assistance</option>
              <option value="press">Press & Editorial</option>
            </select>
          </div>

          <div class="contact-form-group">
            <label class="contact-label" for="contact-message">Message</label>
            <textarea id="contact-message" class="contact-textarea" placeholder="How may our concierge assist you?" required></textarea>
          </div>

          <button type="submit" class="btn btn-gold" style="width: 100%; font-size: 0.95rem; margin-top: 1rem;">
            Transmit Concierge Inquiry →
          </button>
        </form>
      </div>
    </section>
  `;
}

export function initAbout() {
  const form = document.getElementById('about-contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Your inquiry has been delivered to our VIP Concierge team.', 'success');
    form.reset();
  });
}
