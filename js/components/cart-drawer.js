/**
 * ZAPHIRA — Slide-Out Shopping Bag Drawer Component
 */

import { cartStore } from '../state/cart-state.js';

export function initCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const drawer = document.getElementById('cart-drawer');
  const closeBtn = document.getElementById('cart-drawer-close');
  const itemsContainer = document.getElementById('cart-drawer-items');
  const subtotalEl = document.getElementById('cart-subtotal-display');
  const countEl = document.getElementById('cart-drawer-count');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  if (!drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  document.addEventListener('cart:open', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  cartStore.subscribe(() => {
    if (drawer.classList.contains('is-open')) {
      renderCart();
    }
  });

  // Quantity and Remove Event Delegation
  if (itemsContainer) {
    itemsContainer.addEventListener('click', (e) => {
      const btnMinus = e.target.closest('[data-cart-minus]');
      const btnPlus = e.target.closest('[data-cart-plus]');
      const btnRemove = e.target.closest('[data-cart-remove]');

      if (btnMinus) {
        const index = parseInt(btnMinus.getAttribute('data-cart-minus'), 10);
        const item = cartStore.items[index];
        if (item) cartStore.updateQuantity(index, item.quantity - 1);
        return;
      }

      if (btnPlus) {
        const index = parseInt(btnPlus.getAttribute('data-cart-plus'), 10);
        const item = cartStore.items[index];
        if (item) cartStore.updateQuantity(index, item.quantity + 1);
        return;
      }

      if (btnRemove) {
        const index = parseInt(btnRemove.getAttribute('data-cart-remove'), 10);
        cartStore.removeItem(index);
        return;
      }
    });
  }

  // Checkout trigger
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartStore.items.length === 0) return;
      closeDrawer();
      document.dispatchEvent(new CustomEvent('checkout:open'));
    });
  }

  function renderCart() {
    const items = cartStore.items;
    const count = cartStore.getItemCount();

    if (countEl) {
      countEl.textContent = `(${count})`;
    }

    if (subtotalEl) {
      subtotalEl.textContent = cartStore.formatPrice(cartStore.getSubtotalDZD());
    }

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: var(--space-12) 0; color: var(--text-muted);">
          <div style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: var(--space-2); color: var(--color-charcoal);">Your shopping bag is empty</div>
          <p style="font-size: var(--text-xs); margin-bottom: var(--space-6); text-transform: uppercase; letter-spacing: var(--tracking-wider);">Discover our handcrafted creations</p>
          <a href="#customizer-section" class="btn btn-primary btn-sm" onclick="document.getElementById('cart-drawer-close').click();">
            Create Your Bag
          </a>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    itemsContainer.innerHTML = items.map((item, index) => {
      let specsHtml = '';
      if (item.specs) {
        if (item.isCustom) {
          specsHtml = `
            <div class="cart-item-specs">
              <span><strong>Color:</strong> ${item.specs.color}</span><br>
              <span><strong>Material:</strong> ${item.specs.material}</span><br>
              <span><strong>Pearls:</strong> ${item.specs.pearls}</span><br>
              <span><strong>Hardware:</strong> ${item.specs.chain}</span>
              ${item.specs.monogram && item.specs.monogram !== 'None' ? `<br><span><strong>Monogram:</strong> "${item.specs.monogram}"</span>` : ''}
            </div>
          `;
        } else {
          specsHtml = `
            <div class="cart-item-specs">
              <span>${item.specs.collection || ''}</span>
            </div>
          `;
        }
      }

      return `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div>
              <div class="cart-item-name">${item.name}</div>
              ${specsHtml}
            </div>
            <div class="cart-item-bottom">
              <div class="cart-qty-control">
                <button type="button" class="cart-qty-btn" data-cart-minus="${index}" aria-label="Decrease quantity">-</button>
                <span class="cart-qty-value">${item.quantity}</span>
                <button type="button" class="cart-qty-btn" data-cart-plus="${index}" aria-label="Increase quantity">+</button>
              </div>
              <div class="cart-item-price">${cartStore.formatPrice(item.priceDZD * item.quantity)}</div>
              <button type="button" class="cart-item-remove" data-cart-remove="${index}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}
