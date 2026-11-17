/**
 * ZAPHIRA — Navbar Controller
 */

import { cartStore } from '../state/cart-state.js';

export function initNavbar() {
  const header = document.getElementById('site-header');
  const bagBadge = document.getElementById('bag-count-badge');
  const bagBtn = document.getElementById('nav-bag-btn');
  const searchBtn = document.getElementById('nav-search-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileDrawerClose = document.getElementById('mobile-nav-close');
  const mobileDrawerBackdrop = document.getElementById('mobile-nav-backdrop');
  
  const currencySelect = document.getElementById('currency-select');
  const langSelect = document.getElementById('lang-select');

  // Scroll Listener for Sticky Luxury Navigation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // Update Cart Count Badge
  function updateBadge() {
    const count = cartStore.getItemCount();
    if (bagBadge) {
      bagBadge.textContent = count;
      bagBadge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  cartStore.subscribe(updateBadge);
  updateBadge();

  // Cart button links directly to panier.html

  // Open Search Modal on button or input interaction
  const searchInput = document.getElementById('hermes-search-field');
  const searchForm = document.getElementById('header-search-form');

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('search:open'));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      document.dispatchEvent(new CustomEvent('search:open'));
      searchInput.blur();
    });
    searchInput.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('search:open'));
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('search:open'));
    });
  }

  // Mobile Menu Drawer Toggles
  function openMobileMenu() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      mobileDrawer.classList.add('is-open');
      mobileDrawerBackdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      mobileDrawer.classList.remove('is-open');
      mobileDrawerBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileMenu);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeMobileMenu);

  // Close mobile drawer when clicking navigation link
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Currency Selection
  if (currencySelect) {
    currencySelect.value = cartStore.currency;
    currencySelect.addEventListener('change', (e) => {
      cartStore.setCurrency(e.target.value);
    });
  }

  // Language Selection
  if (langSelect) {
    langSelect.value = cartStore.language;
    langSelect.addEventListener('change', (e) => {
      cartStore.setLanguage(e.target.value);
    });
  }
}
