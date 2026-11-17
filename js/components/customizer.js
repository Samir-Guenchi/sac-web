/**
 * ZAPHIRA — Interactive Custom Bag Studio Component
 */

import { CUSTOMIZER_CONFIG } from '../data/customizer-options.js';
import { customizerStore } from '../state/customizer-state.js';
import { cartStore } from '../state/cart-state.js';
import { loc, t } from '../utils/i18n.js';
import { escapeHtml } from '../utils/escape.js';

export function initCustomizer() {
  const container = document.getElementById('customizer-studio-root');
  if (!container) return;

  renderCustomizerControls();
  bindCustomizerEvents();
  updateCustomizerView();

  // Re-render price & specs whenever customizer state or currency changes
  customizerStore.subscribe(() => updateCustomizerView());
  cartStore.subscribe(() => updatePriceDisplay());
  document.addEventListener('i18n:change', () => {
    renderCustomizerControls();
    updateCustomizerView();
  });
}

function renderCustomizerControls() {
  // Color Swatches
  const colorContainer = document.getElementById('customizer-colors-container');
  if (colorContainer) {
    colorContainer.innerHTML = CUSTOMIZER_CONFIG.colors.map(color => `
      <button type="button" 
              class="color-swatch-btn ${color.id === customizerStore.selected.color ? 'is-active' : ''}" 
              data-option-type="color" 
              data-value="${escapeHtml(color.id)}"
              style="background-color: ${escapeHtml(color.hex)};"
              title="${escapeHtml(loc(color.name))}"
              aria-label="${escapeHtml(loc(color.name))}">
      </button>
    `).join('');
  }

  // Material Pills
  const materialContainer = document.getElementById('customizer-materials-container');
  if (materialContainer) {
    materialContainer.innerHTML = CUSTOMIZER_CONFIG.materials.map(mat => `
      <button type="button" 
              class="option-pill-btn ${mat.id === customizerStore.selected.material ? 'is-active' : ''}" 
              data-option-type="material" 
              data-value="${escapeHtml(mat.id)}" title="${escapeHtml(loc(mat.description))}">
        ${escapeHtml(loc(mat.name))}
      </button>
    `).join('');
  }

  // Pearl Pills
  const pearlContainer = document.getElementById('customizer-pearls-container');
  if (pearlContainer) {
    pearlContainer.innerHTML = CUSTOMIZER_CONFIG.pearls.map(pearl => `
      <button type="button" 
              class="option-pill-btn ${pearl.id === customizerStore.selected.pearls ? 'is-active' : ''}" 
              data-option-type="pearls" 
              data-value="${escapeHtml(pearl.id)}" title="${escapeHtml(loc(pearl.description))}">
        ${escapeHtml(loc(pearl.name))}
      </button>
    `).join('');
  }

  // Chain Pills
  const chainContainer = document.getElementById('customizer-chains-container');
  if (chainContainer) {
    chainContainer.innerHTML = CUSTOMIZER_CONFIG.chains.map(chain => `
      <button type="button" 
              class="option-pill-btn ${chain.id === customizerStore.selected.chain ? 'is-active' : ''}" 
              data-option-type="chain" 
              data-value="${escapeHtml(chain.id)}" title="${escapeHtml(loc(chain.description))}">
        ${escapeHtml(loc(chain.name))}
      </button>
    `).join('');
  }
}

function bindCustomizerEvents() {
  const container = document.getElementById('customizer-studio-root');
  if (!container) return;

  // Option selection delegation
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-option-type]');
    if (!btn) return;

    const type = btn.getAttribute('data-option-type');
    const value = btn.getAttribute('data-value');

    customizerStore.setOption(type, value);

    // Update active class in group
    const siblings = btn.parentElement.querySelectorAll(`[data-option-type="${type}"]`);
    siblings.forEach(s => s.classList.remove('is-active'));
    btn.classList.add('is-active');
  });

  // Monogram Input
  const monogramInput = document.getElementById('customizer-monogram-input');
  if (monogramInput) {
    monogramInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
      e.target.value = val;
      customizerStore.setOption('monogram', val);
    });
  }

  // Add Bespoke Bag to Cart
  const addBespokeBtn = document.getElementById('customizer-add-to-bag-btn');
  if (addBespokeBtn) {
    addBespokeBtn.addEventListener('click', () => {
      const details = customizerStore.getSelectedDetails();
      const totalPrice = customizerStore.calculatePrice();

      const customBagItem = {
        id: `bespoke-zaphira-${Date.now()}`,
        // Display names are resolved per language from the option ids (utils/cart-display.js)
        name: t('studio.itemName', { color: loc(details.color.name) }),
        priceDZD: totalPrice,
        image: details.color.imageRef,
        isCustom: true,
        quantity: 1,
        specs: {
          colorId: details.color.id,
          materialId: details.material.id,
          pearlsId: details.pearls.id,
          chainId: details.chain.id,
          monogram: details.monogram || ''
        }
      };

      // cartStore fires `cart:item-added`, which opens the confirmation card
      cartStore.addItem(customBagItem);
    });
  }
}

function updateCustomizerView() {
  const details = customizerStore.getSelectedDetails();

  // Update selected value text labels
  const colorLabel = document.getElementById('selected-color-label');
  if (colorLabel) colorLabel.textContent = loc(details.color.name);

  const materialLabel = document.getElementById('selected-material-label');
  if (materialLabel) materialLabel.textContent = loc(details.material.name);

  const pearlLabel = document.getElementById('selected-pearl-label');
  if (pearlLabel) pearlLabel.textContent = loc(details.pearls.name);

  const chainLabel = document.getElementById('selected-chain-label');
  if (chainLabel) chainLabel.textContent = loc(details.chain.name);

  // Update Specs Summary Table
  const specColor = document.getElementById('spec-summary-color');
  if (specColor) specColor.textContent = loc(details.color.name);

  const specMat = document.getElementById('spec-summary-material');
  if (specMat) specMat.textContent = loc(details.material.name);

  const specPearl = document.getElementById('spec-summary-pearls');
  if (specPearl) specPearl.textContent = loc(details.pearls.name);

  const specChain = document.getElementById('spec-summary-chain');
  if (specChain) specChain.textContent = loc(details.chain.name);

  const specMono = document.getElementById('spec-summary-monogram');
  if (specMono) specMono.textContent = details.monogram ? t('studio.embossed', { mono: details.monogram }) : t('studio.none');

  // Update Visual Preview
  const bagBaseImg = document.getElementById('bag-layer-base-img');
  if (bagBaseImg) {
    bagBaseImg.src = details.color.imageRef;
  }

  // Update Monogram Foil on Preview Stage
  const monogramBadge = document.getElementById('bag-layer-monogram-badge');
  if (monogramBadge) {
    if (details.monogram) {
      monogramBadge.textContent = details.monogram;
      monogramBadge.classList.add('is-visible');
    } else {
      monogramBadge.classList.remove('is-visible');
    }
  }

  updatePriceDisplay();
}

function updatePriceDisplay() {
  const priceDisplay = document.getElementById('customizer-price-amount');
  if (priceDisplay) {
    const totalDZD = customizerStore.calculatePrice();
    priceDisplay.textContent = cartStore.formatPrice(totalDZD);
  }
}
