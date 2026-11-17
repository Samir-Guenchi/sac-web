/**
 * ZAPHIRA — Live Search Overlay Component
 */

import { PRODUCTS } from '../data/products.js';
import { cartStore } from '../state/cart-state.js';
import { loc, t } from '../utils/i18n.js';
import { escapeHtml } from '../utils/escape.js';

export function initSearchModal() {
  const backdrop = document.getElementById('search-backdrop');
  const wrapper = document.getElementById('search-modal-wrapper');
  if (!backdrop || !wrapper) return;

  function openSearch() {
    backdrop.classList.add('is-active');
    wrapper.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    renderSearchMarkup();
    setTimeout(() => {
      const input = wrapper.querySelector('#live-search-input');
      if (input) input.focus();
    }, 100);
  }

  function closeSearch() {
    backdrop.classList.remove('is-active');
    wrapper.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  document.addEventListener('search:open', openSearch);
  backdrop.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrapper.classList.contains('is-active')) {
      closeSearch();
    }
  });

  function renderSearchMarkup() {
    wrapper.innerHTML = `
      <button class="modal-close-btn" id="search-close-btn" aria-label="${escapeHtml(t('search.close'))}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="padding: var(--space-8);">
        <div style="margin-bottom: var(--space-6);">
          <div class="caption" style="color: var(--color-champagne-dark); margin-bottom: var(--space-2);">${escapeHtml(t('search.label'))}</div>
          <div style="display: flex; align-items: center; border-bottom: 1px solid var(--border-medium); padding-bottom: var(--space-2);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color: var(--text-muted); margin-right: var(--space-3);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="live-search-input" placeholder="${escapeHtml(t('search.placeholder'))}" aria-label="${escapeHtml(t('search.label'))}" style="width: 100%; font-family: var(--font-serif); font-size: 1.5rem; background: transparent; border: none; outline: none; color: var(--color-charcoal);">
          </div>
        </div>

        <div id="search-results-box" style="max-height: 420px; overflow-y: auto;">
          <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-4);">${escapeHtml(t('search.popular'))}</div>
          <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-6);">
            <button type="button" class="option-pill-btn search-suggestion-pill" data-query="Pearl Ivory">Pearl Ivory</button>
            <button type="button" class="option-pill-btn search-suggestion-pill" data-query="Noir Prestige">Noir Prestige</button>
            <button type="button" class="option-pill-btn search-suggestion-pill" data-query="Organza">Organza</button>
            <button type="button" class="option-pill-btn search-suggestion-pill" data-query="Baroque Pearls">Baroque Pearls</button>
          </div>
          <div id="search-cards-container" style="display: flex; flex-direction: column; gap: var(--space-3);">
            <!-- Dynamic Result Items -->
          </div>
        </div>
      </div>
    `;

    const closeBtn = wrapper.querySelector('#search-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    const input = wrapper.querySelector('#live-search-input');
    const cardsContainer = wrapper.querySelector('#search-cards-container');

    function performSearch(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        cardsContainer.innerHTML = '';
        return;
      }

      // Match in every language, so "perles" or "لؤلؤ" find the same bags as "pearls"
      const allText = value => (value && typeof value === 'object' ? Object.values(value) : [value]);
      const filtered = PRODUCTS.filter(p =>
        [p.name, p.collection, p.materials, p.shortDescription]
          .flatMap(allText)
          .some(text => String(text).toLowerCase().includes(q))
      );

      if (filtered.length === 0) {
        cardsContainer.innerHTML = `
          <div style="padding: var(--space-6); text-align: center; color: var(--text-muted); font-size: var(--text-sm);">
            ${escapeHtml(t('search.noResults', { query: query.trim() }))}
          </div>
        `;
        return;
      }

      cardsContainer.innerHTML = filtered.map(p => `
        <div class="search-result-item" data-search-id="${escapeHtml(p.id)}" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated); cursor: pointer; transition: all var(--duration-fast) ease;">
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <img src="${escapeHtml(p.images.primary)}" alt="${escapeHtml(p.name)}" style="width: 52px; height: 65px; object-fit: cover; border-radius: 2px;">
            <div>
              <div style="font-family: var(--font-serif); font-size: var(--text-base); color: var(--color-charcoal);">${escapeHtml(p.name)}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted);">${escapeHtml(loc(p.collection))} • ${escapeHtml(loc(p.materials).split(/[,،]/)[0])}</div>
            </div>
          </div>
          <div style="font-size: var(--text-sm); font-weight: 600; color: var(--color-charcoal);">
            ${escapeHtml(cartStore.formatPrice(p.priceDZD))}
          </div>
        </div>
      `).join('');

      cardsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-search-id');
          closeSearch();
          document.dispatchEvent(new CustomEvent('quickview:open', { detail: { productId: id } }));
        });
      });
    }

    if (input) {
      input.addEventListener('input', (e) => performSearch(e.target.value));
    }

    wrapper.querySelectorAll('.search-suggestion-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        if (input) {
          input.value = query;
          performSearch(query);
        }
      });
    });
  }
}
