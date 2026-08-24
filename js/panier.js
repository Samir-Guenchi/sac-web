/**
 * ZAPHIRA — Panier Page Controller
 */

import { cartStore } from './state/cart-state.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('panier-items-container');
  const countHeader = document.getElementById('panier-count-header');
  const subtotalVal = document.getElementById('panier-subtotal-val');
  const grandtotalVal = document.getElementById('panier-grandtotal-val');
  const emptyView = document.getElementById('empty-cart-view');
  const totalsBox = document.getElementById('panier-totals-box');
  const giftCheckbox = document.getElementById('gift-checkbox');
  const giftMsgContainer = document.getElementById('gift-msg-container');

  // Stepper Elements
  const btnGotoStep2 = document.getElementById('btn-goto-step-2');
  const btnSubmitOrder = document.getElementById('btn-submit-order');
  const backBtn = document.getElementById('panier-back-btn');
  const stepView1 = document.getElementById('step-view-1');
  const stepView2 = document.getElementById('step-view-2');
  const stepView3 = document.getElementById('step-view-3');
  const stepNode1 = document.getElementById('step-node-1');
  const stepNode2 = document.getElementById('step-node-2');
  const stepNode3 = document.getElementById('step-node-3');

  let currentStep = 1;

  function renderCart() {
    const items = cartStore.items;
    const count = cartStore.getItemCount();

    if (countHeader) {
      countHeader.textContent = `VOUS AVEZ ${count} OBJET${count > 1 ? 'S' : ''} DANS VOTRE PANIER.`;
    }

    if (items.length === 0) {
      if (container) container.innerHTML = '';
      if (emptyView) emptyView.style.display = 'block';
      if (totalsBox) totalsBox.style.display = 'none';
      if (btnGotoStep2) btnGotoStep2.style.display = 'none';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (totalsBox) totalsBox.style.display = 'block';
    if (btnGotoStep2) btnGotoStep2.style.display = 'inline-flex';

    if (container) {
      container.innerHTML = items.map((item, idx) => {
        const itemTotal = item.priceDZD * item.quantity;
        const formattedPrice = cartStore.formatPrice(itemTotal);
        
        let specsHtml = '';
        if (item.specs) {
          const s = item.specs;
          specsHtml = `
            <div class="panier-item-meta">
              ${s.colorName ? `Nuance : ${s.colorName}<br>` : ''}
              ${s.materialName ? `Matière : ${s.materialName}<br>` : ''}
              ${s.pearlName ? `Perles : ${s.pearlName}<br>` : ''}
              ${s.monogram ? `Gravure initiale : <strong>« ${s.monogram} »</strong><br>` : ''}
              Réf : ZPH-${item.id.toUpperCase()}
            </div>
          `;
        } else {
          specsHtml = `<div class="panier-item-meta">Maison de Haute Couture Alger • Réf : ZPH-${item.id.toUpperCase()}</div>`;
        }

        return `
          <div class="panier-item-card" data-item-idx="${idx}">
            <div class="panier-item-image">
              <img src="${item.image || 'assets/images/product-pearl-ivory.jpg'}" alt="${item.name}">
            </div>
            <div class="panier-item-details">
              <div>
                <h3 class="panier-item-title">${item.name}</h3>
                ${specsHtml}
              </div>
              <button type="button" class="panier-item-remove-btn" data-action="remove" data-idx="${idx}">Retirer</button>
            </div>
            <div class="panier-item-right">
              <div class="panier-qty-box">
                <button type="button" class="panier-qty-btn" data-action="dec" data-idx="${idx}">-</button>
                <span class="panier-qty-val">${item.quantity}</span>
                <button type="button" class="panier-qty-btn" data-action="inc" data-idx="${idx}">+</button>
              </div>
              <div class="panier-item-price">${formattedPrice}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    const subtotal = cartStore.getSubtotalDZD();
    const formattedSubtotal = cartStore.formatPrice(subtotal);

    if (subtotalVal) subtotalVal.textContent = formattedSubtotal;
    if (grandtotalVal) grandtotalVal.textContent = formattedSubtotal;

    const checkoutSubtotal = document.getElementById('checkout-subtotal-val');
    const checkoutGrandtotal = document.getElementById('checkout-grandtotal-val');
    if (checkoutSubtotal) checkoutSubtotal.textContent = formattedSubtotal;
    if (checkoutGrandtotal) checkoutGrandtotal.textContent = formattedSubtotal;
  }

  // Cart Interactions
  if (container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const idx = parseInt(btn.getAttribute('data-idx'), 10);

      if (action === 'remove') {
        cartStore.removeItem(idx);
      } else if (action === 'inc') {
        cartStore.updateQuantity(idx, cartStore.items[idx].quantity + 1);
      } else if (action === 'dec') {
        cartStore.updateQuantity(idx, cartStore.items[idx].quantity - 1);
      }
    });
  }

  // Gift Option toggle
  if (giftCheckbox && giftMsgContainer) {
    giftCheckbox.addEventListener('change', () => {
      giftMsgContainer.style.display = giftCheckbox.checked ? 'block' : 'none';
    });
  }

  // Stepper Navigation
  function setStep(step) {
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (step === 1) {
      stepView1.style.display = 'block';
      stepView2.style.display = 'none';
      stepView3.style.display = 'none';
      stepNode1.className = 'step-item is-active';
      stepNode2.className = 'step-item';
      stepNode3.className = 'step-item';
      if (backBtn) backBtn.href = 'index.html';
    } else if (step === 2) {
      stepView1.style.display = 'none';
      stepView2.style.display = 'block';
      stepView3.style.display = 'none';
      stepNode1.className = 'step-item is-completed';
      stepNode2.className = 'step-item is-active';
      stepNode3.className = 'step-item';
    } else if (step === 3) {
      stepView1.style.display = 'none';
      stepView2.style.display = 'none';
      stepView3.style.display = 'block';
      stepNode1.className = 'step-item is-completed';
      stepNode2.className = 'step-item is-completed';
      stepNode3.className = 'step-item is-active';
    }
  }

  if (btnGotoStep2) {
    btnGotoStep2.addEventListener('click', () => {
      if (cartStore.items.length > 0) {
        setStep(2);
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      if (currentStep === 2) {
        e.preventDefault();
        setStep(1);
      }
    });
  }

  if (btnSubmitOrder) {
    btnSubmitOrder.addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.getElementById('checkout-email')?.value || 'client@zaphira.dz';
      const prenom = document.getElementById('checkout-prenom')?.value || 'Client';
      const nom = document.getElementById('checkout-nom')?.value || 'Zaphira';
      const phone = document.getElementById('checkout-phone')?.value || '0550000000';
      const wilaya = document.getElementById('checkout-wilaya')?.value || '16 - Alger';
      const address = document.getElementById('checkout-address')?.value || 'Hydra, Alger';

      const orderId = 'ZPH-' + Math.floor(1000 + Math.random() * 9000);
      const orderIdEl = document.getElementById('confirmed-order-id');
      const detailsEl = document.getElementById('confirmed-order-details');

      if (orderIdEl) orderIdEl.textContent = '#' + orderId;
      if (detailsEl) {
        detailsEl.innerHTML = `
          <strong>Destinataire :</strong> ${prenom} ${nom}<br>
          <strong>E-mail :</strong> ${email}<br>
          <strong>Téléphone :</strong> ${phone}<br>
          <strong>Adresse :</strong> ${address}, Wilaya de ${wilaya}<br>
          <strong>Statut :</strong> En cours de confection à l'Atelier Alger
        `;
      }

      // Clear cart
      cartStore.items = [];
      cartStore.saveCart();

      setStep(3);
    });
  }

  // Payment radio styling
  document.querySelectorAll('.payment-method-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.payment-method-item').forEach(i => i.classList.remove('is-selected'));
      item.classList.add('is-selected');
      const radio = item.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  cartStore.subscribe(renderCart);
  renderCart();
});
