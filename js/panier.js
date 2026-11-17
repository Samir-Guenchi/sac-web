/**
 * ZAPHIRA — Panier Page Controller
 */

import { cartStore } from './state/cart-state.js';
import { WILAYAS } from './data/wilayas.js';
import { CONTACT } from './data/contact.js';
import { describeCartItem } from './utils/cart-display.js';
import { applyLanguage, t } from './utils/i18n.js';
import { escapeHtml } from './utils/escape.js';

const FALLBACK_IMAGE = 'assets/images/products/product-pearl-ivory.jpg';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('panier-items-container');
  const countHeader = document.getElementById('panier-count-header');
  const subtotalVal = document.getElementById('panier-subtotal-val');
  const grandtotalVal = document.getElementById('panier-grandtotal-val');
  const emptyView = document.getElementById('empty-cart-view');
  const filledView = document.getElementById('filled-cart-view');
  const giftCheckbox = document.getElementById('gift-checkbox');
  const giftMsgContainer = document.getElementById('gift-msg-container');
  const giftMsgField = document.getElementById('gift-msg-field');
  const wilayaSelect = document.getElementById('checkout-wilaya');
  const checkoutForm = document.getElementById('checkout-form');

  // Stepper Elements
  const btnGotoStep2 = document.getElementById('btn-goto-step-2');
  const backBtn = document.getElementById('panier-back-btn');
  const stepViews = [1, 2, 3].map(n => document.getElementById(`step-view-${n}`));
  const stepNodes = [1, 2, 3].map(n => document.getElementById(`step-node-${n}`));

  let currentStep = 1;

  function renderSpecs(item, info) {
    const lines = info.specs.map(([label, value]) => `${escapeHtml(label)} ${escapeHtml(value)}<br>`);
    if (info.monogram) {
      lines.push(`${escapeHtml(t('panier.specMonogram'))} <strong>« ${escapeHtml(info.monogram)} »</strong><br>`);
    }

    const ref = `${escapeHtml(t('panier.ref'))} ZPH-${escapeHtml(String(item.id).toUpperCase())}`;

    if (lines.length === 0) {
      const house = escapeHtml(info.collection || t('panier.houseLine'));
      return `<div class="panier-item-meta">${house} • ${ref}</div>`;
    }
    return `<div class="panier-item-meta">${lines.join('')}${ref}</div>`;
  }

  function renderServiceBlock() {
    const block = document.getElementById('panier-service-block');
    if (!block) return;
    // A number without `tel` is a placeholder: show it, but don't make it dialable
    const number = ({ display, tel }) => tel
      ? `<a href="tel:${escapeHtml(tel)}" class="panier-service-link" dir="ltr">${escapeHtml(display)}</a>`
      : `<span class="panier-service-link" dir="ltr">${escapeHtml(display)}</span>`;
    block.innerHTML = `
      <p class="panier-service-text">${escapeHtml(t('panier.serviceIntro'))}</p>
      <p class="panier-service-text">
        ${escapeHtml(t('panier.serviceWhatsapp'))} ${number(CONTACT.whatsapp)}<br>
        ${escapeHtml(t('panier.servicePhone'))} ${number(CONTACT.phone)}<br>
        ${escapeHtml(t('panier.serviceHours'))}
      </p>
    `;
  }

  function renderCart() {
    const items = cartStore.items;
    const count = cartStore.getItemCount();

    if (countHeader) {
      countHeader.textContent = t(count > 1 ? 'panier.countMany' : 'panier.countOne', { count });
    }

    if (items.length === 0) {
      if (container) container.innerHTML = '';
      if (emptyView) emptyView.style.display = 'flex';
      if (filledView) filledView.style.display = 'none';
      // Can't be in checkout with nothing to buy (e.g. emptied in another tab)
      if (currentStep === 2) setStep(1);
      return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (filledView) filledView.style.display = 'block';

    if (container) {
      container.innerHTML = items.map(item => {
        const key = escapeHtml(item.key);
        const info = describeCartItem(item);
        const name = escapeHtml(info.name);
        return `
          <div class="panier-item-card">
            <div class="panier-item-image">
              <img src="${escapeHtml(item.image || FALLBACK_IMAGE)}" alt="${name}">
            </div>
            <div class="panier-item-details">
              <div>
                <h3 class="panier-item-title">${name}</h3>
                ${renderSpecs(item, info)}
              </div>
              <button type="button" class="panier-item-remove-btn" data-action="remove" data-key="${key}">${escapeHtml(t('panier.remove'))}</button>
            </div>
            <div class="panier-item-right">
              <div class="panier-qty-box">
                <button type="button" class="panier-qty-btn" data-action="dec" data-key="${key}" aria-label="${escapeHtml(t('panier.decrease'))}">-</button>
                <span class="panier-qty-val">${item.quantity}</span>
                <button type="button" class="panier-qty-btn" data-action="inc" data-key="${key}" aria-label="${escapeHtml(t('panier.increase'))}">+</button>
              </div>
              <div class="panier-item-price">${escapeHtml(cartStore.formatPrice(item.priceDZD * item.quantity))}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    const formattedSubtotal = cartStore.formatPrice(cartStore.getSubtotalDZD());
    [subtotalVal, grandtotalVal,
      document.getElementById('checkout-subtotal-val'),
      document.getElementById('checkout-grandtotal-val')
    ].forEach(el => { if (el) el.textContent = formattedSubtotal; });
  }

  function renderWilayaOptions() {
    if (!wilayaSelect) return;
    const selected = wilayaSelect.value;
    wilayaSelect.innerHTML = [
      `<option value="">${escapeHtml(t('panier.wilayaPlaceholder'))}</option>`,
      ...WILAYAS.map(w => `<option value="${w.code}">${w.code} - ${escapeHtml(cartStore.language === 'ar' ? w.nameAr : w.name)}</option>`),
      `<option value="intl">${escapeHtml(t('panier.international'))}</option>`
    ].join('');
    wilayaSelect.value = selected;
  }

  // Cart Interactions (lines are addressed by their stable key, not list position)
  if (container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const key = btn.getAttribute('data-key');
      const item = cartStore.getItem(key);
      if (!item) return;

      const action = btn.getAttribute('data-action');
      if (action === 'remove') cartStore.removeItem(key);
      else if (action === 'inc') cartStore.updateQuantity(key, item.quantity + 1);
      else if (action === 'dec') cartStore.updateQuantity(key, item.quantity - 1);
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

    stepViews.forEach((view, i) => {
      if (view) view.style.display = i + 1 === step ? 'block' : 'none';
    });
    stepNodes.forEach((node, i) => {
      if (!node) return;
      const n = i + 1;
      node.className = `step-item${n < step ? ' is-completed' : ''}${n === step ? ' is-active' : ''}`;
    });
  }

  if (btnGotoStep2) {
    btnGotoStep2.addEventListener('click', () => {
      if (cartStore.items.length > 0) setStep(2);
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

  // The browser enforces the `required` fields before `submit` fires
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (cartStore.items.length === 0) {
        setStep(1);
        return;
      }

      const value = id => document.getElementById(id)?.value.trim() || '';
      const wilayaText = wilayaSelect?.selectedOptions[0]?.textContent || '';
      const giftMsg = giftCheckbox?.checked ? (giftMsgField?.value.trim() || '') : '';

      const orderIdEl = document.getElementById('confirmed-order-id');
      const detailsEl = document.getElementById('confirmed-order-details');

      if (orderIdEl) orderIdEl.textContent = `#ZPH-${Math.floor(100000 + Math.random() * 900000)}`;
      if (detailsEl) {
        const row = (labelKey, val) => `<strong>${escapeHtml(t(labelKey))}</strong> ${escapeHtml(val)}<br>`;
        detailsEl.innerHTML = [
          row('panier.recipient', `${value('checkout-prenom')} ${value('checkout-nom')}`),
          row('panier.emailLabel', value('checkout-email')),
          row('panier.phoneLabel', value('checkout-phone')),
          row('panier.addressLabel', `${value('checkout-address')}, ${wilayaText}`),
          giftMsg ? row('panier.giftLabel', giftMsg) : '',
          row('panier.status', t('panier.statusValue'))
        ].join('');
      }

      cartStore.clear();
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

  // Language: static text via data-i18n, dynamic parts re-rendered
  document.addEventListener('i18n:change', () => {
    renderWilayaOptions();
    renderServiceBlock();
    renderCart();
  });

  renderWilayaOptions();
  renderServiceBlock();
  applyLanguage();
  cartStore.subscribe(renderCart);
  renderCart();
});
