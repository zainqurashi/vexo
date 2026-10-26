// Vexo Brand & Architectural Constants
export const BRAND = {
  name: 'Vexo',
  domain: 'vexohome.store',
  tagline: 'Smart Living. Beautiful Spaces.',
  subTagline: 'Architectural Kitchen & Smart Home Gadgets',
  supportEmail: 'concierge@vexohome.store',
  freeShippingThreshold: 150,
  currency: 'USD',
  currencySymbol: '$'
};

// Realistic Photography Assets (High-Res Curated Editorial Unsplash URLs)
export const ASSETS = {
  heroBg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85', // Luxury modern dark architectural kitchen & living space
  heroSecondary: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
  categories: {
    kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=85', // Smart kitchen & precision cookware
    home: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85', // Ambient smart living gadgets
    bar: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85', // Smart barware & aerators
    innovations: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85' // Precision gadgets
  },
  about: {
    story1: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85', // Luxury kitchen craftsmanship
    story2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', // Modern architectural interior
    craft: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85'
  }
};

// Trust Strip Highlights
export const TRUST_POINTS = [
  {
    icon: 'shipping',
    title: 'Complimentary Shipping',
    desc: 'Worldwide express delivery on orders over $150'
  },
  {
    icon: 'trial',
    title: '30-Day In-Home Trial',
    desc: 'Experience precision in your space risk-free'
  },
  {
    icon: 'warranty',
    title: '2-Year Craftsmanship Warranty',
    desc: 'Engineered with commercial-grade durability'
  },
  {
    icon: 'support',
    title: 'Dedicated VIP Concierge',
    desc: 'Expert support 7 days a week for all inquiries'
  }
];

// Curated Categories
export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Innovations',
    handle: 'all'
  },
  {
    id: 'smart-kitchen',
    name: 'Smart Kitchen',
    handle: 'smart-kitchen',
    image: ASSETS.categories.kitchen,
    desc: 'Precision gravity grinders, electric preservation, and culinary instruments.'
  },
  {
    id: 'smart-home',
    name: 'Smart Home Living',
    handle: 'smart-home',
    image: ASSETS.categories.home,
    desc: 'Ambient lighting, ultrasonic diffusers, and magnetic levitation organizers.'
  },
  {
    id: 'smart-bar',
    name: 'Smart Barware',
    handle: 'smart-bar',
    image: ASSETS.categories.bar,
    desc: 'Automated wine preservation, aerators, and chilled whiskey stones.'
  }
];
