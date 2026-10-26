# Vexo — Luxury Kitchenware & Smart Home Headless Storefront

> **"Smart Living. Beautiful Spaces."**  
> Custom-coded headless e-commerce storefront for **Vexo** (`vexohome.store`), powered by Vite, Vanilla JS, custom luxury CSS, and the Shopify Storefront API.

---

## ⚠️ CRITICAL: PREVIEW INSTRUCTIONS (DEV SERVER REQUIRED)

> **DO NOT double-click `index.html` directly from your file manager (`file://` protocol).**  
> Modern web architecture uses standard JavaScript ES Modules (`import`/`export`), which modern browsers block over `file://` for security reasons (CORS policy).
>
> **The only correct way to run and preview this project is via the local development server:**
> ```bash
> npm install
> npm run dev
> ```
> This immediately opens the development server at `http://localhost:3000` with instant hot-reloading.

---

## 🎨 Brand Identity & Design System

- **Brand**: Vexo
- **Domain**: `vexohome.store` (Hostinger DNS $\rightarrow$ Vercel)
- **Niche**: Smart Kitchen Gadgets & Architectural Smart Home Living
- **Palette**:
  - Obsidian Black (`#0A0A0A` / `#111111`)
  - Warm Brushed Gold (`#D4AF37`)
  - Crisp Architectural White (`#FFFFFF`)
  - Charcoal Surface (`#171717`)
- **Typography**:
  - Headings: *Playfair Display* (Editorial luxury serif)
  - Interface & Body: *Plus Jakarta Sans* (Geometric modern sans)

---

## ⚡ High-Conversion Architecture & Features

1. **Flawless Mobile-First Responsiveness**:
   - Tested rigorously across `360px`, `480px`, `768px`, and `1280px+` viewports.
   - 48px touch targets on all interactive buttons, steppers, and menu links.
   - Zero horizontal overflow (`overflow-x: hidden`).
2. **Rock-Solid Mobile Nav Drawer**:
   - Hamburger button (`.mobile-nav-toggle`) syncs with the slide-in drawer (`.mobile-nav-drawer.is-open`) and backdrop overlay (`.mobile-nav-overlay.is-open`).
   - Smooth slide animation, auto-closes on route click, backdrop tap, or `Escape` key.
3. **Cart Drawer with Real-Time Calculations**:
   - Instant quantity increment/decrement/remove without page reloads.
   - **Free Shipping Progress Bar**: Automatically calculates progress toward the **$150** free shipping threshold.
   - **Recommended Cross-Sell Pairing**: Quick one-click add to cart.
   - **Encrypted Checkout**: Redirects straight to Shopify's secure checkout.
4. **Dynamic Shopify Storefront API Integration**:
   - Fully dynamic GraphQL queries (`GetProducts`, `GetProductByHandle`, `CartCreate`).
   - **Intentional Empty State**: When your Shopify store has 0 products initially, the catalog displays an on-brand luxury VIP reserve waitlist screen (*"Curated Collections Arriving Soon"*), never a broken or blank page.
5. **Product Detail Page (PDP) Conversion Engine**:
   - Multi-angle gallery with interactive thumbnail switching.
   - Finish / variant picker chips.
   - **Low Stock Urgency Indicator**: Triggers when inventory is $\le 5$ units.
   - **Sticky Mobile Add-to-Cart Bar**: Appears on mobile when the main CTA scrolls out of view.
   - Comprehensive materials, care, and shipping accordions.
6. **Quick View Modal**:
   - Allows shoppers to view finishes and add items to their bag directly from product grids.

---

## 📁 Modular Directory Structure

```
vexo/
├── .env.example                     # Shopify Storefront API variable blueprint
├── .gitignore                       # Node modules, dist, and .env safeguards
├── index.html                       # Semantic HTML5 entry with luxury meta tags
├── package.json                     # Vite dev and build scripts
├── vite.config.js                   # Vite configuration (port 3000)
├── README.md                        # Complete project manual & deployment guide
├── public/
│   ├── favicon.svg                  # Minimalist luxury monogram favicon
│   └── assets/
│       └── brand/
│           ├── vexo-logo.svg        # Obsidian & gold luxury wordmark
│           └── vexo-logo-light.svg  # Pure white & gold luxury wordmark
├── tests/
│   └── buyer-flow.test.js           # Automated 36-point buyer flow verification suite
└── src/
    ├── styles/
    │   ├── variables.css            # Luxury color tokens (#D4AF37), typography, spacing
    │   ├── base.css                 # CSS reset, typography, buttons, toasts
    │   ├── header-nav.css           # Sticky glassmorphism header & mobile drawer
    │   ├── components.css           # Badges, star reviews, trust strip, modals
    │   ├── product-card.css         # Grid layouts, benefit badges, hover zoom
    │   ├── cart-drawer.css          # Real-time cart drawer, shipping progress, upsells
    │   ├── pdp.css                  # Product gallery, specs accordion, sticky mobile bar
    │   ├── catalog.css              # Category tabs, sort select, on-brand empty state
    │   ├── about.css                # Editorial story layouts, concierge contact form
    │   ├── home.css                 # Hero banner, category cards, newsletter
    │   ├── responsive.css           # 360px-480px mobile hardening & touch target enforcement
    │   └── main.css                 # Master stylesheet cascade
    ├── lib/
    │   ├── constants.js             # Brand tokens, editorial photography URLs, categories
    │   ├── shopify.js               # Shopify Storefront GraphQL client
    │   ├── cart.js                  # Persistent cart manager (localStorage + Shopify Cart)
    │   └── utils.js                 # Currency formatter, toast system, debounce
    ├── components/
    │   ├── Header.js                # Top announcement, logo, desktop nav, cart badge
    │   ├── MobileNav.js             # Slide-in mobile drawer (360px-768px touch target verified)
    │   ├── CartDrawer.js            # Real-time drawer, $150 shipping meter, upsells
    │   ├── QuickViewModal.js        # Quick product preview modal
    │   ├── ProductCard.js           # Product card with benefit tag, star ratings, price
    │   ├── TrustStrip.js            # 30-day trial, free shipping, 2-year warranty badges
    │   └── Footer.js                # Brand editorial footer & VIP newsletter
    ├── pages/
    │   ├── Home.js                  # Hero, category cards, dynamic best sellers, story teaser
    │   ├── Catalog.js               # Category filters, sorting, intentional luxury empty state
    │   ├── ProductDetail.js         # Multi-angle gallery, low stock indicator, sticky mobile CTA
    │   ├── CartPage.js              # Dedicated full-page bag view
    │   ├── About.js                 # Brand story, craftsmanship ethos, concierge contact form
    │   └── NotFound.js              # On-brand luxury 404 page
    └── main.js                      # Hash router, state hydration, event binding
```

---

## 🔑 How to Connect Your Shopify Store

1. In your **Shopify Admin**, navigate to:  
   **Settings $\rightarrow$ Apps and sales channels $\rightarrow$ Develop apps**
2. Click **Create an app** (name it `Vexo Storefront`).
3. Click **Configure Storefront API scopes** and enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_customers`
4. Click **Install app** and copy your **Storefront API access token**.
5. Create a local `.env` file (copying from `.env.example`):
   ```bash
   cp .env.example .env
   ```
6. Paste your credentials into `.env`:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_public_storefront_access_token_here
   VITE_SHOPIFY_API_VERSION=2024-01
   ```

*(Note: `.env` is listed in `.gitignore` so your private tokens are never committed to version control).*

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open in your browser (default port 3000)
# http://localhost:3000
```

To run the automated verification suite:
```bash
node tests/buyer-flow.test.js
```

To build for production:
```bash
npm run build
```

---

## 🌐 Deploying to Vercel & Pushing to GitHub

### 1. Initialize and Push to GitHub
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: Vexo luxury headless storefront"

# Link to your GitHub repository
git remote add origin https://github.com/<your-username>/vexo.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel
1. Log into [vercel.com](https://vercel.com) and click **Add New $\rightarrow$ Project**.
2. Import your `vexo` GitHub repository.
3. In the **Configure Project** screen:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_SHOPIFY_STORE_DOMAIN` = `yourstore.myshopify.com`
   - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` = `your_token`
   - `VITE_SHOPIFY_API_VERSION` = `2024-01`
5. Click **Deploy**. Vercel will build and deploy your site within seconds.

---

## 🔗 Custom Domain DNS Configuration (`vexohome.store`)

Since your domain is hosted on **Hostinger**, configure your DNS records in the Hostinger DNS Zone Management panel to point to Vercel:

1. **Apex Domain (`vexohome.store`)**:
   - **Type**: `A`
   - **Name**: `@`
   - **Points to / Value**: `76.76.21.21`
   - **TTL**: `3600`
2. **Subdomain (`www.vexohome.store`)**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Points to / Value**: `cname.vercel-dns.com`
   - **TTL**: `3600`
3. Inside your **Vercel Project Dashboard** $\rightarrow$ **Settings $\rightarrow$ Domains**, add `vexohome.store` and `www.vexohome.store`. Vercel will automatically provision a free SSL certificate.
