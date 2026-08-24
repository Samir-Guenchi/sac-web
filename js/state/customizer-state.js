/**
 * ZAPHIRA — Customizer State Management
 */

import { CUSTOMIZER_CONFIG } from '../data/customizer-options.js';

class CustomizerStore {
  constructor() {
    this.selected = {
      color: 'ivory',
      material: 'organza',
      pearls: 'medium',
      chain: 'gold',
      monogram: ''
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.selected, this.calculatePrice()));
  }

  setOption(key, value) {
    if (this.selected[key] !== undefined) {
      this.selected[key] = value;
      this.notify();
    }
  }

  getSelectedDetails() {
    const colorObj = CUSTOMIZER_CONFIG.colors.find(c => c.id === this.selected.color) || CUSTOMIZER_CONFIG.colors[0];
    const materialObj = CUSTOMIZER_CONFIG.materials.find(m => m.id === this.selected.material) || CUSTOMIZER_CONFIG.materials[0];
    const pearlObj = CUSTOMIZER_CONFIG.pearls.find(p => p.id === this.selected.pearls) || CUSTOMIZER_CONFIG.pearls[0];
    const chainObj = CUSTOMIZER_CONFIG.chains.find(ch => ch.id === this.selected.chain) || CUSTOMIZER_CONFIG.chains[0];

    return {
      color: colorObj,
      material: materialObj,
      pearls: pearlObj,
      chain: chainObj,
      monogram: this.selected.monogram.trim().toUpperCase()
    };
  }

  calculatePrice() {
    const details = this.getSelectedDetails();
    let totalDZD = CUSTOMIZER_CONFIG.basePriceDZD;

    totalDZD += details.color.priceModifierDZD || 0;
    totalDZD += details.material.priceModifierDZD || 0;
    totalDZD += details.pearls.priceModifierDZD || 0;
    totalDZD += details.chain.priceModifierDZD || 0;

    if (details.monogram) {
      totalDZD += CUSTOMIZER_CONFIG.monogramCostDZD;
    }

    return totalDZD;
  }
}

export const customizerStore = new CustomizerStore();
