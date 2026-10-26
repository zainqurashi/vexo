import './styles/main.css';

import { renderHeader, initHeader } from './components/Header.js';
import { renderMobileNav, initMobileNav } from './components/MobileNav.js';
import { renderCartDrawer, initCartDrawer } from './components/CartDrawer.js';
import { renderQuickViewModal, initQuickViewModal } from './components/QuickViewModal.js';
import { renderFooter, initFooter } from './components/Footer.js';

import { renderHome, initHome } from './pages/Home.js';
import { renderCatalog, initCatalog } from './pages/Catalog.js';
import { renderProductDetail, initProductDetail } from './pages/ProductDetail.js';
import { renderCartPage, initCartPage } from './pages/CartPage.js';
import { renderAbout, initAbout } from './pages/About.js';
import { renderNotFound } from './pages/NotFound.js';
import { scrollToTop } from './lib/utils.js';

// Application State
const app = document.getElementById('app');

/**
 * Route Dispatcher
 */
async function router() {
  const hash = window.location.hash || '#/';
  const [routePath, queryString] = hash.slice(1).split('?');

  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Active link highlighter
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === routePath || (routePath === '/' && route === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Match routes
  if (routePath === '' || routePath === '/') {
    mainContent.innerHTML = await renderHome();
    await initHome();
  } else if (routePath === '/catalog') {
    mainContent.innerHTML = await renderCatalog();
    await initCatalog();
  } else if (routePath.startsWith('/product/')) {
    const handle = routePath.replace('/product/', '').trim();
    mainContent.innerHTML = await renderProductDetail(handle);
    await initProductDetail(handle);
  } else if (routePath === '/cart') {
    mainContent.innerHTML = await renderCartPage();
    initCartPage();
  } else if (routePath === '/about') {
    mainContent.innerHTML = await renderAbout();
    initAbout();
  } else {
    mainContent.innerHTML = renderNotFound();
  }

  scrollToTop();
}

/**
 * Bootstrap Layout
 */
function initApp() {
  if (!app) return;

  app.innerHTML = `
    <!-- Sticky Header & Announcement -->
    ${renderHeader()}

    <!-- Mobile Drawer Navigation -->
    ${renderMobileNav()}

    <!-- Cart Drawer Flyout -->
    ${renderCartDrawer()}

    <!-- Quick View Modal Container -->
    ${renderQuickViewModal()}

    <!-- Dynamic Page Content -->
    <main id="main-content" role="main"></main>

    <!-- Editorial Footer -->
    ${renderFooter()}
  `;

  // Initialize interactive components
  initHeader();
  initMobileNav();
  initCartDrawer();
  initQuickViewModal();
  initFooter();

  // Route listeners
  window.addEventListener('hashchange', router);
  router();
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
