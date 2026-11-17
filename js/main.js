/**
 * ZAPHIRA — Application Bootstrap & Main Entry Point
 */

import { initNavbar } from './components/navbar.js';
import { initHero } from './components/hero.js';
import { initCustomizer } from './components/customizer.js';
import { initCollection } from './components/collection.js';
import { initQuickViewModal } from './components/quickview-modal.js';
import { initCartAddedModal } from './components/cart-added-modal.js';
import { initSearchModal } from './components/search-modal.js';
import { initStoryModal } from './components/story-modal.js';
import { showToast } from './components/toast.js';

import { TESTIMONIALS } from './data/testimonials.js';
import { JOURNAL_ENTRIES } from './data/journal.js';
import { applyLanguage, loc, t } from './utils/i18n.js';
import { escapeHtml } from './utils/escape.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initNavbar();
  initHero();
  initCustomizer();
  initCollection();
  initQuickViewModal();
  initCartAddedModal();
  initSearchModal();
  initStoryModal();

  initTestimonialsSlider();
  initJournalFeed();
  initNewsletterForm();
  initScrollReveals();

  // Apply saved language (also sets <html lang/dir>)
  applyLanguage();
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

  const AUTO_ADVANCE_MS = 6000;
  let activeIndex = 0;
  let timerId = null;

  dotsContainer.innerHTML = TESTIMONIALS.map((_, idx) => `
    <button type="button" class="nav-dot ${idx === 0 ? 'is-active' : ''}" data-test-idx="${idx}"
            aria-label="${escapeHtml(t('testimonials.dotLabel', { n: idx + 1 }))}"></button>
  `).join('');

  // Labels include the dot number, so they're rebuilt here rather than via data-i18n-aria
  document.addEventListener('i18n:change', () => {
    dotsContainer.querySelectorAll('.nav-dot').forEach((dot, idx) => {
      dot.setAttribute('aria-label', t('testimonials.dotLabel', { n: idx + 1 }));
    });
    fillTestimonial(TESTIMONIALS[activeIndex]);
  });

  function fillTestimonial(testimonial) {
    quoteEl.textContent = `“${loc(testimonial.quote)}”`;
    if (authorEl) authorEl.textContent = testimonial.author;
    if (locEl) locEl.textContent = `${loc(testimonial.location)} • ${testimonial.product}`;
  }

  function showTestimonial(idx) {
    activeIndex = idx;
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
      fillTestimonial(TESTIMONIALS[idx]);
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 200);

    dotsContainer.querySelectorAll('.nav-dot').forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
  }

  // One timer at a time; restarted after manual navigation and paused while the tab is hidden
  function startAutoAdvance() {
    stopAutoAdvance();
    timerId = setInterval(() => showTestimonial((activeIndex + 1) % TESTIMONIALS.length), AUTO_ADVANCE_MS);
  }

  function stopAutoAdvance() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  quoteEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  fillTestimonial(TESTIMONIALS[0]);

  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-test-idx]');
    if (dot) {
      showTestimonial(parseInt(dot.getAttribute('data-test-idx'), 10));
      startAutoAdvance();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoAdvance();
    else startAutoAdvance();
  });

  startAutoAdvance();
}

/**
 * Journal / Instagram Feed
 */
function initJournalFeed() {
  const container = document.getElementById('journal-grid-container');
  if (!container) return;

  container.innerHTML = JOURNAL_ENTRIES.map(entry => `
    <article class="journal-card reveal" data-journal-id="${escapeHtml(entry.id)}">
      <img src="${escapeHtml(entry.image)}" alt="${escapeHtml(loc(entry.title))}" loading="lazy">
      <div class="journal-card-overlay">
        <span class="journal-tag">${escapeHtml(loc(entry.tag))} • ${escapeHtml(loc(entry.readTime))}</span>
        <h3 class="journal-title">${escapeHtml(loc(entry.title))}</h3>
      </div>
    </article>
  `).join('');

  // Update text in place so cards keep their scroll-reveal state
  document.addEventListener('i18n:change', () => {
    container.querySelectorAll('.journal-card').forEach((card, idx) => {
      const entry = JOURNAL_ENTRIES[idx];
      card.querySelector('img').alt = loc(entry.title);
      card.querySelector('.journal-tag').textContent = `${loc(entry.tag)} • ${loc(entry.readTime)}`;
      card.querySelector('.journal-title').textContent = loc(entry.title);
    });
  });

  container.addEventListener('click', (e) => {
    if (e.target.closest('.journal-card')) {
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
      showToast(t('toast.newsletterTitle'), t('toast.newsletterMsg'));
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
