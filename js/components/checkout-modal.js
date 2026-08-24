/**
 * ZAPHIRA — Luxury Checkout Simulation Modal Component
 */

import { cartStore } from '../state/cart-state.js';
import { showToast } from './toast.js';

const WILAYAS = [
  "16 - Alger", "31 - Oran", "25 - Constantine", "06 - Béjaïa", "15 - Tizi Ouzou", 
  "09 - Blida", "13 - Tlemcen", "19 - Sétif", "23 - Annaba", "35 - Boumerdès", 
  "42 - Tipaza", "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", 
  "05 - Batna", "07 - Biskra", "08 - Béchar", "10 - Bouira", "11 - Tamanrasset", 
  "12 - Tébessa", "14 - Tiaret", "17 - Djelfa", "18 - Jijel", "20 - Saïda", 
  "21 - Skikda", "22 - Sidi Bel Abbès", "24 - Guelma", "26 - Médéa", "27 - Mostaganem", 
  "28 - M'Sila", "29 - Mascara", "30 - Ouargla", "32 - El Bayadh", "33 - Illizi", 
  "34 - Bordj Bou Arréridj", "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", 
  "39 - El Oued", "40 - Khenchela", "41 - Souk Ahras", "43 - Mila", "44 - Aïn Defla", 
  "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane",
  "International (Paris, London, Dubai, Worldwide)"
];

export function initCheckoutModal() {
  const backdrop = document.getElementById('checkout-backdrop');
  const wrapper = document.getElementById('checkout-modal-wrapper');
  if (!backdrop || !wrapper) return;

  function openCheckout() {
    backdrop.classList.add('is-active');
    wrapper.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    renderCheckoutForm();
  }

  function closeCheckout() {
    backdrop.classList.remove('is-active');
    wrapper.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  document.addEventListener('checkout:open', openCheckout);
  backdrop.addEventListener('click', closeCheckout);

  function renderCheckoutForm() {
    const subtotal = cartStore.getSubtotalDZD();

    wrapper.innerHTML = `
      <button class="modal-close-btn" id="checkout-close-btn" aria-label="Close checkout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="padding: var(--space-8);">
        <div style="text-align: center; margin-bottom: var(--space-6);">
          <div class="eyebrow" style="margin-bottom: var(--space-1);">Maison Zaphira</div>
          <h2 style="font-size: 1.875rem;">Bespoke Checkout</h2>
          <p style="font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: var(--tracking-wider);">Handcrafted to Order in Algeria</p>
        </div>

        <form id="luxury-checkout-form" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-8);" class="checkout-grid">
          <div>
            <h3 style="font-size: 1.15rem; margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-2);">1. Shipping Details</h3>
            
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" required class="input-luxury" placeholder="e.g. Yasmine Guenchi">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
              <div class="form-group">
                <label class="form-label">Phone (Algeria / Intl)</label>
                <input type="tel" required class="input-luxury" placeholder="0550 XX XX XX">
              </div>
              <div class="form-group">
                <label class="form-label">Email for Tracking</label>
                <input type="email" required class="input-luxury" placeholder="yasmine@example.com">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Wilaya / Region</label>
              <select required class="input-luxury" id="checkout-wilaya-select">
                ${WILAYAS.map(w => `<option value="${w}">${w}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Delivery Address</label>
              <input type="text" required class="input-luxury" placeholder="Street, Neighborhood, City">
            </div>

            <h3 style="font-size: 1.15rem; margin-top: var(--space-6); margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-2);">2. Payment Method</h3>
            
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              <label style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border: 1px solid var(--border-medium); border-radius: var(--radius-xs); cursor: pointer; background: var(--bg-surface-elevated);">
                <input type="radio" name="paymentMethod" value="cod" checked>
                <div>
                  <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase;">Cash on Delivery (Paiement à la Livraison)</div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">Pay upon receipt in Algeria (58 Wilayas)</div>
                </div>
              </label>

              <label style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border: 1px solid var(--border-medium); border-radius: var(--radius-xs); cursor: pointer; background: var(--bg-surface-elevated);">
                <input type="radio" name="paymentMethod" value="cib">
                <div>
                  <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase;">Carte CIB / Edahabia</div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">Secure Algerian interbank electronic payment</div>
                </div>
              </label>

              <label style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border: 1px solid var(--border-medium); border-radius: var(--radius-xs); cursor: pointer; background: var(--bg-surface-elevated);">
                <input type="radio" name="paymentMethod" value="card">
                <div>
                  <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase;">International Visa / Mastercard / Amex</div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">Worldwide insured luxury delivery</div>
                </div>
              </label>
            </div>
          </div>

          <div style="background-color: var(--color-ivory); padding: var(--space-6); border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.15rem; margin-bottom: var(--space-4);">Order Summary</h3>
              <div style="max-height: 200px; overflow-y: auto; margin-bottom: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
                ${cartStore.items.map(item => `
                  <div style="display: flex; justify-content: space-between; font-size: var(--text-xs);">
                    <span>${item.quantity}x ${item.name}</span>
                    <strong>${cartStore.formatPrice(item.priceDZD * item.quantity)}</strong>
                  </div>
                `).join('')}
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--text-xs);">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Subtotal</span>
                  <span>${cartStore.formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Handcrafted Atelier Packaging</span>
                  <span style="color: var(--color-champagne-dark); font-weight: 600;">COMPLIMENTARY</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Insured Delivery</span>
                  <span style="color: var(--color-champagne-dark); font-weight: 600;">FREE</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: var(--text-base); font-family: var(--font-serif); border-top: 1px solid var(--border-medium); padding-top: var(--space-3); margin-top: var(--space-2);">
                  <span>Total Amount</span>
                  <strong>${cartStore.formatPrice(subtotal)}</strong>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full" style="margin-top: var(--space-6);">
              Confirm & Place Order
            </button>
          </div>
        </form>
      </div>
    `;

    const closeBtn = wrapper.querySelector('#checkout-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeCheckout);

    const form = wrapper.querySelector('#luxury-checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        renderSuccessScreen();
      });
    }
  }

  function renderSuccessScreen() {
    const orderRef = `ZPH-${Math.floor(100000 + Math.random() * 900000)}`;
    cartStore.clear();

    wrapper.innerHTML = `
      <div style="padding: var(--space-12) var(--space-8); text-align: center;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--color-champagne-glow); border: 1px solid var(--color-champagne); display: inline-flex; align-items: center; justify-content: center; margin-bottom: var(--space-5); color: var(--color-champagne-dark);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="eyebrow" style="margin-bottom: var(--space-2);">Maison Zaphira</div>
        <h2 style="font-size: 2.25rem; margin-bottom: var(--space-3);">Thank you for your order</h2>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 480px; margin: 0 auto var(--space-6) auto; line-height: 1.6; font-weight: 300;">
          Your order reference is <strong>#${orderRef}</strong>. Our artisans at the Algiers atelier have begun preparing your bespoke creation. You will receive tracking details shortly.
        </p>
        <button type="button" class="btn btn-primary" id="success-continue-btn">
          Return to Maison Zaphira
        </button>
      </div>
    `;

    const continueBtn = wrapper.querySelector('#success-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', closeCheckout);
    }
    showToast('Order Confirmed', `Order #${orderRef} placed successfully.`);
  }
}
