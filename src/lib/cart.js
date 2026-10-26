import { BRAND } from './constants.js';
import { isShopifyConfigured, createShopifyCartApi } from './shopify.js';
import { showToast } from './utils.js';

const STORAGE_KEY = 'vexo_cart_v1';
const SHOPIFY_CART_ID_KEY = 'vexo_shopify_cart_id';

class CartStore {
  constructor() {
    this.items = [];
    this.shopifyCartId = null;
    this.checkoutUrl = null;
    this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.items = stored ? JSON.parse(stored) : [];
      this.shopifyCartId = localStorage.getItem(SHOPIFY_CART_ID_KEY) || null;
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
      this.items = [];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      if (this.shopifyCartId) {
        localStorage.setItem(SHOPIFY_CART_ID_KEY, this.shopifyCartId);
      }
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
    this.notify();
  }

  notify() {
    window.dispatchEvent(new CustomEvent('vexo:cart-change', {
      detail: {
        items: this.items,
        count: this.getTotalCount(),
        subtotal: this.getSubtotal()
      }
    }));
  }

  getItems() {
    return this.items;
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getFreeShippingProgress() {
    const subtotal = this.getSubtotal();
    const threshold = BRAND.freeShippingThreshold;
    const remaining = Math.max(0, threshold - subtotal);
    const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
    return {
      threshold,
      subtotal,
      remaining,
      percentage,
      isUnlocked: remaining === 0
    };
  }

  /**
   * Add an item to cart
   */
  addItem(product, variant = null, quantity = 1) {
    const variantId = variant?.id || product.variants?.[0]?.id || product.id;
    const variantTitle = variant?.title || product.variants?.[0]?.title || 'Standard';
    const price = variant?.price ?? product.price;

    const existingIndex = this.items.findIndex(item => item.variantId === variantId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        handle: product.handle,
        title: product.title,
        variantId,
        variantTitle: variantTitle !== 'Standard' && variantTitle !== 'Default Title' ? variantTitle : '',
        price,
        image: product.images?.[0] || '',
        quantity,
        benefitTag: product.benefitTag || 'Smart Living'
      });
    }

    this.save();
    showToast(`Added ${product.title} to bag`, 'success');

    // Automatically trigger cart drawer open
    window.dispatchEvent(new CustomEvent('vexo:open-cart'));
  }

  /**
   * Update quantity of an item
   */
  updateQuantity(variantId, quantity) {
    if (quantity <= 0) {
      this.removeItem(variantId);
      return;
    }

    const index = this.items.findIndex(item => item.variantId === variantId);
    if (index > -1) {
      this.items[index].quantity = quantity;
      this.save();
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(variantId) {
    const item = this.items.find(i => i.variantId === variantId);
    this.items = this.items.filter(i => i.variantId !== variantId);
    this.save();
    if (item) {
      showToast(`Removed ${item.title} from bag`, 'info');
    }
  }

  /**
   * Clear all items
   */
  clear() {
    this.items = [];
    this.shopifyCartId = null;
    this.save();
  }

  /**
   * Initiate checkout redirect
   */
  async redirectToCheckout() {
    if (this.items.length === 0) {
      showToast('Your bag is currently empty', 'warning');
      return;
    }

    // If Shopify is configured, create live checkout
    if (isShopifyConfigured()) {
      showToast('Redirecting to secure Shopify checkout...', 'info');
      try {
        const cart = await createShopifyCartApi(this.items);
        if (cart && cart.checkoutUrl) {
          window.location.href = cart.checkoutUrl;
          return;
        }
      } catch (err) {
        console.error('Shopify checkout creation failed', err);
      }
    }

    // Fallback: If in demo / preview mode without API key
    const domain = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHOPIFY_STORE_DOMAIN) || 'vexohome.myshopify.com';
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Standard Shopify direct cart permalink redirect: https://domain/cart/variant_id:quantity
    const permalinkItems = this.items.map(item => {
      // Extract numeric ID if it is a GraphQL GID
      const numId = String(item.variantId).replace(/\D/g, '') || item.variantId;
      return `${numId}:${item.quantity}`;
    }).join(',');

    const fallbackUrl = `https://${cleanDomain}/cart/${permalinkItems}`;
    showToast('Redirecting to Shopify Checkout...', 'info');
    setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 600);
  }
}

export const cart = new CartStore();
