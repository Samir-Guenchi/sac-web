/**
 * ZAPHIRA — Curated Collection Grid Component
 */

import { PRODUCTS } from '../data/products.js';
import { cartStore } from '../state/cart-state.js';
import { loc, t } from '../utils/i18n.js';
import { escapeHtml } from '../utils/escape.js';

export function initCollection() {
  const container = document.getElementById('collection-grid-container');
  if (!container) return;

  // Rendered once; cards carry .reveal and are picked up by the scroll observer.
  // Currency and language changes rewrite text in place, so revealed cards are never replaced.
  renderCollection(container);
  cartStore.subscribe(() => updatePrices(container));
  document.addEventListener('i18n:change', () => updateLocalizedText(container));

  // Event delegation for quick view and add to bag
  container.addEventListener('click', (e) => {
    const quickViewBtn = e.target.closest('[data-quick-view-id]');
    if (quickViewBtn) {
      const id = quickViewBtn.getAttribute('data-quick-view-id');
      document.dispatchEvent(new CustomEvent('quickview:open', { detail: { productId: id } }));
      return;
    }

    const addToBagBtn = e.target.closest('[data-add-bag-id]');
    if (addToBagBtn) {
      const prod = PRODUCTS.find(p => p.id === addToBagBtn.getAttribute('data-add-bag-id'));
      // cartStore fires `cart:item-added`, which opens the confirmation card
      if (prod) cartStore.addItem(toCartItem(prod, 1));
    }
  });
}

/** Catalog items are stored by product id; display text is resolved per language. */
export function toCartItem(prod, quantity) {
  return {
    id: prod.id,
    name: prod.name,
    priceDZD: prod.priceDZD,
    image: prod.images.primary,
    quantity,
    isCustom: false,
    specs: null
  };
}

function renderCollection(container) {
  container.innerHTML = PRODUCTS.map(prod => `
    <article class="product-card reveal" data-product-id="${escapeHtml(prod.id)}">
      <div class="product-image-container">
        <span class="badge ${escapeHtml(prod.badgeClass)} product-card-badge" data-prod-field="tag">${escapeHtml(loc(prod.tag))}</span>
        <img src="${escapeHtml(prod.images.primary)}" alt="${escapeHtml(prod.name)}" loading="lazy">
        <div class="product-overlay-actions">
          <button type="button" class="btn btn-secondary btn-sm btn-full" data-quick-view-id="${escapeHtml(prod.id)}" data-i18n="collection.quickView">
            ${escapeHtml(t('collection.quickView'))}
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-material-tag" data-prod-field="collection">${escapeHtml(loc(prod.collection))}</div>
        <h3 class="product-name">${escapeHtml(prod.name)}</h3>
        <div class="product-price-row">
          <span class="product-price" data-price-dzd="${prod.priceDZD}">${escapeHtml(cartStore.formatPrice(prod.priceDZD))}</span>
          <button type="button" class="btn-text" data-add-bag-id="${escapeHtml(prod.id)}">
            <span data-i18n="collection.addToBag">${escapeHtml(t('collection.addToBag'))}</span> +
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function updatePrices(container) {
  container.querySelectorAll('[data-price-dzd]').forEach(el => {
    el.textContent = cartStore.formatPrice(Number(el.getAttribute('data-price-dzd')));
  });
}

function updateLocalizedText(container) {
  container.querySelectorAll('.product-card').forEach(card => {
    const prod = PRODUCTS.find(p => p.id === card.getAttribute('data-product-id'));
    if (!prod) return;
    card.querySelectorAll('[data-prod-field]').forEach(el => {
      el.textContent = loc(prod[el.getAttribute('data-prod-field')]);
    });
  });
}
