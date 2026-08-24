/**
 * ZAPHIRA — Application Bootstrap & Main Entry Point
 */

import { initNavbar, applyLanguage } from './components/navbar.js';
import { initHero } from './components/hero.js';
import { initCustomizer } from './components/customizer.js';
import { initCollection } from './components/collection.js';
import { initQuickViewModal } from './components/quickview-modal.js';
import { initCartDrawer } from './components/cart-drawer.js';
import { initCheckoutModal } from './components/checkout-modal.js';
import { initSearchModal } from './components/search-modal.js';
import { initStoryModal } from './components/story-modal.js';
import { showToast } from './components/toast.js';

import { TESTIMONIALS } from './data/testimonials.js';
import { JOURNAL_ENTRIES } from './data/journal.js';
import { cartStore } from './state/cart-state.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initNavbar();
  initHero();
  initCustomizer();
  initCollection();
  initQuickViewModal();
  initCartDrawer();
  initCheckoutModal();
  initSearchModal();
  initStoryModal();

  initTestimonialsSlider();
  initJournalFeed();
  initNewsletterForm();
  initScrollReveals();

  // Apply saved language
  applyLanguage(cartStore.language);
});

/**
 * Testimonials Slider
 */
function initTestimonialsSlider() {
  const quoteEl = document.getElementById('testimonial-quote-text');
  const authorEl = document.getElementById('testimonial-author-name');
  const locEl = document.getElementById('testimonial-author-loc');
  const dotsContainer = document.getElementById('testimonial-dots-container');

  if (!quoteEl || !dotsContainer) return;

  let activeIndex = 0;

  dotsContainer.innerHTML = TESTIMONIALS.map((_, idx) => `
    <button type="button" class="nav-dot ${idx === 0 ? 'is-active' : ''}" data-test-idx="${idx}" aria-label="View testimonial ${idx + 1}"></button>
  `).join('');

  function showTestimonial(idx) {
    activeIndex = idx;
    const t = TESTIMONIALS[idx];
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
      quoteEl.textContent = `“${t.quote}”`;
      if (authorEl) authorEl.textContent = t.author;
      if (locEl) locEl.textContent = `${t.location} • ${t.product}`;
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 200);

    const dots = dotsContainer.querySelectorAll('.nav-dot');
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  quoteEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-test-idx]');
    if (dot) {
      const idx = parseInt(dot.getAttribute('data-test-idx'), 10);
      showTestimonial(idx);
    }
  });

  // Auto advance every 6 seconds
  setInterval(() => {
    activeIndex = (activeIndex + 1) % TESTIMONIALS.length;
    showTestimonial(activeIndex);
  }, 6000);
}

/**
 * Journal / Instagram Feed
 */
function initJournalFeed() {
  const container = document.getElementById('journal-grid-container');
  if (!container) return;

  container.innerHTML = JOURNAL_ENTRIES.map(entry => `
    <article class="journal-card reveal" data-journal-id="${entry.id}">
      <img src="${entry.image}" alt="${entry.title}" loading="lazy">
      <div class="journal-card-overlay">
        <span class="journal-tag">${entry.tag} • ${entry.readTime}</span>
        <h3 class="journal-title">${entry.title}</h3>
      </div>
    </article>
  `).join('');

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.journal-card');
    if (card) {
      document.dispatchEvent(new CustomEvent('story:open'));
    }
  });
}

/**
 * Newsletter Form
 */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-subscription-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('Exclusive Invitation Confirmed', `Welcome to the Maison Zaphira circle. You will receive private previews.`);
      input.value = '';
    }
  });
}

/**
 * Smooth Scroll Reveal Observer
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-revealed'));
  }
}
