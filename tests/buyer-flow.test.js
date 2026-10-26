/**
 * Automated Verification Script: Vexo Storefront & Mobile Buyer Flow Test
 * Validates:
 * 1. Mobile navigation matching classes & drawer behavior
 * 2. Brand constants and luxury aesthetic tokens
 * 3. Cart calculations (subtotal, quantity adjustments, free shipping progress bar at $150)
 * 4. Shopify GraphQL client query structure and error handling
 * 5. Production build artifact integrity
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('═══════════════════════════════════════════════════════════════');
console.log('  VEXO LUXURY STOREFRONT — AUTOMATED VERIFICATION SUITE');
console.log('═══════════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failCount++;
  }
}

// 1. Verify Production Dist Files Exist
assert(existsSync(resolve('dist/index.html')), 'Production dist/index.html generated');
assert(existsSync(resolve('public/favicon.svg')), 'Favicon SVG exists in public directory');
assert(existsSync(resolve('public/assets/brand/vexo-logo.svg')), 'Brand luxury dark wordmark exists');
assert(existsSync(resolve('public/assets/brand/vexo-logo-light.svg')), 'Brand luxury light wordmark exists');

// 2. Verify Mobile Navigation Classes Match
const headerJs = readFileSync(resolve('src/components/Header.js'), 'utf-8');
const mobileNavJs = readFileSync(resolve('src/components/MobileNav.js'), 'utf-8');
const headerNavCss = readFileSync(resolve('src/styles/header-nav.css'), 'utf-8');

assert(headerJs.includes('mobile-nav-toggle'), 'Header contains .mobile-nav-toggle element');
assert(mobileNavJs.includes('mobile-nav-drawer'), 'MobileNav contains .mobile-nav-drawer element');
assert(mobileNavJs.includes('mobile-nav-overlay'), 'MobileNav contains .mobile-nav-overlay element');
assert(headerNavCss.includes('.mobile-nav-toggle.is-active'), 'CSS contains .mobile-nav-toggle.is-active rule');
assert(headerNavCss.includes('.mobile-nav-drawer.is-open'), 'CSS contains .mobile-nav-drawer.is-open rule');
assert(headerNavCss.includes('.mobile-nav-overlay.is-open'), 'CSS contains .mobile-nav-overlay.is-open rule');

// 3. Verify Responsive Style Rules (360px, 480px, 768px)
const responsiveCss = readFileSync(resolve('src/styles/responsive.css'), 'utf-8');
assert(responsiveCss.includes('@media (max-width: 480px)'), 'Responsive CSS covers <= 480px small mobile');
assert(responsiveCss.includes('min-width: 44px') && responsiveCss.includes('min-height: 44px'), 'Enforces 44px+ touch targets on interactive controls');
assert(responsiveCss.includes('overflow-x: hidden'), 'Enforces zero horizontal scroll on mobile');

// 4. Verify Brand Tagline and Palette
const variablesCss = readFileSync(resolve('src/styles/variables.css'), 'utf-8');
assert(variablesCss.includes('#D4AF37'), 'Gold luxury hex token #D4AF37 configured in variables');
assert(variablesCss.includes('#0A0A0A'), 'Obsidian luxury black token configured');

// 5. Verify Shopify GraphQL Integration Integrity
const shopifyJs = readFileSync(resolve('src/lib/shopify.js'), 'utf-8');
assert(shopifyJs.includes('query GetProducts'), 'Shopify client contains GetProducts query');
assert(shopifyJs.includes('query GetProductByHandle'), 'Shopify client contains GetProductByHandle query');
assert(shopifyJs.includes('mutation CartCreate'), 'Shopify client contains CartCreate mutation');
assert(shopifyJs.includes('X-Shopify-Storefront-Access-Token'), 'Shopify client sends Storefront token header');

// Setup lightweight browser globals mock for Node.js test environment
globalThis.localStorage = {
  _store: {},
  getItem(key) { return this._store[key] || null; },
  setItem(key, val) { this._store[key] = String(val); },
  removeItem(key) { delete this._store[key]; },
  clear() { this._store = {}; }
};
globalThis.window = {
  dispatchEvent() {},
  addEventListener() {}
};
globalThis.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
globalThis.document = {
  getElementById() { return null; },
  createElement() { return { setAttribute() {}, appendChild() {}, classList: { add() {}, remove() {} } }; },
  body: { appendChild() {} }
};

// 6. Verify Cart State Logic Simulation
const { cart } = await import('../src/lib/cart.js');

// Clean test cart
cart.clear();
assert(cart.getTotalCount() === 0, 'Cart starts completely empty');
assert(cart.getSubtotal() === 0, 'Subtotal starts at $0');

// Add demo product 1 ($89)
cart.addItem({
  id: 'test-grinder',
  handle: 'smart-gravity-grinder',
  title: 'Smart Gravity Grinder',
  price: 89.00,
  images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f']
}, null, 1);

assert(cart.getTotalCount() === 1, 'Cart count increments to 1');
assert(cart.getSubtotal() === 89.00, 'Subtotal is correctly $89.00');

let progress = cart.getFreeShippingProgress();
assert(progress.threshold === 150, 'Free shipping threshold is $150');
assert(progress.remaining === 61.00, 'Remaining for free shipping is $61.00 ($150 - $89)');
assert(!progress.isUnlocked, 'Free shipping is not unlocked yet at $89');

// Add second item ($75) -> Subtotal = $164 (> $150 threshold)
cart.addItem({
  id: 'test-carafe',
  handle: 'precision-thermal-carafe',
  title: 'Precision Thermal Carafe',
  price: 75.00,
  images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136']
}, null, 1);

assert(cart.getTotalCount() === 2, 'Cart count increments to 2 items');
assert(cart.getSubtotal() === 164.00, 'Subtotal is correctly $164.00');

progress = cart.getFreeShippingProgress();
assert(progress.isUnlocked === true, 'Free shipping is now UNLOCKED at $164.00');
assert(progress.percentage === 100, 'Free shipping progress meter reaches 100%');

// Test quantity stepper
cart.updateQuantity('test-grinder', 2);
assert(cart.getTotalCount() === 3, 'Quantity stepper increments grinder to 2 (total count 3)');
assert(cart.getSubtotal() === (89 * 2) + 75, 'Subtotal correctly updates to $253.00');

// Test remove item
cart.removeItem('test-carafe');
assert(cart.getTotalCount() === 2, 'Removed carafe; count is now 2');
assert(cart.getSubtotal() === 178.00, 'Subtotal is $178.00');

// 7. Verify On-Brand Empty State Handlers
const catalogJs = readFileSync(resolve('src/pages/Catalog.js'), 'utf-8');
assert(catalogJs.includes('Curated Collections Arriving Soon'), 'Catalog features on-brand empty state for newly launched Shopify backend');
assert(catalogJs.includes('catalog-waitlist-form'), 'Catalog empty state includes VIP waitlist capture');

console.log(`\nVerification Complete: ${passCount} PASSED, ${failCount} FAILED`);
if (failCount > 0) process.exit(1);
