/**
 * ZAPHIRA — Quick View Product Modal Component
 */

import { PRODUCTS } from '../data/products.js';
import { cartStore } from '../state/cart-state.js';
import { showToast } from './toast.js';

export function initQuickViewModal() {
  const backdrop = document.getElementById('quickview-backdrop');
  const wrapper = document.getElementById('quickview-modal-wrapper');
  if (!backdrop || !wrapper) return;

  let currentProduct = null;
  let currentQty = 1;

  document.addEventListener('quickview:open', (e) => {
    const productId = e.detail?.productId;
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    currentProduct = prod;
    currentQty = 1;
    renderModalContent(prod);
    openModal();
  });

  function openModal() {
    backdrop.classList.add('is-active');
    wrapper.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('is-active');
    wrapper.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrapper.classList.contains('is-active')) {
      closeModal();
    }
  });

  function renderModalContent(prod) {
    wrapper.innerHTML = `
      <button class="modal-close-btn" id="quickview-close-btn" aria-label="Close modal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: var(--space-8); padding: var(--space-8);" class="quickview-grid">
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="aspect-ratio: 3/4; border-radius: var(--radius-xs); overflow: hidden; background-color: var(--color-ivory-surface); border: 1px solid var(--border-subtle);">
            <img id="quickview-main-image" src="${prod.images.primary}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="display: flex; gap: var(--space-2);">
            ${prod.images.gallery.map((img, idx) => `
              <button type="button" class="quickview-thumb-btn" data-thumb-src="${img}" style="width: 60px; height: 60px; border-radius: var(--radius-xs); overflow: hidden; border: 1px solid ${idx === 0 ? 'var(--color-champagne-dark)' : 'var(--border-subtle)'}; cursor: pointer;">
                <img src="${img}" alt="" style="width: 100%; height: 100%; object-fit: cover;">
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="caption" style="color: var(--color-champagne-dark); margin-bottom: var(--space-1);">${prod.collection}</div>
            <h2 style="font-size: 2rem; margin-bottom: var(--space-3);">${prod.name}</h2>
            <div style="font-size: 1.35rem; font-family: var(--font-serif); margin-bottom: var(--space-4); color: var(--color-charcoal);">
              ${cartStore.formatPrice(prod.priceDZD)}
            </div>
            <p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-secondary); margin-bottom: var(--space-6); font-weight: 300;">
              ${prod.fullDescription}
            </p>

            <div style="background-color: var(--color-ivory); padding: var(--space-4); border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); margin-bottom: var(--space-6); display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--text-xs);">
              <div><strong style="text-transform: uppercase; color: var(--text-muted);">Materials:</strong> ${prod.materials}</div>
              <div><strong style="text-transform: uppercase; color: var(--text-muted);">Dimensions:</strong> ${prod.dimensions}</div>
              <div><strong style="text-transform: uppercase; color: var(--text-muted);">Hardware:</strong> ${prod.hardware}</div>
            </div>
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
              <div class="cart-qty-control" style="padding: 4px 8px;">
                <button type="button" class="cart-qty-btn" id="qv-qty-minus">-</button>
                <span class="cart-qty-value" id="qv-qty-val">1</span>
                <button type="button" class="cart-qty-btn" id="qv-qty-plus">+</button>
              </div>
              <button type="button" class="btn btn-primary btn-full" id="qv-add-btn">
                Add to Bag • ${cartStore.formatPrice(prod.priceDZD)}
              </button>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted); text-align: center;">
              Complimentary luxury packaging & insured delivery across Algeria & Worldwide.
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Close Button
    const closeBtn = wrapper.querySelector('#quickview-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Bind Thumbnail Switcher
    const mainImg = wrapper.querySelector('#quickview-main-image');
    const thumbBtns = wrapper.querySelectorAll('.quickview-thumb-btn');
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-thumb-src');
        if (mainImg) mainImg.src = src;
        thumbBtns.forEach(b => b.style.borderColor = 'var(--border-subtle)');
        btn.style.borderColor = 'var(--color-champagne-dark)';
      });
    });

    // Quantity Handlers
    const qtyVal = wrapper.querySelector('#qv-qty-val');
    const btnMinus = wrapper.querySelector('#qv-qty-minus');
    const btnPlus = wrapper.querySelector('#qv-qty-plus');
    const addBtn = wrapper.querySelector('#qv-add-btn');

    if (btnMinus && btnPlus && qtyVal) {
      btnMinus.addEventListener('click', () => {
        if (currentQty > 1) {
          currentQty--;
          qtyVal.textContent = currentQty;
          if (addBtn) addBtn.textContent = `Add to Bag • ${cartStore.formatPrice(prod.priceDZD * currentQty)}`;
        }
      });
      btnPlus.addEventListener('click', () => {
        currentQty++;
        qtyVal.textContent = currentQty;
        if (addBtn) addBtn.textContent = `Add to Bag • ${cartStore.formatPrice(prod.priceDZD * currentQty)}`;
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        cartStore.addItem({
          id: prod.id,
          name: prod.name,
          priceDZD: prod.priceDZD,
          image: prod.images.primary,
          quantity: currentQty,
          isCustom: false,
          specs: {
            collection: prod.collection,
            materials: prod.materials
          }
        });
        showToast('Added to Bag', `${currentQty}x ${prod.name} added to your shopping bag.`);
        closeModal();
        document.dispatchEvent(new CustomEvent('cart:open'));
      });
    }
  }
}
