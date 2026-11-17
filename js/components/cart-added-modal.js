/**
 * ZAPHIRA — Added-to-Cart Confirmation Modal
 * The single feedback shown after any add-to-bag; links to panier.html.
 */

import { t } from '../utils/i18n.js';
import { escapeHtml } from '../utils/escape.js';
import { describeCartItem } from '../utils/cart-display.js';

export function initCartAddedModal() {
  let modalWrapper = document.getElementById('cart-added-modal-wrapper');
  
  if (!modalWrapper) {
    modalWrapper = document.createElement('div');
    modalWrapper.id = 'cart-added-modal-wrapper';
    modalWrapper.className = 'cart-added-modal-wrapper';
    modalWrapper.innerHTML = `
      <div class="cart-added-backdrop" id="cart-added-backdrop"></div>
      <div class="cart-added-card reveal-modal" role="dialog" aria-modal="true" aria-labelledby="cart-added-title">
        <button type="button" class="cart-added-close-btn" id="cart-added-close" data-i18n-aria="cartAdded.close" aria-label="${escapeHtml(t('cartAdded.close'))}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="cart-added-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>

        <h3 class="cart-added-title" id="cart-added-title" data-i18n="cartAdded.title">${escapeHtml(t('cartAdded.title'))}</h3>

        <div class="cart-added-item-preview" id="cart-added-preview"></div>

        <div class="cart-added-actions">
          <a href="panier.html" class="btn-hermes-black" id="cart-added-view-btn" data-i18n="cartAdded.viewBag">${escapeHtml(t('cartAdded.viewBag'))}</a>
        </div>
      </div>
    `;
    document.body.appendChild(modalWrapper);
  }

  const backdrop = document.getElementById('cart-added-backdrop');
  const closeBtn = document.getElementById('cart-added-close');
  const viewBtn = document.getElementById('cart-added-view-btn');
  const previewContainer = document.getElementById('cart-added-preview');

  function openModal(product) {
    if (previewContainer && product) {
      const { name } = describeCartItem(product);
      previewContainer.innerHTML = `
        <div class="cart-added-item-info">
          ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(name)}" class="cart-added-thumb">` : ''}
          <div class="cart-added-details">
            <span class="cart-added-name">${escapeHtml(name)}</span>
            ${product.isCustom ? `<span class="cart-added-sub">${escapeHtml(t('cartAdded.bespokeSub'))}</span>` : ''}
          </div>
        </div>
      `;
    }
    modalWrapper.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalWrapper.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrapper.classList.contains('is-active')) {
      closeModal();
    }
  });

  window.addEventListener('cart:item-added', (e) => {
    openModal(e.detail?.product);
  });
}
