/**
 * ZAPHIRA — Curated Collection Grid Component
 */

import { PRODUCTS } from '../data/products.js';
import { cartStore } from '../state/cart-state.js';
import { showToast } from './toast.js';

export function initCollection() {
  const container = document.getElementById('collection-grid-container');
  if (!container) return;

  renderCollection(container);
  cartStore.subscribe(() => renderCollection(container));

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
      const id = addToBagBtn.getAttribute('data-add-bag-id');
      const prod = PRODUCTS.find(p => p.id === id);
      if (prod) {
        cartStore.addItem({
          id: prod.id,
          name: prod.name,
          priceDZD: prod.priceDZD,
          image: prod.images.primary,
          quantity: 1,
          isCustom: false,
          specs: {
            collection: prod.collection,
            materials: prod.materials
          }
        });
        showToast('Added to Bag', `${prod.name} has been added to your shopping bag.`);
        document.dispatchEvent(new CustomEvent('cart:open'));
      }
    }
  });
}

function renderCollection(container) {
  container.innerHTML = PRODUCTS.map(prod => `
    <article class="product-card reveal" data-product-id="${prod.id}">
      <div class="product-image-container">
        <span class="badge ${prod.badgeClass} product-card-badge">${prod.tag}</span>
        <img src="${prod.images.primary}" alt="${prod.name} luxury handcrafted bag" loading="lazy">
        <div class="product-overlay-actions">
          <button type="button" class="btn btn-secondary btn-sm btn-full" data-quick-view-id="${prod.id}">
            Quick View
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-material-tag">${prod.collection}</div>
        <h3 class="product-name">${prod.name}</h3>
        <div class="product-price-row">
          <span class="product-price">${cartStore.formatPrice(prod.priceDZD)}</span>
          <button type="button" class="btn-text" data-add-bag-id="${prod.id}">
            Add to Bag +
          </button>
        </div>
      </div>
    </article>
  `).join('');
}
